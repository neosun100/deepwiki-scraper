# 部署指南 / Deployment Guide

## 方式一：Docker 本地运行（开发环境）

适用于本地开发和测试。

```bash
# 启动 Docker 容器
docker-compose up -d

# 或者使用启动脚本
./start.sh

# 访问地址
# 前端：http://localhost:8002
# API：http://localhost:8003/docs
```

## 方式二：Nginx 部署（生产环境）

适用于远程服务器部署，通过域名或 IP 访问。

### 1. 安装依赖

```bash
# 安装 Python 依赖
pip install -r requirements.txt

# 安装 Nginx（如果未安装）
sudo apt update
sudo apt install nginx -y
```

### 2. 配置 Nginx

```bash
# 复制配置文件
sudo cp nginx.conf.example /etc/nginx/sites-available/deepwiki-scraper

# 编辑配置文件
sudo nano /etc/nginx/sites-available/deepwiki-scraper

# 需要修改的内容：
# 1. server_name：改为您的域名或 IP
# 2. root 路径：改为您的项目实际路径
# 3. proxy_pass 中的端口：确保与后端服务端口一致

# 创建软链接
sudo ln -s /etc/nginx/sites-available/deepwiki-scraper /etc/nginx/sites-enabled/

# 测试配置
sudo nginx -t

# 重启 Nginx
sudo systemctl restart nginx
```

### 3. 启动后端服务

#### 方法 A：直接运行

```bash
cd /root/deepwiki-merge

# 启动后端 API（端口 8001）
uvicorn server:app --host 0.0.0.0 --port 8001 &

# 启动前端静态服务器（端口 8000）
python3 -m http.server 8000 &
```

#### 方法 B：使用 systemd 服务（推荐）

创建后端服务：

```bash
sudo nano /etc/systemd/system/deepwiki-api.service
```

内容：

```ini
[Unit]
Description=DeepWiki Scraper API Service
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=/root/deepwiki-merge
Environment="PATH=/usr/local/bin:/usr/bin:/bin"
ExecStart=/usr/bin/uvicorn server:app --host 0.0.0.0 --port 8001
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

创建前端服务：

```bash
sudo nano /etc/systemd/system/deepwiki-frontend.service
```

内容：

```ini
[Unit]
Description=DeepWiki Scraper Frontend Service
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=/root/deepwiki-merge
ExecStart=/usr/bin/python3 -m http.server 8000
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

启动服务：

```bash
# 重新加载 systemd
sudo systemctl daemon-reload

# 启动服务
sudo systemctl start deepwiki-api
sudo systemctl start deepwiki-frontend

# 设置开机自启
sudo systemctl enable deepwiki-api
sudo systemctl enable deepwiki-frontend

# 查看状态
sudo systemctl status deepwiki-api
sudo systemctl status deepwiki-frontend
```

### 4. 验证部署

```bash
# 检查后端 API
curl http://localhost:8001/docs

# 检查 Nginx 配置
sudo nginx -t

# 查看 Nginx 日志
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

访问您的域名或 IP 地址，应该能看到 Web 界面。

## 方式三：使用 Docker + Nginx 反向代理

适用于使用 Docker 但需要通过域名访问的场景。

### 1. 修改 Docker 映射

```yaml
# docker-compose.yml
services:
  deepwiki-scraper:
    build: .
    ports:
      - "127.0.0.1:8000:8000"  # 前端
      - "127.0.0.1:8001:8001"  # 后端
    volumes:
      - ./output:/app/output
```

### 2. 配置 Nginx

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://127.0.0.1:8000;
    }

    location /api/ {
        proxy_pass http://127.0.0.1:8001/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;

        # 超时设置
        proxy_connect_timeout 600;
        proxy_send_timeout 600;
        proxy_read_timeout 600;
    }
}
```

## 故障排除

### 1. 前端无法连接到后端

**症状**：浏览器控制台显示 "NetworkError when attempting to fetch resource"

**原因**：
- Nginx 没有配置反向代理
- 后端服务没有启动
- 跨域配置问题

**解决**：
```bash
# 检查后端服务是否运行
netstat -tlnp | grep 8001

# 检查 Nginx 配置
sudo nginx -t

# 查看 Nginx 错误日志
sudo tail -f /var/log/nginx/error.log

# 测试后端 API
curl http://localhost:8001/docs
```

### 2. 端口被占用

```bash
# 查看端口占用
lsof -i :8000
lsof -i :8001

# 终止占用进程
kill -9 <PID>
```

### 3. 权限问题

```bash
# 确保项目目录有正确的权限
sudo chown -R www-data:www-data /root/deepwiki-merge
# 或
sudo chmod -R 755 /root/deepwiki-merge
```

### 4. API 密钥未配置

编辑 `.env` 文件：

```bash
nano .env
```

添加 Firecrawl API 密钥：

```
FIRECRAWL_API_KEYS=fc-key1,fc-key2,fc-key3
```

## 安全建议

1. **生产环境使用 HTTPS**
   ```bash
   # 安装 Certbot
   sudo apt install certbot python3-certbot-nginx

   # 获取 SSL 证书
   sudo certbot --nginx -d your-domain.com
   ```

2. **限制 API 访问**
   - 在 Nginx 中添加 IP 白名单
   - 使用防火墙规则

3. **定期更新依赖**
   ```bash
   pip install -r requirements.txt --upgrade
   ```

4. **备份数据**
   ```bash
   # 备份 output 目录
   tar -czf output-backup-$(date +%Y%m%d).tar.gz output/
   ```

## 监控和日志

### 查看服务日志

```bash
# systemd 服务日志
sudo journalctl -u deepwiki-api -f
sudo journalctl -u deepwiki-frontend -f

# Docker 日志
docker logs -f deepwiki-scraper

# Nginx 日志
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

### 性能监控

```bash
# 查看系统资源使用
htop

# 查看进程
ps aux | grep python
ps aux | grep uvicorn
```

## 更新部署

```bash
# 拉取最新代码
git pull origin main

# 重启服务
sudo systemctl restart deepwiki-api
sudo systemctl restart deepwiki-frontend

# 或者重启 Docker
docker-compose down
docker-compose up -d --build
```
