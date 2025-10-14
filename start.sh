#!/bin/bash
# start.sh：Python 服务启动脚本

# 1. 定义变量（根据实际情况修改）
VENV_PATH="/home/ubuntu/python/future-patrol-master/myenv"  # 虚拟环境路径
APP_SCRIPT="apprun.py"         # 应用脚本名
PORT="5000"                    # 服务端口
LOG_FILE="app.log"             # 日志文件

# 2. 杀死原有服务进程（避免端口冲突）
echo "正在关闭原有服务..."
OLD_PID=$(ps aux | grep "$APP_SCRIPT" | grep -v grep | awk '{print $2}')
if [ -n "$OLD_PID" ]; then
    kill -9 $OLD_PID
    echo "已杀死原有进程：$OLD_PID"
fi

# 3. 激活虚拟环境并启动服务
echo "正在启动服务（端口：$PORT）..."
nohup bash -c "
    source $VENV_PATH/bin/activate && 
    python $APP_SCRIPT runserver --host 0.0.0.0 --port $PORT
" > $LOG_FILE 2>&1 &

# 4. 验证启动结果
echo "启动完成！查看日志：tail -f $LOG_FILE"
