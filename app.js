// API 配置
// 自动检测 API 地址：如果通过 nginx 访问则使用 /api，否则使用 localhost:8003
const API_BASE = window.location.hostname === 'localhost' && window.location.port === '8002'
    ? 'http://localhost:8003'
    : '/api';
const STORAGE_KEY = 'deepwiki_api_keys';

// DOM 元素
const apiKeysInput = document.getElementById('apiKeys');
const keyCountSpan = document.getElementById('keyCount');
const clearKeysBtn = document.getElementById('clearKeys');
const projectUrlInput = document.getElementById('projectUrl');
const workersInput = document.getElementById('workers');
const delayInput = document.getElementById('delay');
const startBtn = document.getElementById('startBtn');
const progressSection = document.getElementById('progressSection');
const progressFill = document.getElementById('progressFill');
const progressPercent = document.getElementById('progressPercent');
const currentProcessing = document.getElementById('currentProcessing');
const totalPages = document.getElementById('totalPages');
const concurrency = document.getElementById('concurrency');
const logSection = document.getElementById('logSection');
const logContent = document.getElementById('logContent');
const clearLogBtn = document.getElementById('clearLogBtn');
const resultSection = document.getElementById('resultSection');
const errorSection = document.getElementById('errorSection');
const downloadBtn = document.getElementById('downloadBtn');

let currentTaskId = null;
let pollInterval = null;

// 日志系统
function addLog(message, type = 'info') {
    const time = new Date().toLocaleTimeString('zh-CN', { hour12: false });
    const logEntry = document.createElement('div');
    logEntry.className = `log-entry log-${type}`;
    
    const icon = {
        'info': 'ℹ️',
        'success': '✅',
        'warning': '⚠️',
        'error': '❌',
        'debug': '🔍'
    }[type] || 'ℹ️';
    
    logEntry.innerHTML = `<span class="log-time">[${time}]</span> ${icon} ${message}`;
    logContent.appendChild(logEntry);
    logContent.scrollTop = logContent.scrollHeight;
}

function clearLog() {
    logContent.innerHTML = '';
}

// 清空日志按钮
clearLogBtn.addEventListener('click', clearLog);

// 页面加载时恢复 API 密钥
window.addEventListener('DOMContentLoaded', () => {
    loadApiKeys();
    updateKeyCount();
});

// 加载保存的 API 密钥
function loadApiKeys() {
    const savedKeys = localStorage.getItem(STORAGE_KEY);
    if (savedKeys) {
        apiKeysInput.value = savedKeys;
        console.log('✅ 已从 localStorage 恢复 API 密钥');
    }
}

// 保存 API 密钥到 localStorage
function saveApiKeys() {
    const keys = apiKeysInput.value.trim();
    if (keys) {
        localStorage.setItem(STORAGE_KEY, keys);
        console.log('✅ API 密钥已保存到 localStorage');
    }
}

// 清除 API 密钥
clearKeysBtn.addEventListener('click', () => {
    if (confirm(t('clearKeysConfirm'))) {
        localStorage.removeItem(STORAGE_KEY);
        apiKeysInput.value = '';
        updateKeyCount();
        console.log('🗑️ API 密钥已清除');
    }
});

// 更新密钥计数
function updateKeyCount() {
    const keys = getApiKeys();
    const keyCountSpan = document.getElementById('keyCount');
    if (keys.length === 0) {
        keyCountSpan.textContent = t('noKeys');
        keyCountSpan.style.color = '#fa709a';
    } else {
        keyCountSpan.textContent = t('keysConfigured', { count: keys.length });
        keyCountSpan.style.color = '#4facfe';
    }
}

// 监听密钥输入变化
apiKeysInput.addEventListener('input', () => {
    updateKeyCount();
    saveApiKeys();
});

// 获取 API 密钥列表
function getApiKeys() {
    const text = apiKeysInput.value.trim();
    if (!text) return [];
    
    // 支持逗号或换行分隔
    const keys = text.split(/[,\n]/)
        .map(k => k.trim())
        .filter(k => k.length > 0);
    
    // 随机打乱顺序（负载均衡）
    return shuffleArray(keys);
}

// 随机打乱数组
function shuffleArray(array) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

// 开始抓取
startBtn.addEventListener('click', async () => {
    // 验证输入
    const keys = getApiKeys();
    if (keys.length === 0) {
        alert(t('errorNoKeys'));
        apiKeysInput.focus();
        return;
    }

    const url = projectUrlInput.value.trim();
    if (!url) {
        alert(t('errorNoUrl'));
        projectUrlInput.focus();
        return;
    }

    const workers = parseInt(workersInput.value);
    const delay = parseFloat(delayInput.value);

    // 保存密钥
    saveApiKeys();

    // 检查缓存
    try {
        addLog('正在检查缓存...', 'debug');
        const cacheResponse = await fetch(`${API_BASE}/check-cache?url=${encodeURIComponent(url)}`);
        if (cacheResponse.ok) {
            const cacheInfo = await cacheResponse.json();
            if (cacheInfo.exists) {
                addLog(`发现缓存文件: ${cacheInfo.filename}`, 'success');
                addLog(`文件大小: ${formatBytes(cacheInfo.size)}, 创建时间: ${cacheInfo.modified_time}`, 'info');

                const useCache = confirm(
                    `发现缓存文件！\n\n` +
                    `文件名: ${cacheInfo.filename}\n` +
                    `大小: ${formatBytes(cacheInfo.size)}\n` +
                    `创建时间: ${cacheInfo.modified_time}\n\n` +
                    `是否直接使用缓存？\n` +
                    `点击"确定"使用缓存，点击"取消"重新抓取`
                );

                if (!useCache) {
                    addLog('用户选择重新抓取', 'info');
                } else {
                    addLog('用户选择使用缓存', 'info');
                }
            }
        }
    } catch (error) {
        console.error('检查缓存失败:', error);
        addLog('缓存检查失败，将继续新抓取', 'warning');
    }

    // 禁用按钮
    startBtn.disabled = true;
    startBtn.querySelector('[data-i18n="startScraping"]').textContent = t('scraping');

    // 隐藏结果和错误
    resultSection.style.display = 'none';
    errorSection.style.display = 'none';

    // 显示进度和日志
    progressSection.style.display = 'block';
    logSection.style.display = 'block';

    addLog(`开始抓取项目: ${url}`, 'info');
    addLog(`并发数: ${workers}, 延迟: ${delay}s`, 'debug');

    try {
        // 创建任务
        const response = await fetch(`${API_BASE}/scrape`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                url: url,
                api_keys: keys,
                workers: workers,
                delay: delay
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        currentTaskId = data.task_id;

        addLog(`任务已创建: ${currentTaskId}`, 'success');
        addLog('开始轮询任务状态...', 'debug');

        // 开始轮询任务状态
        startPolling();

    } catch (error) {
        showError(error.message);
        resetButton();
    }
});

// 重置进度
function resetProgress() {
    progressFill.style.width = '0%';
    progressFill.querySelector('.progress-text').textContent = '0%';
    progressPercent.textContent = '0';
    currentProcessing.textContent = '0';
    totalPages.textContent = '0';
    concurrency.textContent = '0';
    clearLog();
}

// 开始轮询
function startPolling() {
    pollInterval = setInterval(checkTaskStatus, 1000);
}

// 停止轮询
function stopPolling() {
    if (pollInterval) {
        clearInterval(pollInterval);
        pollInterval = null;
    }
}

// 检查任务状态
async function checkTaskStatus() {
    if (!currentTaskId) return;
    
    try {
        const response = await fetch(`${API_BASE}/task/${currentTaskId}`);
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        
        const task = await response.json();
        updateProgress(task);
        
        if (task.status === 'completed') {
            stopPolling();
            showResult(task.result);
            resetButton();
        } else if (task.status === 'failed') {
            stopPolling();
            showError(task.error || '未知错误');
            resetButton();
        }
        
    } catch (error) {
        console.error('轮询错误:', error);
    }
}

// 更新进度
function updateProgress(task) {
    const percent = task.total > 0 ? Math.round((task.progress / task.total) * 100) : 0;
    
    progressFill.style.width = `${percent}%`;
    progressFill.querySelector('.progress-text').textContent = `${percent}%`;
    progressPercent.textContent = percent;
    currentProcessing.textContent = task.progress;
    totalPages.textContent = task.total;
    
    // 计算并发数（简化版）
    const concurrent = Math.min(3, task.total - task.progress);
    concurrency.textContent = concurrent > 0 ? concurrent : 0;
    
    // 添加状态日志
    if (task.message && task.message !== lastMessage) {
        const logType = task.status === 'failed' ? 'error' : 
                       task.status === 'completed' ? 'success' : 'info';
        addLog(task.message, logType);
        lastMessage = task.message;
    }
}

let lastMessage = '';

// 显示结果
function showResult(result) {
    progressSection.style.display = 'none';
    resultSection.style.display = 'block';

    if (result.from_cache) {
        addLog('使用缓存文件！', 'success');
        addLog(`缓存时间: ${result.cache_time}`, 'info');
    } else {
        addLog('抓取完成！', 'success');
        addLog(`总页数: ${result.total_pages}`, 'info');
    }
    addLog(`项目: ${result.project_name}`, 'info');
    addLog(`文件大小: ${formatBytes(result.file_size)}`, 'info');

    document.getElementById('resultProject').textContent = result.project_name;
    document.getElementById('resultPages').textContent = result.from_cache ? '(缓存)' : result.total_pages;
    document.getElementById('resultSize').textContent = formatBytes(result.file_size);

    // 设置下载按钮
    downloadBtn.onclick = () => {
        addLog('开始下载文件...', 'info');
        window.location.href = `${API_BASE}/download/${currentTaskId}`;
    };
}

// 显示错误
function showError(message) {
    progressSection.style.display = 'none';
    errorSection.style.display = 'block';
    document.getElementById('errorMessage').textContent = message;
    
    addLog(`错误: ${message}`, 'error');
}

// 重置按钮
function resetButton() {
    startBtn.disabled = false;
    startBtn.querySelector('[data-i18n="startScraping"]').textContent = t('startScraping');
}

// 格式化字节
function formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

// 页面卸载时停止轮询
window.addEventListener('beforeunload', () => {
    stopPolling();
});
