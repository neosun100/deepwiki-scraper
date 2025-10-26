# DeepWiki Scraper

<div align="center">

[![GitHub stars](https://img.shields.io/github/stars/neosun100/deepwiki-scraper?style=social)](https://github.com/neosun100/deepwiki-scraper/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/neosun100/deepwiki-scraper?style=social)](https://github.com/neosun100/deepwiki-scraper/network/members)
[![GitHub issues](https://img.shields.io/github/issues/neosun100/deepwiki-scraper)](https://github.com/neosun100/deepwiki-scraper/issues)
[![GitHub license](https://img.shields.io/github/license/neosun100/deepwiki-scraper)](https://github.com/neosun100/deepwiki-scraper/blob/main/LICENSE)
[![GitHub last commit](https://img.shields.io/github/last-commit/neosun100/deepwiki-scraper)](https://github.com/neosun100/deepwiki-scraper/commits/main)

[简体中文](README.zh-CN.md) | [繁體中文](README.zh-TW.md) | [English](README.en.md) | [日本語](README.ja.md)

</div>

---

將 DeepWiki 專案文件抓取並合併為單一 Markdown 檔案的工具，支援命令列和 Web 介面。

![Screenshot](screenshot.png)

## ✨ 功能特性

- ✅ **智慧快取**：自動儲存抓取結果，相同 URL 直接使用快取（⭐ 新功能）
- ✅ **Web UI 介面**：炫酷的漸層色介面，即時進度顯示
- ✅ **API 金鑰持久化**：輸入一次永久記住，重新整理頁面自動復原
- ✅ **多金鑰輪詢**：支援設定多個 API 金鑰，自動輪換使用
- ✅ **智慧限速**：請求間自動延遲，避免速率限制
- ✅ **重試機制**：遇到錯誤自動重試，提高成功率
- ✅ **並行抓取**：可設定並行執行緒數，提高效率
- ✅ **Docker 部署**：一鍵啟動，開箱即用
- ✅ **命令列工具**：支援腳本化批次處理

## 🚀 快速開始

### 方式一：Web 介面（推薦）

#### 本地執行

```bash
# 複製儲存庫
git clone https://github.com/neosun100/deepwiki-scraper.git
cd deepwiki-scraper

# 一鍵啟動
chmod +x start.sh
./start.sh
```

啟動後造訪：
- **前端介面**：http://localhost:8002
- **API 文件**：http://localhost:8003/docs

#### Docker 部署

```bash
# 使用 Docker Compose
docker-compose up -d

# 或使用 Docker
docker build -t deepwiki-scraper .
docker run -d -p 127.0.0.1:8002:8000 -p 127.0.0.1:8003:8001 -v $(pwd)/output:/app/output deepwiki-scraper
```

**注意**：連接埠對應使用 `127.0.0.1` 前綴確保只允許本地存取，提高安全性。

### 方式二：命令列工具

```bash
# 安裝相依套件
pip install -r requirements.txt

# 設定 API 金鑰
cp .env.example .env
# 編輯 .env 檔案，填入你的 Firecrawl API 金鑰

# 執行
python deepwiki_scraper.py awslabs/cli-agent-orchestrator
```

## 🎨 Web 介面特性

### 1. 智慧快取系統（⭐ 新功能）
- **自動儲存**：每次抓取的結果自動儲存到 output 目錄
- **智慧偵測**：開始抓取前自動檢查是否存在快取
- **使用者選擇**：發現快取時彈出視窗提示，可選擇使用快取或重新抓取
- **快速回應**：使用快取時無需 API 呼叫，秒級回傳結果
- **永久儲存**：快取檔案持久化儲存，重新啟動服務仍然可用

### 2. API 金鑰管理
- **自動儲存**：輸入後自動儲存到瀏覽器 localStorage
- **永久記住**：重新整理頁面自動復原，無需重複輸入
- **多金鑰支援**：支援多個金鑰，用逗號或換行分隔
- **負載平衡**：自動隨機打亂金鑰順序，分散請求壓力
- **一鍵清除**：可隨時清除儲存的金鑰

### 3. 即時進度顯示
- **進度條**：視覺化顯示抓取進度
- **百分比**：即時更新完成百分比
- **頁數統計**：顯示已完成/總頁數
- **狀態訊息**：詳細的目前操作狀態

### 4. 炫酷 UI 設計
- **漸層色主題**：紫色漸層配色方案
- **暗色模式**：護眼的深色背景
- **動畫效果**：流暢的過渡動畫
- **響應式設計**：完美適配行動裝置

## 📋 使用說明

### Web 介面使用

1. **設定 API 金鑰**
   ```
   單一金鑰：
   fc-your-api-key

   多個金鑰（推薦）：
   fc-key1
   fc-key2
   fc-key3
   ```

2. **輸入專案位址**
   - 簡寫形式：`awslabs/cli-agent-orchestrator`
   - 完整 URL：`https://deepwiki.com/awslabs/cli-agent-orchestrator`

3. **調整進階選項**（可選）
   - 並行執行緒數：1-10（預設 3）
   - 請求延遲：0.5-5 秒（預設 1.5）

4. **開始抓取**
   - 點選「開始抓取」按鈕
   - 檢視即時進度
   - 完成後下載 Markdown 檔案

### 命令列使用

```bash
# 基本用法
python deepwiki_scraper.py awslabs/cli-agent-orchestrator

# 指定輸出檔案
python deepwiki_scraper.py awslabs/cli-agent-orchestrator -o output.md

# 調整並行數和延遲
python deepwiki_scraper.py awslabs/cli-agent-orchestrator -w 3 -d 2.0

# 檢視說明
python deepwiki_scraper.py --help
```

## 🔑 取得 API 金鑰

1. 造訪 [Firecrawl](https://firecrawl.dev)
2. 註冊帳號
3. 在控制台取得 API 金鑰
4. 在 Web 介面輸入或新增到 `.env` 檔案

## 📦 專案結構

```
deepwiki-scraper/
├── README.md                 # 專案文件
├── requirements.txt          # Python 相依套件
├── .env.example             # 環境變數範本
├── .gitignore               # Git 忽略規則
│
├── deepwiki_scraper.py      # 命令列工具
│
├── server.py                # FastAPI 後端
├── index.html               # Web 前端
├── style.css                # 樣式檔案
├── app.js                   # 前端邏輯
│
├── Dockerfile               # Docker 映像檔
├── docker-compose.yml       # Docker Compose 設定
├── docker-entrypoint.sh     # Docker 啟動腳本
├── start.sh                 # 本地啟動腳本
│
└── output/                  # 輸出目錄
```

## 🛠️ 技術堆疊

### 後端
- **FastAPI**：現代化的 Python Web 框架
- **Uvicorn**：ASGI 伺服器
- **HTTPX**：非同步 HTTP 用戶端
- **asyncio**：非同步並行處理

### 前端
- **HTML5 + CSS3**：現代化 Web 標準
- **Vanilla JavaScript**：無框架相依
- **localStorage**：API 金鑰持久化
- **Fetch API**：非同步請求

### 部署
- **Docker**：容器化部署
- **Docker Compose**：一鍵啟動

## 🔒 安全建議

### 開發環境
- ✅ 使用 localhost 測試
- ✅ API 金鑰儲存在 localStorage
- ✅ 不要提交 API 金鑰到程式碼儲存庫

### 生產環境
- ⚠️ 使用 HTTPS
- ⚠️ 設定防火牆規則
- ⚠️ 定期輪換 API 金鑰
- ⚠️ 設定請求頻率限制

## 📊 效能最佳化

### 1. 使用多個 API 金鑰
```
單一金鑰：最大並行受限
多個金鑰：負載平衡，提高吞吐量
```

### 2. 調整並行數
- 網路良好：可增加到 5-10
- 網路不佳：建議 1-3
- 金鑰多：可適當增加

### 3. 調整延遲
- 金鑰多：可降低到 1.0s
- 金鑰少：建議 1.5-2.0s
- 遇到 429：增加到 2.5-3.0s

## 🐛 故障排除

### Web 介面無法存取
```bash
# 檢查連接埠佔用
lsof -i :8002
lsof -i :8003

# 終止佔用程序
kill -9 <PID>

# 重新啟動
./start.sh
```

### API 金鑰未儲存
1. 檢查瀏覽器是否停用 localStorage
2. 清除瀏覽器快取後重試
3. 使用非隱私模式

### Docker 容器無法啟動
```bash
# 檢視日誌
docker-compose logs

# 重新建置
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

### 抓取失敗
1. 驗證 API 金鑰是否正確
2. 檢查網路連線
3. 增加請求延遲
4. 減少並行數
5. 新增更多 API 金鑰

## 📈 輸出範例

### 命令列輸出
```
✓ 載入了 5 個 API 金鑰

開始抓取專案: cli-agent-orchestrator
URL: https://deepwiki.com/awslabs/cli-agent-orchestrator
並行數: 3, 延遲: 1.5s

📥 步驟 1/4: 抓取主頁面...
✓ 主頁面抓取完成

🔍 步驟 2/4: 提取子頁面連結...
✓ 發現 36 個子頁面

📦 步驟 3/4: 抓取所有子頁面...
抓取子頁面: 100%|██████████| 36/36 [01:31<00:00, 2.53s/頁]
✓ 成功抓取 36/36 個子頁面

📝 步驟 4/4: 合併 Markdown...

==================================================
✅ 完成！
📄 輸出檔案: cli-agent-orchestrator.md
📊 總頁數: 37
📝 檔案大小: 776,577 字元
==================================================
```

### Web 介面輸出
- 即時進度條顯示
- 詳細狀態訊息
- 完成後顯示統計資訊
- 一鍵下載結果檔案

## 🔄 更新日誌

### v2.1.0 (2025-10-26)
- ✨ 新增智慧快取系統
- ✨ 自動儲存和複用抓取結果
- ✨ 使用者可選擇使用快取或重新抓取
- 🔧 更新連接埠設定（8002/8003）確保本地存取
- 📝 完善快取功能文件說明

### v2.0.0 (2025-10-26)
- ✨ 新增 Web UI 介面
- ✨ 新增 API 金鑰持久化功能
- ✨ 新增 Docker 部署支援
- ✨ 新增 FastAPI 後端服務
- ✨ 新增即時進度顯示
- 🎨 炫酷的漸層色 UI 設計
- 📝 完善文件和使用說明

### v1.0.0 (2025-10-26)
- ✨ 基礎命令列工具
- ✨ 多金鑰輪詢支援
- ✨ 智慧限速和重試
- ✨ 並行抓取功能
- ✨ tqdm 進度條

## 📄 授權條款

MIT License

## 🔗 相關連結

- [Firecrawl 官網](https://firecrawl.dev)
- [FastAPI 文件](https://fastapi.tiangolo.com/)
- [Docker 文件](https://docs.docker.com/)

## 🤝 貢獻

歡迎貢獻程式碼、回報問題或提出建議！

1. Fork 本專案
2. 建立特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交變更 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 開啟 Pull Request

## 📧 聯絡方式

- GitHub Issues: [提交問題](https://github.com/neosun100/deepwiki-scraper/issues)
- GitHub: [@neosun100](https://github.com/neosun100)

---

<div align="center">

### ⭐ Star 歷史

[![Star History Chart](https://api.star-history.com/svg?repos=neosun100/deepwiki-scraper&type=Date)](https://star-history.com/#neosun100/deepwiki-scraper&Date)

</div>

---

<div align="center">

## 🌟 給我們一個 Star！🌟

**如果這個專案對你有幫助，請在 GitHub 上給它一個 ⭐ Star！**

你的支持是我們持續改進的最大動力！🚀

[![GitHub stars](https://img.shields.io/github/stars/neosun100/deepwiki-scraper?style=social)](https://github.com/neosun100/deepwiki-scraper/stargazers)

[⭐ Star 本倉庫](https://github.com/neosun100/deepwiki-scraper) | [🐛 回報 Bug](https://github.com/neosun100/deepwiki-scraper/issues) | [✨ 請求新功能](https://github.com/neosun100/deepwiki-scraper/issues)

---

Made with ❤️ by [Neo Sun](https://github.com/neosun100)

</div>
