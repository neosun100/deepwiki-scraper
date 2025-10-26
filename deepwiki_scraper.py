#!/usr/bin/env python3
"""
DeepWiki Scraper - 将 DeepWiki 项目文档抓取并合并为单个 Markdown 文件
支持多密钥轮询和智能限速
"""

import os
import sys
import argparse
import requests
import time
import threading
from urllib.parse import urlparse
from concurrent.futures import ThreadPoolExecutor, as_completed
from dotenv import load_dotenv
from tqdm import tqdm

# 加载环境变量
load_dotenv()

FIRECRAWL_API_URL = 'https://api.firecrawl.dev/v1/scrape'
DEEPWIKI_BASE = 'https://deepwiki.com'


class APIKeyManager:
    """API 密钥管理器，支持多密钥轮询"""
    
    def __init__(self):
        self.keys = self._load_keys()
        self.current_index = 0
        self.lock = threading.Lock()
        
    def _load_keys(self):
        """从环境变量加载所有可用的 API 密钥"""
        keys = []
        
        # 主密钥
        main_key = os.getenv('FIRECRAWL_API_KEY')
        if main_key:
            keys.append(main_key)
        
        # 其他命名密钥
        key_suffixes = ['LASALLE', 'FALLY', 'JIASUNM', 'SDHBG']
        for suffix in key_suffixes:
            key = os.getenv(f'FIRECRAWL_API_KEY_{suffix}')
            if key:
                keys.append(key)
        
        if not keys:
            raise ValueError("未找到任何 FIRECRAWL_API_KEY，请在 .env 文件中配置")
        
        print(f"✓ 加载了 {len(keys)} 个 API 密钥")
        return keys
    
    def get_next_key(self):
        """获取下一个密钥（轮询）"""
        with self.lock:
            key = self.keys[self.current_index]
            self.current_index = (self.current_index + 1) % len(self.keys)
            return key
    
    def get_key_count(self):
        """获取密钥总数"""
        return len(self.keys)


def normalize_url(input_str):
    """将输入标准化为完整的 DeepWiki URL"""
    input_str = input_str.strip()
    
    if input_str.startswith('http'):
        return input_str
    
    # 简写形式：awslabs/cli-agent-orchestrator
    if '/' in input_str and not input_str.startswith('/'):
        return f"{DEEPWIKI_BASE}/{input_str}"
    
    raise ValueError(f"无法识别的输入格式: {input_str}")


def scrape_page(url, key_manager, retry=3, base_delay=1.5, pbar=None):
    """使用 Firecrawl API 抓取单个页面，支持多密钥轮询和重试"""
    
    for attempt in range(retry):
        # 获取下一个密钥
        api_key = key_manager.get_next_key()
        
        headers = {
            'Authorization': f'Bearer {api_key}',
            'Content-Type': 'application/json'
        }
        
        payload = {
            'url': url,
            'formats': ['markdown', 'links']
        }
        
        try:
            response = requests.post(FIRECRAWL_API_URL, json=payload, headers=headers, timeout=30)
            response.raise_for_status()
            
            data = response.json()
            
            # 请求成功后延迟，避免速率限制
            time.sleep(base_delay)
            
            if pbar:
                pbar.update(1)
            
            return {
                'url': url,
                'markdown': data.get('data', {}).get('markdown', ''),
                'links': data.get('data', {}).get('links', [])
            }
            
        except requests.exceptions.HTTPError as e:
            if e.response.status_code == 429:
                # 遇到速率限制，增加等待时间
                wait_time = base_delay * (2 ** attempt)
                if pbar:
                    pbar.write(f"  ⚠ 速率限制 (429)，等待 {wait_time:.1f} 秒...")
                time.sleep(wait_time)
                
                if attempt == retry - 1:
                    raise Exception(f"达到最大重试次数，仍然遇到速率限制: {url}")
            else:
                raise
                
        except Exception as e:
            if attempt == retry - 1:
                raise
            if pbar:
                pbar.write(f"  ⚠ 错误: {e}，重试中...")
            time.sleep(base_delay)


def extract_project_links(main_page_data, project_path):
    """从主页面提取所有项目相关的子页面链接"""
    links = main_page_data.get('links', [])
    project_links = []
    
    for link in links:
        if isinstance(link, str):
            url = link
        elif isinstance(link, dict):
            url = link.get('url', '')
        else:
            continue
        
        # 只保留同项目下的子页面
        if url.startswith(f"{DEEPWIKI_BASE}/{project_path}/"):
            # 排除主页面本身
            if url != f"{DEEPWIKI_BASE}/{project_path}":
                project_links.append(url)
    
    # 去重并排序
    project_links = sorted(list(set(project_links)))
    return project_links


def scrape_pages_parallel(urls, key_manager, max_workers=2, base_delay=1.5):
    """并发抓取多个页面，带进度条"""
    results = []
    
    with tqdm(total=len(urls), desc="抓取子页面", unit="页") as pbar:
        with ThreadPoolExecutor(max_workers=max_workers) as executor:
            future_to_url = {
                executor.submit(scrape_page, url, key_manager, base_delay=base_delay, pbar=pbar): url 
                for url in urls
            }
            
            for future in as_completed(future_to_url):
                url = future_to_url[future]
                try:
                    result = future.result()
                    results.append(result)
                except Exception as e:
                    pbar.write(f"✗ 抓取失败 {url}: {e}")
    
    return results


def merge_markdown(main_page, sub_pages, project_name):
    """合并所有页面的 Markdown 内容"""
    output = []
    
    # 添加标题和元信息
    output.append(f"# {project_name}\n")
    output.append(f"*生成自 DeepWiki*\n")
    output.append(f"*源地址: {main_page['url']}*\n")
    output.append("\n---\n\n")
    
    # 主页面内容
    output.append("## 主页面\n\n")
    output.append(main_page['markdown'])
    output.append("\n\n---\n\n")
    
    # 子页面内容
    for page in sub_pages:
        # 从 URL 提取页面标题
        page_title = page['url'].split('/')[-1].replace('-', ' ').title()
        output.append(f"## {page_title}\n\n")
        output.append(page['markdown'])
        output.append("\n\n---\n\n")
    
    return ''.join(output)


def main():
    parser = argparse.ArgumentParser(description='DeepWiki 文档抓取工具（支持多密钥轮询）')
    parser.add_argument('url', help='DeepWiki URL 或简写形式 (如: awslabs/cli-agent-orchestrator)')
    parser.add_argument('-o', '--output', help='输出文件名 (默认: 项目名.md)')
    parser.add_argument('-w', '--workers', type=int, default=2, help='并发抓取线程数 (默认: 2)')
    parser.add_argument('-d', '--delay', type=float, default=1.5, help='请求间延迟秒数 (默认: 1.5)')
    
    args = parser.parse_args()
    
    try:
        # 初始化密钥管理器
        key_manager = APIKeyManager()
        
        # 标准化 URL
        url = normalize_url(args.url)
        parsed = urlparse(url)
        project_path = parsed.path.strip('/')
        project_name = project_path.split('/')[-1]
        
        print(f"\n开始抓取项目: {project_name}")
        print(f"URL: {url}")
        print(f"并发数: {args.workers}, 延迟: {args.delay}s\n")
        
        # 抓取主页面
        print("\n📥 步骤 1/4: 抓取主页面...")
        main_page = scrape_page(url, key_manager, base_delay=args.delay)
        print("✓ 主页面抓取完成")
        
        # 提取子页面链接
        print("\n🔍 步骤 2/4: 提取子页面链接...")
        sub_links = extract_project_links(main_page, project_path)
        print(f"✓ 发现 {len(sub_links)} 个子页面")
        
        # 并发抓取所有子页面
        print(f"\n📦 步骤 3/4: 抓取所有子页面...")
        sub_pages = scrape_pages_parallel(sub_links, key_manager, max_workers=args.workers, base_delay=args.delay)
        print(f"✓ 成功抓取 {len(sub_pages)}/{len(sub_links)} 个子页面")
        
        # 合并 Markdown
        print("\n📝 步骤 4/4: 合并 Markdown...")
        merged_content = merge_markdown(main_page, sub_pages, project_name)
        
        # 保存文件
        output_file = args.output or f"{project_name}.md"
        with open(output_file, 'w', encoding='utf-8') as f:
            f.write(merged_content)
        
        print(f"\n{'='*50}")
        print(f"✅ 完成！")
        print(f"📄 输出文件: {output_file}")
        print(f"📊 总页数: {len(sub_pages) + 1}")
        print(f"📝 文件大小: {len(merged_content):,} 字符")
        print(f"{'='*50}\n")
        
    except Exception as e:
        print(f"\n❌ 错误: {e}", file=sys.stderr)
        sys.exit(1)


if __name__ == '__main__':
    main()
