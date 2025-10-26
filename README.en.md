# DeepWiki Scraper

[简体中文](README.zh-CN.md) | [繁體中文](README.zh-TW.md) | [English](README.en.md) | [日本語](README.ja.md)

---

A tool to scrape and merge DeepWiki project documentation into a single Markdown file, with CLI and Web UI support.

![Screenshot](screenshot.png)

## ✨ Features

- ✅ **Smart Cache**: Auto-save results, reuse cache for same URLs (⭐ New)
- ✅ **Web UI**: Beautiful gradient interface with real-time progress
- ✅ **API Key Persistence**: Remember keys permanently with localStorage
- ✅ **Multi-Key Rotation**: Configure multiple API keys for load balancing
- ✅ **Smart Rate Limiting**: Automatic delays between requests
- ✅ **Retry Mechanism**: Auto-retry on errors for better success rate
- ✅ **Concurrent Scraping**: Configurable worker threads
- ✅ **Docker Deployment**: One-command startup
- ✅ **CLI Tool**: Script-friendly batch processing
- ✅ **Multi-Language**: Simplified Chinese, Traditional Chinese, English, Japanese

## 🚀 Quick Start

### Option 1: Web UI (Recommended)

```bash
# Clone repository
git clone <your-repo-url>
cd deepwiki-scraper

# Start with one command
chmod +x start.sh
./start.sh
```

Visit:
- **Frontend**: http://localhost:8002
- **API Docs**: http://localhost:8003/docs

### Option 2: Docker

```bash
docker-compose up -d
# Or use Docker directly
docker run -d -p 127.0.0.1:8002:8000 -p 127.0.0.1:8003:8001 -v $(pwd)/output:/app/output deepwiki-scraper
```

**Note**: Port mapping uses `127.0.0.1` prefix to ensure local-only access for security.

### Option 3: CLI

```bash
pip install -r requirements.txt
python deepwiki_scraper.py awslabs/cli-agent-orchestrator
```

## 🔑 Get API Key

1. Visit [Firecrawl](https://firecrawl.dev)
2. Sign up and get your API key
3. Enter in Web UI or add to `.env` file

## 📄 License

MIT License

---

Made with ❤️ by Neo Sun
