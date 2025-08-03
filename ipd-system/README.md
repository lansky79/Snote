# IPD 项目协作系统

基于华为 IPD（Integrated Product Development）流程的项目管理原型系统，采用原生 Web 技术实现，专注于功能展示和数据持久化。

## 🚀 快速开始

### 环境要求

- Node.js >= 14.0.0
- npm >= 6.0.0
- 现代浏览器（Chrome、Firefox、Safari、Edge）

### 安装和启动

```bash
# 1. 克隆或下载项目
cd ipd-system

# 2. 安装依赖
npm install

# 3. 启动服务器
npm start

# 4. 打开浏览器访问
# http://localhost:3004
```

### 开发模式

```bash
# 开发模式启动（支持文件监听，Node.js 18+）
npm run dev:watch

# 查看项目信息
npm run info

# 项目设置（首次使用）
npm run setup
```

## 📋 系统功能

### 核心功能模块

1. **项目概览** - 项目列表、创建、编辑、删除
2. **阶段管理** - IPD 六阶段流程管理（概念 → 计划 → 开发 → 验证 → 发布 → 生命周期）
3. **团队协作** - 团队成员管理、任务分配、工作量分析
4. **DCP 评审** - 决策评审点管理、评审流程、意见收集
5. **交付物管理** - 文档上传、版本控制、审批流程
6. **项目仪表板** - 数据统计、进度分析、可视化图表
7. **用户管理** - 用户账户、角色权限、部门管理
8. **系统设置** - 配置管理、系统参数

### 技术特点

- ✅ **原生技术栈** - HTML + CSS + JavaScript，无框架依赖
- ✅ **数据持久化** - JSON 文件存储，真实的 CRUD 操作
- ✅ **响应式设计** - 适配桌面和移动设备
- ✅ **模块化架构** - 清晰的前后端分离
- ✅ **RESTful API** - 标准的 API 接口设计

## 🏗️ 项目结构

```
ipd-system/
├── frontend/                    # 前端文件
│   ├── index.html              # 主页面
│   ├── css/
│   │   ├── main.css            # 主样式文件
│   │   └── components.css      # 组件样式
│   ├── js/
│   │   ├── app.js              # 主应用逻辑
│   │   ├── services/           # 数据服务
│   │   │   ├── api.js          # API调用
│   │   │   ├── projectService.js
│   │   │   └── userService.js
│   │   └── components/         # 页面组件
│   │       ├── projectStages.js
│   │       ├── dcpReview.js
│   │       ├── teamBoard.js
│   │       └── dashboard.js
├── backend/                     # Node.js后端
│   ├── server.js               # 服务器入口
│   ├── services/               # 业务逻辑
│   │   └── dataService.js      # 数据访问层
│   └── data/                   # JSON数据文件
│       ├── projects.json       # 项目数据
│       ├── users.json          # 用户数据
│       ├── dcp_reviews.json    # DCP评审数据
│       ├── deliverables.json   # 交付物数据
│       └── tasks.json          # 任务数据
├── package.json                # 项目配置
└── README.md                   # 项目说明
```

## 🔧 配置说明

### 端口配置

- **后端服务器**: `http://localhost:3004`
- **前端页面**: `http://localhost:3004/index.html`
- **API 接口**: `http://localhost:3004/api`

如需修改端口，请编辑以下文件：

- `backend/server.js` - 修改 `PORT` 变量
- `frontend/js/services/api.js` - 修改 `baseURL` 配置

### 数据存储

系统使用 JSON 文件存储数据，位于 `backend/data/` 目录：

- `projects.json` - 项目信息、阶段数据
- `users.json` - 用户账户、角色权限
- `dcp_reviews.json` - DCP 评审记录
- `deliverables.json` - 交付物信息
- `tasks.json` - 任务分配数据

**注意**: 首次启动时，如果数据文件不存在，系统会自动创建示例数据。

## 🛠️ 开发指南

### API 接口

系统提供完整的 RESTful API 接口：

#### 项目管理

- `GET /api/projects` - 获取项目列表
- `GET /api/projects/:id` - 获取项目详情
- `POST /api/projects` - 创建项目
- `PUT /api/projects/:id` - 更新项目
- `DELETE /api/projects/:id` - 删除项目
- `PUT /api/projects/:id/stages/:stage` - 更新项目阶段

#### 用户管理

- `GET /api/users` - 获取用户列表
- `GET /api/users/:id` - 获取用户详情
- `POST /api/users` - 创建用户
- `PUT /api/users/:id` - 更新用户
- `DELETE /api/users/:id` - 删除用户

#### DCP 评审

- `GET /api/dcp/reviews` - 获取评审列表
- `POST /api/dcp/reviews` - 创建评审
- `PUT /api/dcp/reviews/:id` - 更新评审
- `POST /api/dcp/reviews/:id/comments` - 添加评审意见

#### 交付物管理

- `GET /api/deliverables` - 获取交付物列表
- `GET /api/deliverables/:id` - 获取交付物详情
- `POST /api/deliverables` - 创建交付物
- `PUT /api/deliverables/:id` - 更新交付物
- `DELETE /api/deliverables/:id` - 删除交付物

#### 任务管理

- `GET /api/tasks` - 获取任务列表
- `POST /api/tasks` - 创建任务
- `PUT /api/tasks/:id` - 更新任务

### 前端开发

前端采用原生 JavaScript 开发，主要文件说明：

- `app.js` - 主应用逻辑，页面切换、数据管理
- `services/api.js` - API 调用封装
- `components/` - 各功能模块的组件代码

### 添加新功能

1. **后端 API** - 在 `server.js` 中添加路由
2. **数据服务** - 在 `dataService.js` 中添加数据操作方法
3. **前端页面** - 在 `index.html` 中添加页面结构
4. **前端逻辑** - 在 `app.js` 中添加页面渲染和交互逻辑
5. **样式设计** - 在 `components.css` 中添加样式

## 🐛 调试和日志

### 日志查看

服务器启动后会在控制台输出详细日志：

```bash
IPD项目协作系统后端服务已启动
服务器地址: http://localhost:3004
前端页面: http://localhost:3004/index.html
API接口: http://localhost:3004/api
按 Ctrl+C 停止服务器
```

### 常见问题

1. **端口被占用**

   ```
   Error: listen EADDRINUSE: address already in use :::3004
   ```

   解决方案：修改 `backend/server.js` 中的端口号，或关闭占用端口的程序

2. **数据文件权限错误**

   ```
   Error: EACCES: permission denied
   ```

   解决方案：确保 `backend/data/` 目录有读写权限

3. **API 请求失败**
   - 检查后端服务是否正常启动
   - 确认前端 API 配置的地址是否正确
   - 查看浏览器开发者工具的网络面板

### 开发工具

推荐使用以下工具进行开发：

- **代码编辑器**: VS Code、WebStorm
- **浏览器**: Chrome DevTools、Firefox Developer Tools
- **API 测试**: Postman、Insomnia
- **版本控制**: Git

## 📦 部署说明

### 生产环境部署

1. **环境准备**

   ```bash
   # 安装Node.js和npm
   # 确保服务器有足够的磁盘空间存储数据文件
   ```

2. **部署步骤**

   ```bash
   # 上传项目文件到服务器
   # 安装依赖
   npm install --production

   # 启动服务
   npm start
   ```

3. **进程管理**
   ```bash
   # 使用PM2管理进程（推荐）
   npm install -g pm2
   pm2 start backend/server.js --name ipd-system
   pm2 startup
   pm2 save
   ```

### 反向代理配置

如使用 Nginx 作为反向代理：

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3004;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## 🤝 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 📞 支持

如有问题或建议，请通过以下方式联系：

- 创建 Issue
- 发送邮件到项目维护者
- 查看项目文档和 FAQ

---

**IPD 项目协作系统** - 让项目管理更简单、更高效！
