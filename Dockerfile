FROM python:3.11-slim

WORKDIR /app

# 安装依赖
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# 复制应用文件
COPY server.py .
COPY index.html .
COPY style.css .
COPY app.js .
COPY i18n.js .

# 创建输出目录
RUN mkdir -p output

# 暴露端口
EXPOSE 8001 8000

# 启动脚本
COPY docker-entrypoint.sh .
RUN chmod +x docker-entrypoint.sh

CMD ["./docker-entrypoint.sh"]
