# DeepWiki Scraper

[简体中文](README.zh-CN.md) | [繁體中文](README.zh-TW.md) | [English](README.en.md) | [日本語](README.ja.md)

---

DeepWiki プロジェクトドキュメントをスクレイピングして単一の Markdown ファイルに統合するツール。CLI と Web UI をサポート。

![Screenshot](screenshot.png)

## ✨ 機能

- ✅ **スマートキャッシュ**：結果を自動保存、同じ URL ではキャッシュを再利用（⭐ 新機能）
- ✅ **Web UI**：美しいグラデーションインターフェースとリアルタイム進行状況
- ✅ **API キー永続化**：localStorage でキーを永久に記憶
- ✅ **マルチキーローテーション**：複数の API キーで負荷分散
- ✅ **スマートレート制限**：リクエスト間の自動遅延
- ✅ **リトライメカニズム**：エラー時の自動リトライ
- ✅ **並行スクレイピング**：設定可能なワーカースレッド
- ✅ **Docker デプロイ**：ワンコマンド起動
- ✅ **CLI ツール**：スクリプト対応バッチ処理
- ✅ **多言語対応**：簡体字中国語、繁体字中国語、英語、日本語

## 🚀 クイックスタート

### 方法 1：Web UI（推奨）

```bash
# リポジトリをクローン
git clone https://github.com/neosun100/deepwiki-scraper.git
cd deepwiki-scraper

# ワンコマンドで起動
chmod +x start.sh
./start.sh
```

アクセス：
- **フロントエンド**: http://localhost:8002
- **API ドキュメント**: http://localhost:8003/docs

### 方法 2：Docker

```bash
docker-compose up -d
# または Docker を直接使用
docker run -d -p 127.0.0.1:8002:8000 -p 127.0.0.1:8003:8001 -v $(pwd)/output:/app/output deepwiki-scraper
```

**注意**：ポートマッピングは `127.0.0.1` プレフィックスを使用してローカルアクセスのみを許可し、セキュリティを確保します。

### 方法 3：CLI

```bash
pip install -r requirements.txt
python deepwiki_scraper.py awslabs/cli-agent-orchestrator
```

## 🔑 API キーの取得

1. [Firecrawl](https://firecrawl.dev) にアクセス
2. サインアップして API キーを取得
3. Web UI に入力するか `.env` ファイルに追加

## 📄 ライセンス

MIT License

---

Made with ❤️ by Neo Sun
