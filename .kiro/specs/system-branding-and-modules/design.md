# Design Document

## Overview

本设计文档详细描述了"源踔科技集成产品开发管理系统"的品牌升级和功能扩展方案。主要包括系统名称更新、专业 logo 设计、登录界面改进、报表中心和帮助模块的实现。设计遵循现有系统的架构模式，确保一致的用户体验和技术实现。

## Architecture

### 系统架构概述

基于现有的简单 HTML/CSS/JavaScript 架构，采用以下设计原则：

- **前端架构**: 纯 HTML5 + CSS3 + 原生 JavaScript
- **模块化设计**: 每个页面独立，通过 common.js 共享通用功能
- **响应式布局**: 支持桌面和移动设备
- **会话管理**: 基于 sessionStorage 的简单会话控制
- **数据存储**: 静态 JSON 数据文件 + 本地存储

### 技术栈

- **前端**: HTML5, CSS3, 原生 JavaScript
- **样式框架**: 自定义 CSS 框架（common.css）
- **图标**: Unicode 表情符号 + CSS 图标
- **数据格式**: JSON
- **存储**: sessionStorage, localStorage

## Components and Interfaces

### 1. 品牌标识组件

#### Logo 设计规范

```css
.logo {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #3498db 0%, #2980b9 100%);
  border-radius: 20px;
  position: relative;
  box-shadow: 0 8px 16px rgba(52, 152, 219, 0.3);
}

.logo::before {
  content: "";
  position: absolute;
  width: 40px;
  height: 40px;
  background: white;
  border-radius: 8px;
  opacity: 0.9;
}

.logo::after {
  content: "YC";
  position: absolute;
  font-size: 18px;
  font-weight: bold;
  color: #2980b9;
  z-index: 1;
}
```

#### 系统名称组件

- **主标题**: "源踔科技集成产品开发管理系统"
- **副标题**: "Integrated Product Development Management System"
- **字体**: 系统默认字体栈
- **颜色**: 主色调 #2c3e50

### 2. 导航栏组件

#### 更新后的导航结构

```html
<div class="nav-menu">
  <a href="index.html">项目概览</a>
  <a href="dashboard.html">仪表板</a>
  <a href="team.html">团队协作</a>
  <a href="stages.html">阶段管理</a>
  <a href="dcp.html">DCP评审</a>
  <a href="deliverables.html">交付物管理</a>
  <a href="reports.html">报表中心</a>
  <a href="users.html">用户管理</a>
  <a href="help.html">帮助</a>
  <a href="settings.html">系统设置</a>
  <a href="#" onclick="logout()" style="color: #e74c3c">退出</a>
</div>
```

### 3. 登录界面组件

#### 登录表单设计

- **布局**: 居中卡片式设计
- **背景**: 渐变色背景
- **表单字段**: 用户名、密码、记住我选项
- **按钮**: 主要操作按钮
- **验证**: 前端基础验证

#### 登录验证逻辑

```javascript
function handleLogin(event) {
  event.preventDefault();
  var username = document.getElementById("username").value;
  var password = document.getElementById("password").value;

  // 验证固定账户: admin/admin123
  if (username === "admin" && password === "admin123") {
    sessionStorage.setItem("isLoggedIn", "true");
    sessionStorage.setItem("currentUser", username);
    window.location.href = "index.html";
  } else {
    showErrorMessage("用户名或密码错误");
  }
}
```

### 4. 报表中心组件

#### 报表分类结构

```javascript
var reportCategories = {
  project: { name: "项目报表", icon: "📊", count: 5 },
  team: { name: "团队报表", icon: "👥", count: 3 },
  financial: { name: "财务报表", icon: "💰", count: 4 },
  quality: { name: "质量报表", icon: "✅", count: 3 },
};
```

#### 报表数据模型

```javascript
var reportModel = {
  id: "string", // 报表唯一标识
  name: "string", // 报表名称
  category: "string", // 报表分类
  description: "string", // 报表描述
  icon: "string", // 报表图标
  lastGenerated: "date", // 最后生成时间
  frequency: "string", // 更新频率
};
```

#### 报表功能接口

- `renderReports(filter)`: 渲染报表列表
- `filterReports()`: 过滤报表
- `previewReport(reportId)`: 预览报表
- `generateReport(reportId)`: 生成报表

### 5. 帮助模块组件

#### 帮助内容结构

```javascript
var helpSections = {
  quickStart: { name: "快速入门", icon: "🚀" },
  userGuide: { name: "用户指南", icon: "📖" },
  faq: { name: "常见问题", icon: "❓" },
  contact: { name: "联系支持", icon: "📞" },
};
```

#### 帮助页面布局

- **侧边导航**: 帮助分类导航
- **内容区域**: 帮助内容展示
- **搜索功能**: 帮助内容搜索
- **反馈功能**: 用户反馈收集

### 6. 会话管理组件

#### 登录状态检查

```javascript
function checkLoginStatus() {
  if (sessionStorage.getItem("isLoggedIn") !== "true") {
    window.location.href = "login.html";
    return false;
  }
  return true;
}
```

#### 退出功能

```javascript
function logout() {
  showConfirm("确定要退出系统吗？", function () {
    sessionStorage.removeItem("isLoggedIn");
    sessionStorage.removeItem("currentUser");
    window.location.href = "login.html";
  });
}
```

## Data Models

### 1. 用户会话模型

```javascript
var userSession = {
  isLoggedIn: boolean,
  currentUser: string,
  loginTime: timestamp,
  lastActivity: timestamp,
};
```

### 2. 报表数据模型

```javascript
var reportData = {
  id: string,
  name: string,
  category: "project" | "team" | "financial" | "quality",
  description: string,
  icon: string,
  lastGenerated: string,
  frequency: string,
  data: object,
  charts: array,
};
```

### 3. 帮助内容模型

```javascript
var helpContent = {
  id: string,
  title: string,
  category: string,
  content: string,
  tags: array,
  lastUpdated: string,
  viewCount: number,
};
```

## Error Handling

### 1. 登录错误处理

- **无效凭据**: 显示中文错误提示
- **网络错误**: 显示连接失败提示
- **会话过期**: 自动跳转到登录页面

### 2. 页面加载错误处理

- **资源加载失败**: 显示友好错误信息
- **数据加载错误**: 提供重试机制
- **JavaScript 错误**: 优雅降级处理

### 3. 报表生成错误处理

- **数据不足**: 提示数据不完整
- **生成失败**: 显示错误原因和解决方案
- **导出错误**: 提供替代导出方式

### 4. 通用错误处理机制

```javascript
function handleError(error, context) {
  console.error(`${context}错误:`, error);
  showErrorMessage(`${context}失败，请稍后重试`);
}

function safeExecute(func, errorContext) {
  try {
    return func();
  } catch (error) {
    handleError(error, errorContext);
    return null;
  }
}
```

## Testing Strategy

### 1. 功能测试

- **登录流程测试**: 验证正确和错误凭据的处理
- **导航测试**: 确保所有页面链接正常工作
- **报表功能测试**: 验证报表生成和导出功能
- **帮助模块测试**: 确保帮助内容正确显示

### 2. 界面测试

- **响应式测试**: 在不同设备尺寸下测试界面
- **浏览器兼容性测试**: 主流浏览器兼容性验证
- **视觉一致性测试**: 确保品牌元素一致应用

### 3. 用户体验测试

- **导航流畅性**: 页面间跳转的流畅性
- **加载性能**: 页面加载速度优化
- **错误处理**: 错误情况下的用户体验

### 4. 安全测试

- **会话管理**: 验证登录状态管理的安全性
- **输入验证**: 防止恶意输入
- **数据保护**: 敏感信息的保护措施

### 5. 测试用例示例

```javascript
// 登录功能测试
function testLogin() {
  // 测试正确凭据
  assert(login("admin", "admin123") === true);

  // 测试错误凭据
  assert(login("wrong", "wrong") === false);

  // 测试空输入
  assert(login("", "") === false);
}

// 报表生成测试
function testReportGeneration() {
  var reportId = "rpt_001";
  var result = generateReport(reportId);
  assert(result !== null);
  assert(result.status === "success");
}
```

### 6. 自动化测试考虑

虽然当前采用简单的前端架构，但可以考虑以下自动化测试方案：

- **单元测试**: 使用 Jest 或类似框架测试 JavaScript 函数
- **端到端测试**: 使用 Playwright 或 Cypress 测试用户流程
- **视觉回归测试**: 使用工具检测界面变化

这个设计确保了系统的可维护性、可扩展性和用户友好性，同时保持了与现有系统架构的一致性。
