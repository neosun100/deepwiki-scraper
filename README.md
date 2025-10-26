# DeepWiki Scraper

[简体中文](README.zh-CN.md) | [繁體中文](README.zh-TW.md) | [English](README.en.md) | [日本語](README.ja.md)

---

将 DeepWiki 项目文档抓取并合并为单个 Markdown 文件的工具，支持命令行和 Web 界面。

![Screenshot](screenshot.png)

## ✨ 功能特性

- ✅ **智能缓存**：自动保存抓取结果，相同 URL 直接使用缓存（⭐ 新功能）
- ✅ **Web UI 界面**：炫酷的渐变色界面，实时进度显示
- ✅ **API 密钥持久化**：输入一次永久记住，刷新页面自动恢复
- ✅ **多密钥轮询**：支持配置多个 API 密钥，自动轮换使用
- ✅ **智能限速**：请求间自动延迟，避免速率限制
- ✅ **重试机制**：遇到错误自动重试，提高成功率
- ✅ **并发抓取**：可配置并发线程数，提高效率
- ✅ **Docker 部署**：一键启动，开箱即用
- ✅ **命令行工具**：支持脚本化批量处理

## 🚀 快速开始

### 方式一：Web 界面（推荐）

#### 本地运行

```bash
# 克隆仓库
git clone https://github.com/neosun100/deepwiki-scraper.git
cd deepwiki-scraper

# 一键启动
chmod +x start.sh
./start.sh
```

启动后访问：
- **前端界面**：http://localhost:8002
- **API 文档**：http://localhost:8003/docs

#### Docker 部署

```bash
# 使用 Docker Compose
docker-compose up -d

# 或使用 Docker
docker build -t deepwiki-scraper .
docker run -d -p 127.0.0.1:8002:8000 -p 127.0.0.1:8003:8001 -v $(pwd)/output:/app/output deepwiki-scraper
```

**注意**：端口映射使用 `127.0.0.1` 前缀确保只允许本地访问，提高安全性。

### 方式二：命令行工具

```bash
# 安装依赖
pip install -r requirements.txt

# 配置 API 密钥
cp .env.example .env
# 编辑 .env 文件，填入你的 Firecrawl API 密钥

# 运行
python deepwiki_scraper.py awslabs/cli-agent-orchestrator
```

## 🎨 Web 界面特性

### 1. 智能缓存系统（⭐ 新功能）
- **自动保存**：每次抓取的结果自动保存到 output 目录
- **智能检测**：开始抓取前自动检查是否存在缓存
- **用户选择**：发现缓存时弹窗提示，可选择使用缓存或重新抓取
- **快速响应**：使用缓存时无需 API 调用，秒级返回结果
- **永久保存**：缓存文件持久化存储，重启服务仍然可用

### 2. API 密钥管理
- **自动保存**：输入后自动保存到浏览器 localStorage
- **永久记住**：刷新页面自动恢复，无需重复输入
- **多密钥支持**：支持多个密钥，用逗号或换行分隔
- **负载均衡**：自动随机打乱密钥顺序，分散请求压力
- **一键清除**：可随时清除保存的密钥

### 3. 实时进度显示
- **进度条**：可视化显示抓取进度
- **百分比**：实时更新完成百分比
- **页数统计**：显示已完成/总页数
- **状态消息**：详细的当前操作状态

### 4. 炫酷 UI 设计
- **渐变色主题**：紫色渐变配色方案
- **暗色模式**：护眼的深色背景
- **动画效果**：流畅的过渡动画
- **响应式设计**：完美适配移动端

## 📋 使用说明

### Web 界面使用

1. **配置 API 密钥**
   ```
   单个密钥：
   fc-your-api-key
   
   多个密钥（推荐）：
   fc-key1
   fc-key2
   fc-key3
   ```

2. **输入项目地址**
   - 简写形式：`awslabs/cli-agent-orchestrator`
   - 完整 URL：`https://deepwiki.com/awslabs/cli-agent-orchestrator`

3. **调整高级选项**（可选）
   - 并发线程数：1-10（默认 3）
   - 请求延迟：0.5-5 秒（默认 1.5）

4. **开始抓取**
   - 点击"开始抓取"按钮
   - 查看实时进度
   - 完成后下载 Markdown 文件

### 命令行使用

```bash
# 基本用法
python deepwiki_scraper.py awslabs/cli-agent-orchestrator

# 指定输出文件
python deepwiki_scraper.py awslabs/cli-agent-orchestrator -o output.md

# 调整并发数和延迟
python deepwiki_scraper.py awslabs/cli-agent-orchestrator -w 3 -d 2.0

# 查看帮助
python deepwiki_scraper.py --help
```

## 🔑 获取 API 密钥

1. 访问 [Firecrawl](https://firecrawl.dev)
2. 注册账号
3. 在控制台获取 API 密钥
4. 在 Web 界面输入或添加到 `.env` 文件

## 📦 项目结构

```
deepwiki-scraper/
├── README.md                 # 项目文档
├── requirements.txt          # Python 依赖
├── .env.example             # 环境变量模板
├── .gitignore               # Git 忽略规则
│
├── deepwiki_scraper.py      # 命令行工具
│
├── server.py                # FastAPI 后端
├── index.html               # Web 前端
├── style.css                # 样式文件
├── app.js                   # 前端逻辑
│
├── Dockerfile               # Docker 镜像
├── docker-compose.yml       # Docker Compose 配置
├── docker-entrypoint.sh     # Docker 启动脚本
├── start.sh                 # 本地启动脚本
│
└── output/                  # 输出目录
```

## 🛠️ 技术栈

### 后端
- **FastAPI**：现代化的 Python Web 框架
- **Uvicorn**：ASGI 服务器
- **HTTPX**：异步 HTTP 客户端
- **asyncio**：异步并发处理

### 前端
- **HTML5 + CSS3**：现代化 Web 标准
- **Vanilla JavaScript**：无框架依赖
- **localStorage**：API 密钥持久化
- **Fetch API**：异步请求

### 部署
- **Docker**：容器化部署
- **Docker Compose**：一键启动

## 🔒 安全建议

### 开发环境
- ✅ 使用 localhost 测试
- ✅ API 密钥保存在 localStorage
- ✅ 不要提交 API 密钥到代码仓库

### 生产环境
- ⚠️ 使用 HTTPS
- ⚠️ 配置防火墙规则
- ⚠️ 定期轮换 API 密钥
- ⚠️ 设置请求频率限制

## 📊 性能优化

### 1. 使用多个 API 密钥
```
单个密钥：最大并发受限
多个密钥：负载均衡，提高吞吐量
```

### 2. 调整并发数
- 网络好：可增加到 5-10
- 网络差：建议 1-3
- 密钥多：可适当增加

### 3. 调整延迟
- 密钥多：可降低到 1.0s
- 密钥少：建议 1.5-2.0s
- 遇到 429：增加到 2.5-3.0s

## 🐛 故障排除

### Web 界面无法访问
```bash
# 检查端口占用
lsof -i :8002
lsof -i :8003

# 杀死占用进程
kill -9 <PID>

# 重新启动
./start.sh
```

### API 密钥未保存
1. 检查浏览器是否禁用 localStorage
2. 清除浏览器缓存后重试
3. 使用非隐私模式

### Docker 容器无法启动
```bash
# 查看日志
docker-compose logs

# 重新构建
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

### 抓取失败
1. 验证 API 密钥是否正确
2. 检查网络连接
3. 增加请求延迟
4. 减少并发数
5. 添加更多 API 密钥

## 📈 输出示例

### 命令行输出
```
✓ 加载了 5 个 API 密钥

开始抓取项目: cli-agent-orchestrator
URL: https://deepwiki.com/awslabs/cli-agent-orchestrator
并发数: 3, 延迟: 1.5s

📥 步骤 1/4: 抓取主页面...
✓ 主页面抓取完成

🔍 步骤 2/4: 提取子页面链接...
✓ 发现 36 个子页面

📦 步骤 3/4: 抓取所有子页面...
抓取子页面: 100%|██████████| 36/36 [01:31<00:00, 2.53s/页]
✓ 成功抓取 36/36 个子页面

📝 步骤 4/4: 合并 Markdown...

==================================================
✅ 完成！
📄 输出文件: cli-agent-orchestrator.md
📊 总页数: 37
📝 文件大小: 776,577 字符
==================================================
```

### Web 界面输出
- 实时进度条显示
- 详细状态消息
- 完成后显示统计信息
- 一键下载结果文件

## 🔄 更新日志

### v2.1.0 (2025-10-26)
- ✨ 新增智能缓存系统
- ✨ 自动保存和复用抓取结果
- ✨ 用户可选择使用缓存或重新抓取
- 🔧 更新端口配置（8002/8003）确保本地访问
- 📝 完善缓存功能文档说明

### v2.0.0 (2025-10-26)
- ✨ 新增 Web UI 界面
- ✨ 新增 API 密钥持久化功能
- ✨ 新增 Docker 部署支持
- ✨ 新增 FastAPI 后端服务
- ✨ 新增实时进度显示
- 🎨 炫酷的渐变色 UI 设计
- 📝 完善文档和使用说明

### v1.0.0 (2025-10-26)
- ✨ 基础命令行工具
- ✨ 多密钥轮询支持
- ✨ 智能限速和重试
- ✨ 并发抓取功能
- ✨ tqdm 进度条

## 📄 许可证

MIT License

## 🔗 相关链接

- [Firecrawl 官网](https://firecrawl.dev)
- [FastAPI 文档](https://fastapi.tiangolo.com/)
- [Docker 文档](https://docs.docker.com/)

## 🤝 贡献

欢迎贡献代码、报告问题或提出建议！

1. Fork 本项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 📧 联系方式

- GitHub Issues: [提交问题](https://github.com/your-repo/issues)
- Email: your-email@example.com

---

**⭐ 如果这个项目对你有帮助，请给个 Star！⭐**

Made with ❤️ by Neo Sun
