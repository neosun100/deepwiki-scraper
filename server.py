#!/usr/bin/env python3
"""
DeepWiki Scraper - FastAPI 后端服务
"""

from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from pydantic import BaseModel
from typing import List, Optional
import asyncio
import httpx
import time
import uuid
import os
import hashlib
from datetime import datetime
from urllib.parse import urlparse

app = FastAPI(title="DeepWiki Scraper API", version="1.0.0")

# CORS 配置
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

FIRECRAWL_API_URL = 'https://api.firecrawl.dev/v1/scrape'
DEEPWIKI_BASE = 'https://deepwiki.com'

# 任务存储
tasks = {}


class ScrapeRequest(BaseModel):
    url: str
    api_keys: List[str]
    workers: int = 3
    delay: float = 1.5


class TaskStatus(BaseModel):
    task_id: str
    status: str  # pending, processing, completed, failed
    progress: int
    total: int
    message: str
    result: Optional[dict] = None
    error: Optional[str] = None


def normalize_url(input_str: str) -> str:
    """标准化 URL"""
    input_str = input_str.strip()
    if input_str.startswith('http'):
        return input_str
    if '/' in input_str and not input_str.startswith('/'):
        return f"{DEEPWIKI_BASE}/{input_str}"
    raise ValueError(f"无法识别的输入格式: {input_str}")


def get_cache_filename(url: str) -> str:
    """根据 URL 生成缓存文件名"""
    url = normalize_url(url)
    project_path = url.replace(DEEPWIKI_BASE + '/', '').strip('/')
    # 使用项目路径作为文件名，替换斜杠为下划线
    safe_name = project_path.replace('/', '_')
    return f"{safe_name}.md"


def get_cache_filepath(url: str) -> str:
    """获取缓存文件的完整路径"""
    output_dir = 'output'
    os.makedirs(output_dir, exist_ok=True)
    filename = get_cache_filename(url)
    return os.path.join(output_dir, filename)


def check_cache_exists(url: str) -> Optional[dict]:
    """检查缓存是否存在，如果存在返回文件信息"""
    try:
        filepath = get_cache_filepath(url)
        if os.path.exists(filepath):
            stat = os.stat(filepath)
            return {
                'exists': True,
                'filepath': filepath,
                'filename': os.path.basename(filepath),
                'size': stat.st_size,
                'modified_time': datetime.fromtimestamp(stat.st_mtime).strftime('%Y-%m-%d %H:%M:%S')
            }
        return {'exists': False}
    except Exception as e:
        return {'exists': False, 'error': str(e)}


async def scrape_page(url: str, api_key: str, delay: float = 1.5):
    """抓取单个页面"""
    headers = {
        'Authorization': f'Bearer {api_key}',
        'Content-Type': 'application/json'
    }
    
    payload = {
        'url': url,
        'formats': ['markdown', 'links']
    }
    
    async with httpx.AsyncClient(timeout=30.0) as client:
        response = await client.post(FIRECRAWL_API_URL, json=payload, headers=headers)
        response.raise_for_status()
        data = response.json()
        
        await asyncio.sleep(delay)
        
        return {
            'url': url,
            'markdown': data.get('data', {}).get('markdown', ''),
            'links': data.get('data', {}).get('links', [])
        }


def extract_project_links(main_page_data: dict, project_path: str) -> List[str]:
    """提取项目子页面链接"""
    links = main_page_data.get('links', [])
    project_links = []
    
    for link in links:
        if isinstance(link, str):
            url = link
        elif isinstance(link, dict):
            url = link.get('url', '')
        else:
            continue
        
        if url.startswith(f"{DEEPWIKI_BASE}/{project_path}/"):
            if url != f"{DEEPWIKI_BASE}/{project_path}":
                project_links.append(url)
    
    return sorted(list(set(project_links)))


def merge_markdown(main_page: dict, sub_pages: List[dict], project_name: str) -> str:
    """合并 Markdown"""
    output = []
    
    output.append(f"# {project_name}\n")
    output.append(f"*生成自 DeepWiki*\n")
    output.append(f"*源地址: {main_page['url']}*\n")
    output.append(f"*生成时间: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}*\n")
    output.append("\n---\n\n")
    
    output.append("## 主页面\n\n")
    output.append(main_page['markdown'])
    output.append("\n\n---\n\n")
    
    for page in sub_pages:
        page_title = page['url'].split('/')[-1].replace('-', ' ').title()
        output.append(f"## {page_title}\n\n")
        output.append(page['markdown'])
        output.append("\n\n---\n\n")
    
    return ''.join(output)


async def scrape_task(task_id: str, url: str, api_keys: List[str], workers: int, delay: float):
    """后台抓取任务"""
    try:
        # 标准化 URL
        url = normalize_url(url)
        project_path = url.replace(DEEPWIKI_BASE + '/', '').strip('/')
        project_name = project_path.split('/')[-1]

        # 检查缓存
        cache_info = check_cache_exists(url)
        if cache_info['exists']:
            tasks[task_id]['status'] = 'completed'
            tasks[task_id]['progress'] = 1
            tasks[task_id]['total'] = 1
            tasks[task_id]['message'] = '使用缓存文件（无需重新抓取）'

            # 读取文件大小等信息
            with open(cache_info['filepath'], 'r', encoding='utf-8') as f:
                content = f.read()

            tasks[task_id]['result'] = {
                'project_name': project_name,
                'total_pages': 0,  # 缓存文件不知道页数
                'file_size': len(content),
                'output_file': cache_info['filepath'],
                'from_cache': True,
                'cache_time': cache_info['modified_time']
            }
            return

        tasks[task_id]['status'] = 'processing'
        tasks[task_id]['message'] = '正在抓取主页面...'
        
        # 抓取主页面
        key_index = 0
        main_page = await scrape_page(url, api_keys[key_index % len(api_keys)], delay)
        key_index += 1
        
        tasks[task_id]['progress'] = 1
        tasks[task_id]['message'] = '正在提取子页面链接...'
        
        # 提取子页面链接
        sub_links = extract_project_links(main_page, project_path)
        tasks[task_id]['total'] = len(sub_links) + 1
        tasks[task_id]['message'] = f'发现 {len(sub_links)} 个子页面，开始抓取...'
        
        # 并发抓取子页面
        sub_pages = []
        semaphore = asyncio.Semaphore(workers)
        
        async def scrape_with_semaphore(link):
            nonlocal key_index
            async with semaphore:
                api_key = api_keys[key_index % len(api_keys)]
                key_index += 1
                result = await scrape_page(link, api_key, delay)
                tasks[task_id]['progress'] += 1
                return result
        
        sub_pages = await asyncio.gather(*[scrape_with_semaphore(link) for link in sub_links])
        
        # 合并 Markdown
        tasks[task_id]['message'] = '正在合并 Markdown...'
        merged_content = merge_markdown(main_page, sub_pages, project_name)

        # 保存文件（使用统一的缓存文件路径）
        output_file = get_cache_filepath(url)
        
        with open(output_file, 'w', encoding='utf-8') as f:
            f.write(merged_content)
        
        # 完成
        tasks[task_id]['status'] = 'completed'
        tasks[task_id]['message'] = '抓取完成！'
        tasks[task_id]['result'] = {
            'project_name': project_name,
            'total_pages': len(sub_pages) + 1,
            'file_size': len(merged_content),
            'output_file': output_file,
            'from_cache': False
        }
        
    except Exception as e:
        tasks[task_id]['status'] = 'failed'
        tasks[task_id]['error'] = str(e)
        tasks[task_id]['message'] = f'抓取失败: {str(e)}'


@app.post("/scrape", response_model=dict)
async def create_scrape_task(request: ScrapeRequest, background_tasks: BackgroundTasks):
    """创建抓取任务"""
    task_id = str(uuid.uuid4())
    
    tasks[task_id] = {
        'task_id': task_id,
        'status': 'pending',
        'progress': 0,
        'total': 0,
        'message': '任务已创建，等待开始...',
        'result': None,
        'error': None,
        'created_at': time.time()
    }
    
    background_tasks.add_task(
        scrape_task,
        task_id,
        request.url,
        request.api_keys,
        request.workers,
        request.delay
    )
    
    return {'task_id': task_id}


@app.get("/task/{task_id}", response_model=TaskStatus)
async def get_task_status(task_id: str):
    """获取任务状态"""
    if task_id not in tasks:
        raise HTTPException(status_code=404, detail="任务不存在")
    
    return tasks[task_id]


@app.get("/download/{task_id}")
async def download_result(task_id: str):
    """下载结果文件"""
    if task_id not in tasks:
        raise HTTPException(status_code=404, detail="任务不存在")
    
    task = tasks[task_id]
    if task['status'] != 'completed':
        raise HTTPException(status_code=400, detail="任务未完成")
    
    output_file = task['result']['output_file']
    if not os.path.exists(output_file):
        raise HTTPException(status_code=404, detail="文件不存在")
    
    return FileResponse(
        output_file,
        media_type='text/markdown',
        filename=os.path.basename(output_file)
    )


@app.get("/check-cache")
async def check_cache(url: str):
    """检查缓存是否存在"""
    try:
        cache_info = check_cache_exists(url)
        return cache_info
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.get("/health")
async def health_check():
    """健康检查"""
    return {"status": "ok", "tasks": len(tasks)}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001, log_level="info")
