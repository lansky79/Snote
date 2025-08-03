# IPD 项目协作系统重构设计文档

## 架构设计

### 整体架构

采用多页面静态网站架构，每个功能模块都是独立的 HTML 页面：

```
ipd-system-simple/
├── index.html              # 主页/项目概览
├── dashboard.html           # 仪表板
├── team.html               # 团队协作
├── stages.html             # 阶段管理
├── dcp.html                # DCP评审
├── deliverables.html       # 交付物管理
├── users.html              # 用户管理
├── settings.html           # 系统设置
├── css/
│   └── common.css          # 通用样式
├── js/
│   ├── common.js           # 通用功能
│   └── data.js             # 模拟数据
└── assets/
    └── images/             # 图片资源
```

### 技术选型

1. **HTML5** - 语义化标记，无需模板引擎
2. **CSS3** - 简单样式，使用 CSS Grid 和 Flexbox
3. **原生 JavaScript** - ES5 语法，确保兼容性
4. **静态文件** - 无需服务器端渲染

### 页面设计

#### 通用布局

每个页面都采用相同的布局结构：

```html
<!DOCTYPE html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>页面标题 - IPD项目协作系统</title>
    <link rel="stylesheet" href="css/common.css" />
  </head>
  <body>
    <!-- 顶部导航栏 -->
    <nav class="top-nav">
      <div class="nav-brand">IPD项目协作系统</div>
      <div class="nav-menu">
        <a href="index.html">项目概览</a>
        <a href="dashboard.html">仪表板</a>
        <a href="team.html">团队协作</a>
        <!-- 其他菜单项 -->
      </div>
    </nav>

    <!-- 主要内容区域 -->
    <main class="main-content">
      <!-- 页面特定内容 -->
    </main>

    <!-- 通用脚本 -->
    <script src="js/data.js"></script>
    <script src="js/common.js"></script>
    <!-- 页面特定脚本 -->
  </body>
</html>
```

#### 数据管理

使用简单的 JavaScript 对象存储数据：

```javascript
// data.js
var IPD_DATA = {
  projects: [
    {
      id: "proj_001",
      name: "档案数字化质检工具",
      description: "基于AI技术的档案数字化质量检测工具",
      status: "in_progress",
      progress: 75,
    },
    // 更多项目数据
  ],
  users: [
    // 用户数据
  ],
  // 其他数据
};
```

#### 页面渲染

每个页面使用简单的 DOM 操作渲染内容：

```javascript
// 项目列表渲染示例
function renderProjects() {
  var container = document.getElementById("projects-container");
  var html = "";

  for (var i = 0; i < IPD_DATA.projects.length; i++) {
    var project = IPD_DATA.projects[i];
    html += '<div class="project-card">';
    html += "<h3>" + project.name + "</h3>";
    html += "<p>" + project.description + "</p>";
    html += "</div>";
  }

  container.innerHTML = html;
}
```

### 样式设计

#### CSS 架构

使用简单的 CSS 类命名规范：

```css
/* 布局类 */
.container {
  max-width: 1200px;
  margin: 0 auto;
}
.grid {
  display: grid;
}
.flex {
  display: flex;
}

/* 组件类 */
.card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
.btn {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.btn-primary {
  background: #3498db;
  color: white;
}

/* 状态类 */
.active {
  background: #3498db;
  color: white;
}
.disabled {
  opacity: 0.5;
  pointer-events: none;
}
```

#### 响应式设计

使用 CSS 媒体查询实现响应式：

```css
/* 桌面端 */
.grid-3 {
  grid-template-columns: repeat(3, 1fr);
}

/* 平板端 */
@media (max-width: 768px) {
  .grid-3 {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* 手机端 */
@media (max-width: 480px) {
  .grid-3 {
    grid-template-columns: 1fr;
  }
}
```

### 功能设计

#### 导航系统

使用简单的页面跳转，在每个页面的导航中高亮当前页面：

```javascript
// common.js
function highlightCurrentNav() {
  var currentPage = window.location.pathname.split("/").pop();
  var navLinks = document.querySelectorAll(".nav-menu a");

  for (var i = 0; i < navLinks.length; i++) {
    var link = navLinks[i];
    var href = link.getAttribute("href");

    if (href === currentPage) {
      link.classList.add("active");
    }
  }
}
```

#### 错误处理

提供友好的错误处理：

```javascript
function safeRender(renderFunction) {
  try {
    renderFunction();
  } catch (error) {
    console.error("渲染错误:", error);
    showErrorMessage("页面加载失败，请刷新重试");
  }
}

function showErrorMessage(message) {
  var errorDiv = document.createElement("div");
  errorDiv.className = "error-message";
  errorDiv.textContent = message;
  document.body.appendChild(errorDiv);
}
```

#### 数据可视化

使用简单的 HTML+CSS 实现图表：

```html
<!-- 进度条 -->
<div class="progress-bar">
  <div class="progress-fill" style="width: 75%"></div>
</div>

<!-- 统计卡片 -->
<div class="stat-card">
  <div class="stat-number">12</div>
  <div class="stat-label">总项目数</div>
</div>
```

### 部署设计

#### 静态部署

系统可以部署到任何静态文件服务器：

1. **本地开发** - 直接打开 HTML 文件或使用简单的 HTTP 服务器
2. **生产部署** - 上传到静态托管服务（如 GitHub Pages、Netlify 等）
3. **企业部署** - 部署到企业内部的 Web 服务器

#### 开发流程

1. 修改 HTML/CSS/JS 文件
2. 刷新浏览器查看效果
3. 无需构建或编译步骤
4. 直接部署静态文件

### 扩展性设计

#### 模块化

每个功能模块都是独立的，可以单独开发和测试：

```javascript
// 项目模块
var ProjectModule = {
  render: function () {
    // 渲染项目列表
  },

  filter: function (status) {
    // 过滤项目
  },
};

// 用户模块
var UserModule = {
  render: function () {
    // 渲染用户列表
  },
};
```

#### 插件系统

预留插件接口，方便后续扩展：

```javascript
var IPD_PLUGINS = [];

function registerPlugin(plugin) {
  IPD_PLUGINS.push(plugin);
}

function initPlugins() {
  for (var i = 0; i < IPD_PLUGINS.length; i++) {
    IPD_PLUGINS[i].init();
  }
}
```

## 实现优先级

1. **第一阶段** - 基础框架和项目概览页面
2. **第二阶段** - 仪表板和团队协作页面
3. **第三阶段** - 阶段管理和 DCP 评审页面
4. **第四阶段** - 交付物管理和用户管理页面
5. **第五阶段** - 系统设置和高级功能
