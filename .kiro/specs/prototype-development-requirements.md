# 原型开发通用要求文档

## 概述

本文档定义了所有原型项目的开发标准和要求，确保原型系统适合软著申请、功能演示和快速开发调试。本文档作为通用指导原则，具体项目应根据实际需求进行调整。

## 核心原则

### 1. 简化优先

- 采用最简单的技术栈，减少学习成本和调试复杂度
- 避免过度工程化，重点关注功能展示
- 优先选择成熟稳定的技术方案

### 2. 数据真实性

- **严禁硬编码数据**：所有业务数据必须从外部文件或数据库读取
- **避免明显假数据**：数据内容要真实合理，符合业务场景
- **支持真实 CRUD 操作**：增删改查必须有实际的数据持久化

### 3. 快速开发

- 项目结构简单清晰，便于理解和维护
- 开发环境启动简单，最好一条命令搞定
- 调试方便，错误信息清晰明确

## 技术栈要求

### 前端技术选择优先级

#### 第一优先级（最简单）

- **原生 HTML + JavaScript + CSS**
- 页面切换：条件渲染显示/隐藏
- 样式：原生 CSS，可适当使用简单的 CSS 框架
- 图表：CSS 进度条、HTML 表格，避免复杂图表库

#### 第二优先级（适度简化）

- **React + JavaScript**（不使用 TypeScript）
- 状态管理：useState + useEffect
- 路由：简单的条件渲染，避免 React Router
- UI 组件：原生 CSS 或简单的 UI 库

#### 第三优先级（仅在必要时使用）

- **Vue.js + JavaScript**
- **React + 少量必要的库**

### 后端技术选择

#### 推荐方案

- **Node.js + Express.js**
- 数据存储：JSON 文件 + fs 模块
- API 设计：RESTful 风格
- 错误处理：简单的 try-catch

#### 备选方案

- **Python + Flask**
- **Java + Spring Boot**（仅在特定需求下）

### 数据存储要求

#### 首选方案：JSON 文件存储

```
data/
├── users.json          # 用户数据
├── projects.json       # 项目数据
├── config.json         # 系统配置
└── logs.json          # 操作日志
```

#### 数据文件要求

1. **结构化数据**：使用规范的 JSON 格式
2. **关联关系**：通过 ID 字段建立数据关联
3. **时间戳**：包含创建时间、更新时间等字段
4. **完整性**：数据字段完整，符合业务逻辑

#### 数据操作要求

```javascript
// 正确示例：从文件读取数据
async function getUsers() {
  const data = await fs.readFile("data/users.json", "utf8");
  return JSON.parse(data);
}

// 错误示例：硬编码数据
const users = [
  { id: 1, name: "张三" }, // 这是硬编码，禁止使用
  { id: 2, name: "李四" },
];
```

## 项目结构要求

### 标准目录结构

```
project-name/
├── frontend/                # 前端代码
│   ├── index.html          # 主页面
│   ├── css/                # 样式文件
│   ├── js/                 # JavaScript文件
│   │   ├── services/       # 数据服务
│   │   ├── components/     # 页面组件
│   │   └── utils/          # 工具函数
│   └── images/             # 图片资源
├── backend/                 # 后端代码
│   ├── server.js           # 服务器入口
│   ├── routes/             # API路由
│   ├── services/           # 业务逻辑
│   └── data/               # 数据文件
│       ├── users.json
│       ├── projects.json
│       └── config.json
├── docs/                   # 文档
│   ├── README.md
│   └── API.md
├── package.json            # 依赖配置
└── .gitignore             # Git忽略文件
```

### 文件命名规范

- 使用小写字母和连字符：`user-service.js`
- 组件文件使用驼峰命名：`projectList.js`
- 数据文件使用下划线：`user_data.json`

## 数据设计要求

### 数据内容要求

1. **真实性**：使用真实的业务场景数据
2. **完整性**：包含必要的业务字段
3. **一致性**：数据格式和命名保持一致
4. **关联性**：正确建立数据间的关联关系

### 示例数据结构

```json
{
  "users": [
    {
      "id": "user_001",
      "name": "张明",
      "email": "zhangming@company.com",
      "department": "产品研发部",
      "role": "project_manager",
      "createdAt": "2024-01-15T08:00:00Z",
      "updatedAt": "2024-02-01T10:30:00Z"
    }
  ],
  "projects": [
    {
      "id": "proj_001",
      "name": "智能手机产品开发",
      "description": "新一代智能手机产品研发项目",
      "managerId": "user_001",
      "status": "in_progress",
      "createdAt": "2024-01-15T08:00:00Z",
      "updatedAt": "2024-02-01T10:30:00Z"
    }
  ]
}
```

### 禁止的数据示例

```javascript
// 禁止：明显的测试数据
const users = [
  { id: 1, name: "test user" },
  { id: 2, name: "user2" },
  { id: 3, name: "aaa" },
];

// 禁止：硬编码的假数据
const mockData = {
  projects: ["项目1", "项目2", "项目3"],
};

// 禁止：显而易见的占位符
const placeholder = {
  name: "TODO: 填写真实姓名",
  email: "example@example.com",
};
```

## API 设计要求

### RESTful API 规范

```javascript
// 用户管理
GET    /api/users           # 获取用户列表
GET    /api/users/:id       # 获取单个用户
POST   /api/users           # 创建用户
PUT    /api/users/:id       # 更新用户
DELETE /api/users/:id       # 删除用户

// 项目管理
GET    /api/projects        # 获取项目列表
POST   /api/projects        # 创建项目
PUT    /api/projects/:id    # 更新项目
DELETE /api/projects/:id    # 删除项目
```

### 数据持久化要求

```javascript
// 正确示例：真实的数据保存
async function createUser(userData) {
  // 1. 读取现有数据
  const data = await readJsonFile("users.json");

  // 2. 添加新用户
  const newUser = {
    id: generateId(),
    ...userData,
    createdAt: new Date().toISOString(),
  };
  data.users.push(newUser);

  // 3. 保存到文件
  await writeJsonFile("users.json", data);

  return newUser;
}
```

## 界面设计要求

### 页面布局原则

1. **简洁明了**：避免复杂的布局和动画
2. **功能完整**：每个页面都要有完整的功能展示
3. **数据驱动**：界面内容完全由数据驱动生成
4. **响应式**：至少支持桌面端显示

### 必备页面元素

- 导航菜单：清晰的功能导航
- 数据列表：支持增删改查操作
- 表单页面：数据录入和编辑
- 详情页面：数据详细信息展示
- 统计图表：业务数据的可视化展示

### CSS 样式要求

```css
/* 使用简单的CSS，避免复杂的动画和效果 */
.page-content {
  display: none;
  padding: 20px;
}

.page-content.active {
  display: block;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
}

.btn-primary {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 8px 16px;
  cursor: pointer;
}
```

## 错误处理要求

### 前端错误处理

```javascript
// API调用错误处理
async function fetchData(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("数据获取失败:", error);
    showErrorMessage("数据加载失败，请稍后重试");
    return null;
  }
}
```

### 后端错误处理

```javascript
// 文件操作错误处理
async function readJsonFile(filename) {
  try {
    const data = await fs.readFile(filename, "utf8");
    return JSON.parse(data);
  } catch (error) {
    console.error(`读取文件失败: ${filename}`, error);
    return { error: "数据读取失败" };
  }
}
```

## 开发和部署要求

### 开发调试要求

1. **简单启动**：最多两个命令启动完整环境（前端+后端）
2. **端口配置**：使用固定端口，在 README 中明确说明
3. **清晰日志**：错误信息要明确指出问题所在
4. **热重载**：代码修改后自动刷新（可选）
5. **避免复杂配置**：不增加不必要的开发开销

### 启动脚本示例

```bash
# 安装依赖
npm install

# 启动后端（终端1）
npm run server

# 启动前端（终端2或直接打开浏览器）
open frontend/index.html
```

### 推荐的 package.json 配置

```json
{
  "scripts": {
    "server": "node backend/server.js",
    "start": "node backend/server.js"
  }
}
```

### 端口配置建议

- 后端 API 服务：3001 端口
- 前端页面：直接打开 HTML 文件或使用 3000 端口
- 在 README.md 中明确说明端口使用情况

```

### 部署要求

1. **静态部署**：前端文件可直接部署到任何静态文件服务器
2. **容器化**：提供简单的Dockerfile支持容器化部署（可选）
3. **文档完整**：README.md包含完整的安装和使用说明

## 质量检查清单

### 开发完成前必须检查的项目

#### 数据相关

- [ ] 所有业务数据都从外部文件读取
- [ ] 没有硬编码的数据内容
- [ ] 数据内容真实合理，符合业务场景
- [ ] 增删改查操作都能正确保存到文件
- [ ] 数据结构完整，包含必要的字段

#### 功能相关

- [ ] 所有页面都能正常访问
- [ ] 所有按钮和链接都有对应功能
- [ ] 表单提交能正确保存数据
- [ ] 数据列表能正确显示和更新
- [ ] 错误情况有适当的提示信息

#### 代码相关

- [ ] 代码结构清晰，文件组织合理
- [ ] 没有明显的调试代码和注释
- [ ] 变量和函数命名规范
- [ ] 关键功能有基本的错误处理

#### 部署相关

- [ ] 项目能在新环境中正常启动
- [ ] README.md 文档完整准确
- [ ] 依赖项都在 package.json 中声明
- [ ] 数据文件路径配置正确

## 常见问题和解决方案

### Q: 如何避免数据看起来像假数据？

A:

1. 使用真实的业务场景和术语
2. 数据内容要有逻辑关联性
3. 时间戳使用真实的日期格式
4. 避免使用 test、demo、example 等明显的测试词汇

### Q: 如何简化技术栈但保持功能完整？

A:

1. 优先使用原生技术，减少第三方依赖
2. 用简单的方案替代复杂的功能（如用 CSS 进度条替代图表库）
3. 功能够用即可，不追求完美的用户体验

### Q: 如何确保数据操作的真实性？

A:

1. 所有数据操作都要有对应的文件读写
2. 使用统一的数据访问层，避免直接操作数据
3. 在关键操作后验证数据是否正确保存

## 总结

遵循本文档的要求，可以确保原型项目：

1. 技术栈简单，开发和调试效率高
2. 数据真实可信，适合软著申请
3. 功能完整可用，适合演示展示
4. 代码质量良好，便于维护和扩展

所有原型项目都应该严格按照这些要求执行，确保项目质量和一致性。
```

### 部署要求

1. **静态部署**: 构建后的文件可直接部署到任何静态文件服务器
2. **容器化**: 提供简单的 Dockerfile 支持容器化部署（可选）
3. **文档完整**: README.md 包含完整的安装和使用说明

## 总结

遵循本文档的要求，可以确保原型项目：

1. 技术栈简单，开发和调试效率高
2. 数据真实可信，适合软著申请
3. 功能完整可用，适合演示展示
4. 代码质量良好，便于维护和扩展

所有原型项目都应该严格按照这些要求执行，确保项目质量和一致性。
