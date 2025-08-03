#!/bin/bash

echo "========================================"
echo "   IPD项目协作系统 - Linux/Mac启动脚本"
echo "========================================"
echo

# 检查Node.js是否安装
if ! command -v node &> /dev/null; then
    echo "❌ 错误: 未检测到Node.js，请先安装Node.js"
    echo "下载地址: https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js版本:"
node --version

# 检查npm是否可用
if ! command -v npm &> /dev/null; then
    echo "❌ 错误: npm不可用"
    exit 1
fi

echo "✅ npm版本:"
npm --version
echo

# 检查是否已安装依赖
if [ ! -d "node_modules" ]; then
    echo "📦 正在安装依赖..."
    npm install
    if [ $? -ne 0 ]; then
        echo "❌ 依赖安装失败"
        exit 1
    fi
    echo "✅ 依赖安装完成"
    echo
fi

echo "🚀 正在启动IPD项目协作系统..."
echo
echo "启动后请访问: http://localhost:3004"
echo "按 Ctrl+C 停止服务器"
echo

# 启动服务器
npm start