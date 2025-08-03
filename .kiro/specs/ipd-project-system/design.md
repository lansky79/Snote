# 设计文档

## 概述

IPD 项目协作系统采用最简化的技术栈，使用原生 Web 技术实现，重点在于功能展示和数据的真实持久化存储。系统避免复杂的框架依赖，便于快速开发和调试。

## 架构

### 技术栈选择

- **前端**: 原生 HTML + JavaScript + CSS
- **UI 样式**: 原生 CSS + 简单响应式布局
- **页面切换**: JavaScript 条件渲染显示/隐藏页面区域
- **数据存储**: JSON 文件 + Node.js 后端 API
- **图表展示**: CSS 进度条 + HTML 表格
- **后端服务**: Express.js + fs 模块 (文件操作)
- **构建工具**: 无需构建工具，直接运行

### 系统架构图

```
┌─────────────────────────────────────────────────────────┐
│                前端界面 (原生HTML/JS)                      │
├─────────────────────────────────────────────────────────┤
│  页面区域                                                │
│  ├── 项目概览区域  ├── 阶段管理区域  ├── 团队协作区域      │
├─────────────────────────────────────────────────────────┤
│  JavaScript数据服务 (fetch API)                          │
│  ├── projectService.js  ├── userService.js              │
├─────────────────────────────────────────────────────────┤
│  后端API服务 (Express.js)                                │
│  ├── /api/projects  ├── /api/users  ├── /api/dcp        │
├─────────────────────────────────────────────────────────┤
│  数据存储层 (JSON文件)                                    │
│  ├── projects.json  ├── users.json  ├── dcp_reviews.json │
└─────────────────────────────────────────────────────────┘
```

## 组件和接口

### 项目结构

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
│   │   ├── components/         # 页面组件
│   │   │   ├── projectStages.js
│   │   │   ├── dcpReview.js
│   │   │   ├── teamBoard.js
│   │   │   └── dashboard.js
│   │   └── utils/
│   │       └── helpers.js
│   └── images/                 # 图片资源
├── backend/                     # Node.js后端
│   ├── server.js               # 服务器入口
│   ├── routes/                 # API路由
│   │   ├── projects.js
│   │   ├── users.js
│   │   └── dcp.js
│   ├── services/               # 业务逻辑
│   │   └── dataService.js
│   └── data/                   # JSON数据文件
│       ├── projects.json
│       ├── users.json
│       ├── dcp_reviews.json
│       ├── deliverables.json
│       └── tasks.json
└── package.json
```

### 前端页面结构 (index.html)

```html
<!DOCTYPE html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>IPD项目协作系统</title>
    <link rel="stylesheet" href="css/main.css" />
  </head>
  <body>
    <!-- 导航栏 -->
    <nav class="navbar">
      <div class="nav-brand">IPD项目协作系统</div>
      <ul class="nav-menu">
        <li><a href="#" onclick="showPage('overview')">项目概览</a></li>
        <li><a href="#" onclick="showPage('stages')">阶段管理</a></li>
        <li><a href="#" onclick="showPage('team')">团队协作</a></li>
        <li><a href="#" onclick="showPage('dcp')">DCP评审</a></li>
        <li><a href="#" onclick="showPage('dashboard')">仪表板</a></li>
      </ul>
    </nav>

    <!-- 项目概览页面 -->
    <div id="overview-page" class="page-content active">
      <div class="page-header">
        <h1>项目概览</h1>
        <button onclick="createProject()" class="btn-primary">新建项目</button>
      </div>
      <div id="projects-list" class="projects-grid">
        <!-- 项目列表将通过JavaScript动态加载 -->
      </div>
    </div>

    <!-- 阶段管理页面 -->
    <div id="stages-page" class="page-content">
      <div class="page-header">
        <h1>项目阶段管理</h1>
      </div>
      <div id="stages-container">
        <!-- 六阶段流程图将通过JavaScript动态生成 -->
      </div>
    </div>

    <!-- 团队协作页面 -->
    <div id="team-page" class="page-content">
      <div class="page-header">
        <h1>团队协作</h1>
      </div>
      <div id="team-board">
        <!-- 团队看板将通过JavaScript动态生成 -->
      </div>
    </div>

    <!-- DCP评审页面 -->
    <div id="dcp-page" class="page-content">
      <div class="page-header">
        <h1>DCP评审管理</h1>
      </div>
      <div id="dcp-reviews">
        <!-- DCP评审列表将通过JavaScript动态生成 -->
      </div>
    </div>

    <!-- 仪表板页面 -->
    <div id="dashboard-page" class="page-content">
      <div class="page-header">
        <h1>项目仪表板</h1>
      </div>
      <div id="dashboard-charts">
        <!-- 图表和统计信息将通过JavaScript动态生成 -->
      </div>
    </div>

    <!-- 模态框 -->
    <div id="modal" class="modal">
      <div class="modal-content">
        <span class="close" onclick="closeModal()">&times;</span>
        <div id="modal-body"></div>
      </div>
    </div>

    <!-- JavaScript文件 -->
    <script src="js/services/api.js"></script>
    <script src="js/services/projectService.js"></script>
    <script src="js/services/userService.js"></script>
    <script src="js/components/projectStages.js"></script>
    <script src="js/components/dcpReview.js"></script>
    <script src="js/components/teamBoard.js"></script>
    <script src="js/components/dashboard.js"></script>
    <script src="js/app.js"></script>
  </body>
</html>
```

### 数据模型

#### 项目数据结构 (projects.json)

```json
{
  "projects": [
    {
      "id": "proj_001",
      "name": "智能手机产品开发",
      "description": "新一代智能手机产品研发项目",
      "status": "in_progress",
      "currentStage": "develop",
      "createdAt": "2024-01-15T08:00:00Z",
      "updatedAt": "2024-02-01T10:30:00Z",
      "teamLeader": "user_001",
      "stages": {
        "concept": {
          "name": "概念阶段",
          "status": "completed",
          "progress": 100,
          "startDate": "2024-01-15",
          "endDate": "2024-01-30",
          "tasks": [
            {
              "id": "task_001",
              "name": "市场需求分析",
              "status": "completed",
              "assignee": "user_002"
            }
          ]
        },
        "plan": {
          "name": "计划阶段",
          "status": "completed",
          "progress": 100,
          "startDate": "2024-02-01",
          "endDate": "2024-02-15",
          "tasks": []
        },
        "develop": {
          "name": "开发阶段",
          "status": "in_progress",
          "progress": 65,
          "startDate": "2024-02-16",
          "endDate": null,
          "tasks": []
        },
        "verify": {
          "name": "验证阶段",
          "status": "not_started",
          "progress": 0,
          "startDate": null,
          "endDate": null,
          "tasks": []
        },
        "release": {
          "name": "发布阶段",
          "status": "not_started",
          "progress": 0,
          "startDate": null,
          "endDate": null,
          "tasks": []
        },
        "lifecycle": {
          "name": "生命周期阶段",
          "status": "not_started",
          "progress": 0,
          "startDate": null,
          "endDate": null,
          "tasks": []
        }
      }
    }
  ]
}
```

### 前端 JavaScript 服务

#### API 服务 (js/services/api.js)

```javascript
class ApiService {
  constructor() {
    this.baseURL = "http://localhost:3001/api";
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error("API请求失败:", error);
      this.showError("网络请求失败，请检查服务器连接");
      throw error;
    }
  }

  showError(message) {
    // 简单的错误提示
    const errorDiv = document.createElement("div");
    errorDiv.className = "error-message";
    errorDiv.textContent = message;
    document.body.appendChild(errorDiv);

    setTimeout(() => {
      document.body.removeChild(errorDiv);
    }, 3000);
  }

  // 项目相关API
  async getProjects() {
    return this.request("/projects");
  }

  async getProject(id) {
    return this.request(`/projects/${id}`);
  }

  async createProject(projectData) {
    return this.request("/projects", {
      method: "POST",
      body: JSON.stringify(projectData),
    });
  }

  async updateProject(id, updates) {
    return this.request(`/projects/${id}`, {
      method: "PUT",
      body: JSON.stringify(updates),
    });
  }

  async deleteProject(id) {
    return this.request(`/projects/${id}`, {
      method: "DELETE",
    });
  }

  async updateProjectStage(projectId, stage, stageData) {
    return this.request(`/projects/${projectId}/stages/${stage}`, {
      method: "PUT",
      body: JSON.stringify(stageData),
    });
  }

  // 用户相关API
  async getUsers() {
    return this.request("/users");
  }

  // DCP评审相关API
  async getDCPReviews() {
    return this.request("/dcp/reviews");
  }

  async createDCPReview(reviewData) {
    return this.request("/dcp/reviews", {
      method: "POST",
      body: JSON.stringify(reviewData),
    });
  }
}

// 全局API实例
const api = new ApiService();
```

#### 主应用逻辑 (js/app.js)

```javascript
// 全局状态
let currentPage = "overview";
let currentProject = null;
let projects = [];
let users = [];

// 页面初始化
document.addEventListener("DOMContentLoaded", async function () {
  await loadInitialData();
  showPage("overview");
});

// 加载初始数据
async function loadInitialData() {
  try {
    projects = await api.getProjects();
    users = await api.getUsers();
    console.log("数据加载完成:", { projects, users });
  } catch (error) {
    console.error("初始数据加载失败:", error);
  }
}

// 页面切换
function showPage(pageName) {
  // 隐藏所有页面
  const pages = document.querySelectorAll(".page-content");
  pages.forEach((page) => page.classList.remove("active"));

  // 显示目标页面
  const targetPage = document.getElementById(`${pageName}-page`);
  if (targetPage) {
    targetPage.classList.add("active");
    currentPage = pageName;

    // 根据页面类型加载对应数据
    switch (pageName) {
      case "overview":
        renderProjectsList();
        break;
      case "stages":
        renderProjectStages();
        break;
      case "team":
        renderTeamBoard();
        break;
      case "dcp":
        renderDCPReviews();
        break;
      case "dashboard":
        renderDashboard();
        break;
    }
  }
}

// 渲染项目列表
function renderProjectsList() {
  const container = document.getElementById("projects-list");
  if (!container) return;

  container.innerHTML = "";

  projects.forEach((project) => {
    const projectCard = document.createElement("div");
    projectCard.className = "project-card";
    projectCard.innerHTML = `
            <div class="project-header">
                <h3>${project.name}</h3>
                <span class="project-status ${project.status}">${getStatusText(
      project.status
    )}</span>
            </div>
            <p class="project-description">${project.description}</p>
            <div class="project-progress">
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${calculateOverallProgress(
                      project
                    )}%"></div>
                </div>
                <span class="progress-text">${calculateOverallProgress(
                  project
                )}%</span>
            </div>
            <div class="project-actions">
                <button onclick="viewProject('${
                  project.id
                }')" class="btn-secondary">查看详情</button>
                <button onclick="editProject('${
                  project.id
                }')" class="btn-primary">编辑</button>
                <button onclick="deleteProject('${
                  project.id
                }')" class="btn-danger">删除</button>
            </div>
        `;
    container.appendChild(projectCard);
  });
}

// 计算项目整体进度
function calculateOverallProgress(project) {
  const stages = Object.values(project.stages);
  const totalProgress = stages.reduce((sum, stage) => sum + stage.progress, 0);
  return Math.round(totalProgress / stages.length);
}

// 获取状态文本
function getStatusText(status) {
  const statusMap = {
    not_started: "未开始",
    in_progress: "进行中",
    completed: "已完成",
    blocked: "已阻塞",
  };
  return statusMap[status] || status;
}

// 项目操作函数
async function createProject() {
  const projectData = {
    name: prompt("请输入项目名称:"),
    description: prompt("请输入项目描述:"),
    status: "not_started",
    currentStage: "concept",
  };

  if (projectData.name && projectData.description) {
    try {
      const newProject = await api.createProject(projectData);
      projects.push(newProject);
      renderProjectsList();
    } catch (error) {
      console.error("创建项目失败:", error);
    }
  }
}

async function editProject(projectId) {
  const project = projects.find((p) => p.id === projectId);
  if (!project) return;

  const newName = prompt("请输入新的项目名称:", project.name);
  const newDescription = prompt("请输入新的项目描述:", project.description);

  if (newName && newDescription) {
    try {
      const updatedProject = await api.updateProject(projectId, {
        name: newName,
        description: newDescription,
      });

      const index = projects.findIndex((p) => p.id === projectId);
      projects[index] = updatedProject;
      renderProjectsList();
    } catch (error) {
      console.error("更新项目失败:", error);
    }
  }
}

async function deleteProject(projectId) {
  if (confirm("确定要删除这个项目吗？")) {
    try {
      await api.deleteProject(projectId);
      projects = projects.filter((p) => p.id !== projectId);
      renderProjectsList();
    } catch (error) {
      console.error("删除项目失败:", error);
    }
  }
}

function viewProject(projectId) {
  currentProject = projects.find((p) => p.id === projectId);
  showPage("stages");
}

// 模态框操作
function showModal(content) {
  const modal = document.getElementById("modal");
  const modalBody = document.getElementById("modal-body");
  modalBody.innerHTML = content;
  modal.style.display = "block";
}

function closeModal() {
  const modal = document.getElementById("modal");
  modal.style.display = "none";
}

// 点击模态框外部关闭
window.onclick = function (event) {
  const modal = document.getElementById("modal");
  if (event.target === modal) {
    modal.style.display = "none";
  }
};
```

## 错误处理

### 前端错误处理

1. **API 请求错误**: 显示用户友好的错误提示
2. **数据格式错误**: 验证从服务器返回的数据格式
3. **用户操作错误**: 提供确认对话框和输入验证

### 后端错误处理

1. **文件读写错误**: 捕获文件操作异常
2. **JSON 解析错误**: 验证数据格式完整性
3. **API 参数验证**: 验证请求参数的有效性

## 测试策略

### 手动测试重点

1. **数据持久化**: 验证所有增删改查操作都能正确保存到 JSON 文件
2. **页面切换**: 测试所有页面导航功能
3. **数据展示**: 确保数据能正确从 JSON 文件加载并显示
4. **用户交互**: 测试所有按钮和表单功能

## 部署和运维

### 开发环境启动

```bash
# 安装后端依赖
npm install express cors

# 启动后端服务
node backend/server.js

# 前端直接用浏览器打开 frontend/index.html
```

### 文件结构简单，无需复杂构建过程

- 前端文件可直接在浏览器中运行
- 后端使用 Node.js + Express 提供 API 服务
- 数据存储在 JSON 文件中，支持真实的增删改查操作

这个设计采用了最简化的技术栈，避免了复杂的框架依赖，同时确保数据操作的真实性和持久化。
