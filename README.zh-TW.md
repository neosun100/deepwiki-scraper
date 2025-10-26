# DeepWiki Scraper

[简体中文](README.zh-CN.md) | [繁體中文](README.zh-TW.md) | [English](README.en.md) | [日本語](README.ja.md)

---

將 DeepWiki 項目文檔抓取並合併為單個 Markdown 文件的工具，支持命令行和 Web 界面。

![Screenshot](screenshot.png)

## ✨ 功能特性

- ✅ **智能緩存**：自動保存抓取結果，相同 URL 直接使用緩存（⭐ 新功能）
- ✅ **Web UI 界面**：炫酷的漸變色界面，實時進度顯示
- ✅ **API 密鑰持久化**：輸入一次永久記住，刷新頁面自動恢復
- ✅ **多密鑰輪詢**：支持配置多個 API 密鑰，自動輪換使用
- ✅ **智能限速**：請求間自動延遲，避免速率限制
- ✅ **重試機制**：遇到錯誤自動重試，提高成功率
- ✅ **並發抓取**：可配置並發線程數，提高效率
- ✅ **Docker 部署**：一鍵啟動，開箱即用
- ✅ **命令行工具**：支持腳本化批量處理
- ✅ **多語言支持**：簡體中文、繁體中文、英文、日文

## 🚀 快速開始

### 方式一：Web 界面（推薦）

```bash
# 克隆倉庫
git clone <your-repo-url>
cd deepwiki-scraper

# 一鍵啟動
chmod +x start.sh
./start.sh
```

訪問：
- **前端界面**：http://localhost:8002
- **API 文檔**：http://localhost:8003/docs

### 方式二：Docker 部署

```bash
docker-compose up -d
# 或使用 Docker 直接運行
docker run -d -p 127.0.0.1:8002:8000 -p 127.0.0.1:8003:8001 -v $(pwd)/output:/app/output deepwiki-scraper
```

**注意**：端口映射使用 `127.0.0.1` 前綴確保僅本地訪問，提高安全性。

### 方式三：命令行工具

```bash
pip install -r requirements.txt
python deepwiki_scraper.py awslabs/cli-agent-orchestrator
```

## 📄 許可證

MIT License

---

Made with ❤️ by Neo Sun
