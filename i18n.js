// 多语言配置
const translations = {
    'zh-CN': {
        // 头部
        title: 'DeepWiki Scraper',
        subtitle: '将 DeepWiki 项目文档抓取并合并为单个 Markdown 文件',
        
        // API 密钥
        apiKeyTitle: '🔑 API 密钥配置',
        apiKeyPlaceholder: '输入 Firecrawl API 密钥（多个密钥用逗号或换行分隔）\n例如：\nfc-key1\nfc-key2\nfc-key3',
        noKeys: '未配置密钥',
        keysConfigured: '已配置 {count} 个密钥',
        clearKeys: '清除密钥',
        clearKeysConfirm: '确定要清除所有保存的 API 密钥吗？',
        
        // URL 输入
        urlTitle: '📝 输入项目地址',
        urlPlaceholder: '输入 DeepWiki URL 或简写形式（如：awslabs/cli-agent-orchestrator）',
        urlExample: '示例：',
        
        // 高级选项
        optionsTitle: '⚙️ 高级选项',
        workers: '并发线程数',
        delay: '请求延迟（秒）',
        
        // 按钮
        startScraping: '开始抓取',
        scraping: '抓取中...',
        download: '下载 Markdown 文件',
        restart: '重新开始',
        
        // 进度
        progressTitle: '📊 抓取进度',
        completed: '已完成',
        pages: '页',
        concurrentTasks: '并行任务数',
        preparing: '准备中...',
        scrapingMain: '正在抓取主页面...',
        extractingLinks: '正在提取子页面链接...',
        foundPages: '发现 {count} 个子页面，开始抓取...',
        merging: '正在合并 Markdown...',
        
        // 日志
        processingLog: '处理日志',
        clearLog: '清空',
        
        // 结果
        resultTitle: '✅ 抓取完成',
        projectName: '项目名称',
        totalPages: '总页数',
        fileSize: '文件大小',
        
        // 错误
        errorTitle: '❌ 抓取失败',
        errorNoKeys: '请先配置 API 密钥！',
        errorNoUrl: '请输入项目地址！',
        
        // 页脚
        madeWith: 'Made with ❤️ by',
    },
    
    'zh-TW': {
        title: 'DeepWiki Scraper',
        subtitle: '將 DeepWiki 項目文檔抓取並合併為單個 Markdown 文件',
        
        apiKeyTitle: '🔑 API 密鑰配置',
        apiKeyPlaceholder: '輸入 Firecrawl API 密鑰（多個密鑰用逗號或換行分隔）\n例如：\nfc-key1\nfc-key2\nfc-key3',
        noKeys: '未配置密鑰',
        keysConfigured: '已配置 {count} 個密鑰',
        clearKeys: '清除密鑰',
        clearKeysConfirm: '確定要清除所有保存的 API 密鑰嗎？',
        
        urlTitle: '📝 輸入項目地址',
        urlPlaceholder: '輸入 DeepWiki URL 或簡寫形式（如：awslabs/cli-agent-orchestrator）',
        urlExample: '示例：',
        
        optionsTitle: '⚙️ 高級選項',
        workers: '並發線程數',
        delay: '請求延遲（秒）',
        
        startScraping: '開始抓取',
        scraping: '抓取中...',
        download: '下載 Markdown 文件',
        restart: '重新開始',
        
        progressTitle: '📊 抓取進度',
        completed: '已完成',
        pages: '頁',
        concurrentTasks: '並行任務數',
        preparing: '準備中...',
        scrapingMain: '正在抓取主頁面...',
        extractingLinks: '正在提取子頁面鏈接...',
        foundPages: '發現 {count} 個子頁面，開始抓取...',
        merging: '正在合併 Markdown...',
        
        processingLog: '處理日誌',
        clearLog: '清空',
        
        resultTitle: '✅ 抓取完成',
        projectName: '項目名稱',
        totalPages: '總頁數',
        fileSize: '文件大小',
        
        errorTitle: '❌ 抓取失敗',
        errorNoKeys: '請先配置 API 密鑰！',
        errorNoUrl: '請輸入項目地址！',
        
        madeWith: 'Made with ❤️ by',
    },
    
    'en': {
        title: 'DeepWiki Scraper',
        subtitle: 'Scrape and merge DeepWiki project documentation into a single Markdown file',
        
        apiKeyTitle: '🔑 API Key Configuration',
        apiKeyPlaceholder: 'Enter Firecrawl API keys (separate multiple keys with commas or newlines)\nExample:\nfc-key1\nfc-key2\nfc-key3',
        noKeys: 'No keys configured',
        keysConfigured: '{count} key(s) configured',
        clearKeys: 'Clear Keys',
        clearKeysConfirm: 'Are you sure you want to clear all saved API keys?',
        
        urlTitle: '📝 Enter Project URL',
        urlPlaceholder: 'Enter DeepWiki URL or shorthand (e.g., awslabs/cli-agent-orchestrator)',
        urlExample: 'Examples:',
        
        optionsTitle: '⚙️ Advanced Options',
        workers: 'Concurrent Workers',
        delay: 'Request Delay (seconds)',
        
        startScraping: 'Start Scraping',
        scraping: 'Scraping...',
        download: 'Download Markdown File',
        restart: 'Restart',
        
        progressTitle: '📊 Scraping Progress',
        completed: 'Completed',
        pages: 'pages',
        concurrentTasks: 'Concurrent Tasks',
        preparing: 'Preparing...',
        scrapingMain: 'Scraping main page...',
        extractingLinks: 'Extracting subpage links...',
        foundPages: 'Found {count} subpage(s), starting scrape...',
        merging: 'Merging Markdown...',
        
        processingLog: 'Processing Log',
        clearLog: 'Clear',
        
        resultTitle: '✅ Scraping Complete',
        projectName: 'Project Name',
        totalPages: 'Total Pages',
        fileSize: 'File Size',
        
        errorTitle: '❌ Scraping Failed',
        errorNoKeys: 'Please configure API keys first!',
        errorNoUrl: 'Please enter project URL!',
        
        madeWith: 'Made with ❤️ by',
    },
    
    'ja': {
        title: 'DeepWiki Scraper',
        subtitle: 'DeepWiki プロジェクトドキュメントをスクレイピングして単一の Markdown ファイルに統合',
        
        apiKeyTitle: '🔑 API キー設定',
        apiKeyPlaceholder: 'Firecrawl API キーを入力（複数のキーはカンマまたは改行で区切る）\n例：\nfc-key1\nfc-key2\nfc-key3',
        noKeys: 'キーが設定されていません',
        keysConfigured: '{count} 個のキーが設定されています',
        clearKeys: 'キーをクリア',
        clearKeysConfirm: '保存されているすべての API キーをクリアしてもよろしいですか？',
        
        urlTitle: '📝 プロジェクト URL を入力',
        urlPlaceholder: 'DeepWiki URL または短縮形式を入力（例：awslabs/cli-agent-orchestrator）',
        urlExample: '例：',
        
        optionsTitle: '⚙️ 詳細オプション',
        workers: '同時実行スレッド数',
        delay: 'リクエスト遅延（秒）',
        
        startScraping: 'スクレイピング開始',
        scraping: 'スクレイピング中...',
        download: 'Markdown ファイルをダウンロード',
        restart: '再起動',
        
        progressTitle: '📊 スクレイピング進行状況',
        completed: '完了',
        pages: 'ページ',
        concurrentTasks: '同時実行タスク数',
        preparing: '準備中...',
        scrapingMain: 'メインページをスクレイピング中...',
        extractingLinks: 'サブページリンクを抽出中...',
        foundPages: '{count} 個のサブページが見つかりました。スクレイピングを開始します...',
        merging: 'Markdown を統合中...',
        
        processingLog: '処理ログ',
        clearLog: 'クリア',
        
        resultTitle: '✅ スクレイピング完了',
        projectName: 'プロジェクト名',
        totalPages: '総ページ数',
        fileSize: 'ファイルサイズ',
        
        errorTitle: '❌ スクレイピング失敗',
        errorNoKeys: 'まず API キーを設定してください！',
        errorNoUrl: 'プロジェクト URL を入力してください！',
        
        madeWith: 'Made with ❤️ by',
    }
};

// 获取当前语言
function getCurrentLanguage() {
    return localStorage.getItem('language') || 'zh-CN';
}

// 设置语言
function setLanguage(lang) {
    localStorage.setItem('language', lang);
    updateUI();
}

// 获取翻译文本
function t(key, params = {}) {
    const lang = getCurrentLanguage();
    let text = translations[lang][key] || translations['zh-CN'][key] || key;
    
    // 替换参数
    Object.keys(params).forEach(param => {
        text = text.replace(`{${param}}`, params[param]);
    });
    
    return text;
}

// 更新 UI
function updateUI() {
    // 更新所有带 data-i18n 属性的元素
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
            el.placeholder = t(key);
        } else {
            el.textContent = t(key);
        }
    });
    
    // 更新语言选择器
    const langSelector = document.getElementById('langSelector');
    if (langSelector) {
        langSelector.value = getCurrentLanguage();
    }
}

// 页面加载时初始化
document.addEventListener('DOMContentLoaded', () => {
    updateUI();
});
