# Design Document

## Overview

简化的开发环境优化方案，专注于解决端口占用和前端自动刷新问题。通过修改现有的启动脚本和添加简单的文件监听功能，让开发者修改代码后前端能自动刷新。

## Architecture

### 简化架构

```
现有IPD系统
├── 后端服务 (Express.js) - 端口3004
├── 前端静态文件
└── 新增功能
    ├── 智能端口检测
    ├── 进程清理脚本
    └── 前端自动刷新
```

### 技术选择

- **现有技术栈**: Express.js + 静态文件服务
- **新增依赖**:
  - `chokidar`: 文件监听 (轻量级)
  - `ws`: WebSocket 通信 (前端刷新通知)

## Components and Interfaces

### 1. 启动脚本增强

修改现有的 `start.bat` 和 `package.json`，添加：

- 端口占用检测
- 自动清理冲突进程
- 开发模式启动选项

### 2. 前端自动刷新

在现有 Express 服务器中添加：

- WebSocket 服务器
- 文件监听器
- 刷新通知机制

### 3. 简单的进程管理

创建工具函数：

```javascript
// 检测端口占用
function checkPort(port)

// 清理进程
function killProcessOnPort(port)

// 启动开发服务器
function startDevServer()
```

## Data Models

### 配置对象

```javascript
const devConfig = {
  port: 3004,
  watchPaths: ["frontend/**/*.{html,css,js}"],
  ignorePatterns: ["node_modules/**"],
  autoReload: true,
};
```

## Error Handling

### 简单错误处理策略

1. **端口被占用**: 自动杀死进程或使用下一个可用端口
2. **文件监听失败**: 降级到手动刷新模式
3. **WebSocket 连接失败**: 静默失败，不影响主功能

## Testing Strategy

### 基本测试

- 端口检测功能测试
- 文件变化监听测试
- WebSocket 通信测试

## Implementation Approach

### 最小化改动原则

1. 在现有服务器代码中添加文件监听
2. 在前端页面中添加 WebSocket 客户端
3. 修改启动脚本添加端口检测
4. 创建开发模式启动选项

### 向后兼容

- 所有新功能都是可选的
- 不影响生产环境运行
- 可以通过环境变量控制开启/关闭
