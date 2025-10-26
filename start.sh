#!/bin/bash

echo "🚀 启动 DeepWiki Scraper..."
echo ""

# 检查依赖
if ! command -v python3 &> /dev/null; then
    echo "❌ 未找到 Python 3"
    exit 1
fi

# 安装依赖
echo "📦 安装依赖..."
pip3 install -r requirements.txt > /dev/null 2>&1

# 启动后端
echo "🔧 启动后端 API (端口 8001)..."
python3 server.py &
BACKEND_PID=$!

# 等待后端启动
sleep 2

# 启动前端
echo "🌐 启动前端服务 (端口 8000)..."
python3 -m http.server 8000 &
FRONTEND_PID=$!

# 等待前端启动
sleep 1

echo ""
echo "✅ 服务已启动！"
echo ""
echo "📱 访问地址："
echo "   前端界面: http://localhost:8000"
echo "   API 文档: http://localhost:8001/docs"
echo ""
echo "按 Ctrl+C 停止服务"
echo ""

# 等待用户中断
trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; echo ''; echo '👋 服务已停止'; exit 0" INT

wait
