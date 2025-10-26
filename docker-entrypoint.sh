#!/bin/bash

# 启动后端 API
python server.py &

# 启动前端服务
python -m http.server 8000 &

# 等待所有后台进程
wait
