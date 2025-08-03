// IPD项目协作系统 - 修复版主应用

// 全局状态变量
let currentPage = "overview";
let currentProject = null;
let projects = [];
let users = [];
let dcpReviews = [];
let deliverables = [];
let tasks = [];

// 页面初始化
document.addEventListener("DOMContentLoaded", async function () {
  console.log("IPD项目协作系统正在初始化...");

  try {
    await loadInitialData();
    showPage("overview");
    console.log("系统初始化完成");
  } catch (error) {
    console.error("系统初始化失败:", error);
    showErrorMessage("系统初始化失败，请刷新页面重试");
  }
});

// 加载初始数据
async function loadInitialData() {
  try {
    console.log("正在加载数据...");

    // 加载项目数据
    try {
      const projectsResponse = await api.getProjects();
      projects = projectsResponse || [];
      console.log("项目数据加载成功:", projects.length);
    } catch (error) {
      console.warn("加载项目数据失败:", error);
      projects = getDefaultProjects();
    }

    // 加载用户数据
    try {
      const usersResponse = await api.getUsers();
      users = usersResponse || [];
      console.log("用户数据加载成功:", users.length);
    } catch (error) {
      console.warn("加载用户数据失败:", error);
      users = getDefaultUsers();
    }

    // 加载DCP评审数据
    try {
      const dcpResponse = await api.getDCPReviews();
      dcpReviews = dcpResponse || [];
      console.log("DCP评审数据加载成功:", dcpReviews.length);
    } catch (error) {
      console.warn("加载DCP评审数据失败:", error);
      dcpReviews = getDefaultDCPReviews();
    }

    // 加载交付物数据
    try {
      const deliverablesResponse = await api.getDeliverables();
      deliverables = deliverablesResponse || [];
      console.log("交付物数据加载成功:", deliverables.length);
    } catch (error) {
      console.warn("加载交付物数据失败:", error);
      deliverables = getDefaultDeliverables();
    }

    // 加载任务数据
    try {
      const tasksResponse = await api.getTasks();
      tasks = tasksResponse || [];
      console.log("任务数据加载成功:", tasks.length);
    } catch (error) {
      console.warn("加载任务数据失败:", error);
      tasks = getDefaultTasks();
    }

    console.log("所有数据加载完成:", {
      projects: projects.length,
      users: users.length,
      dcpReviews: dcpReviews.length,
      deliverables: deliverables.length,
      tasks: tasks.length,
    });
  } catch (error) {
    console.error("数据加载失败:", error);
    throw error;
  }
}

// 页面切换函数
function showPage(pageName) {
  console.log("切换到页面:", pageName);

  // 更新导航状态
  const navLinks = document.querySelectorAll(".nav-link");
  navLinks.forEach((link) => link.classList.remove("active"));

  const activeLink = document.querySelector(
    `[onclick="showPage('${pageName}')"]`
  );
  if (activeLink) {
    activeLink.classList.add("active");
  }

  // 隐藏所有页面
  const pages = document.querySelectorAll(".page-content");
  pages.forEach((page) => page.classList.remove("active"));

  // 显示目标页面
  const targetPage = document.getElementById(`${pageName}-page`);
  if (targetPage) {
    targetPage.classList.add("active");
    currentPage = pageName;

    // 更新页面标题
    updatePageTitle(pageName);

    // 根据页面类型加载对应数据
    try {
      switch (pageName) {
        case "overview":
          renderProjectsList();
          break;
        case "project-detail":
          renderProjectDetail();
          break;
        case "stages":
          if (typeof renderProjectStages === "function") {
            renderProjectStages();
          }
          break;
        case "team":
          if (typeof renderTeamBoard === "function") {
            renderTeamBoard();
          }
          break;
        case "dcp":
          if (typeof renderDCPReviews === "function") {
            renderDCPReviews();
          }
          break;
        case "deliverables":
          renderDeliverablesList();
          break;
        case "dashboard":
          if (typeof renderDashboard === "function") {
            renderDashboard();
          }
          break;
        case "users":
          if (typeof renderUsersList === "function") {
            renderUsersList();
          }
          break;
        case "settings":
          if (typeof renderSettings === "function") {
            renderSettings();
          }
          break;
      }
    } catch (error) {
      console.error(`渲染页面 ${pageName} 时出错:`, error);
      showErrorMessage(`页面加载失败: ${error.message}`);
    }
  } else {
    console.error(`页面容器 ${pageName}-page 不存在`);
  }
}

// 更新页面标题
function updatePageTitle(pageName) {
  const titleMap = {
    overview: "IPD项目协作系统 - 项目概览",
    "project-detail": "IPD项目协作系统 - 项目详情",
    stages: "IPD项目协作系统 - 阶段管理",
    team: "IPD项目协作系统 - 团队协作",
    dcp: "IPD项目协作系统 - DCP评审",
    deliverables: "IPD项目协作系统 - 交付物管理",
    dashboard: "IPD项目协作系统 - 仪表板",
    users: "IPD项目协作系统 - 用户管理",
    settings: "IPD项目协作系统 - 系统设置",
  };

  document.title = titleMap[pageName] || "IPD项目协作系统";

  // 更新面包屑导航
  const breadcrumbElement = document.getElementById("breadcrumb-content");
  if (breadcrumbElement) {
    const breadcrumbMap = {
      overview: "项目概览",
      "project-detail": currentProject
        ? `项目概览 > ${currentProject.name}`
        : "项目详情",
      stages: currentProject
        ? `项目概览 > ${currentProject.name} > 阶段管理`
        : "阶段管理",
      team: "团队协作",
      dcp: "DCP评审管理",
      deliverables: "交付物管理",
      dashboard: "项目仪表板",
      users: "用户管理",
      settings: "系统设置",
    };
    breadcrumbElement.textContent =
      breadcrumbMap[pageName] || "IPD项目协作系统";
  }
}

// 渲染项目列表
function renderProjectsList() {
  const container = document.getElementById("projects-list");
  if (!container) {
    console.error("找不到projects-list容器");
    return;
  }

  if (!projects || projects.length === 0) {
    container.innerHTML = `
      <div class="empty-state" style="text-align: center; padding: 40px;">
        <div class="empty-state-icon" style="font-size: 3em; margin-bottom: 20px;">📋</div>
        <div class="empty-state-text" style="font-size: 1.2em; color: #666; margin-bottom: 20px;">暂无项目</div>
        <button onclick="createProject()" class="btn-primary">创建第一个项目</button>
      </div>
    `;
    return;
  }

  container.innerHTML = "";

  projects.forEach((project) => {
    const projectCard = document.createElement("div");
    projectCard.className = "project-card";
    projectCard.style.cssText = `
      background: white;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      margin-bottom: 20px;
    `;

    const overallProgress = calculateOverallProgress(project);

    projectCard.innerHTML = `
      <div class="project-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
        <h3 style="margin: 0; color: #333;">${project.name}</h3>
        <span class="project-status ${
          project.status
        }" style="padding: 4px 12px; border-radius: 12px; font-size: 0.8em; background: ${getStatusColor(
      project.status
    )}; color: white;">
          ${getStatusText(project.status)}
        </span>
      </div>
      <p class="project-description" style="color: #666; margin-bottom: 15px;">${
        project.description
      }</p>
      <div class="project-progress" style="margin-bottom: 15px;">
        <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
          <span style="color: #666;">整体进度</span>
          <span style="color: #333; font-weight: bold;">${overallProgress}%</span>
        </div>
        <div class="progress-bar" style="background: #f0f0f0; height: 8px; border-radius: 4px; overflow: hidden;">
          <div class="progress-fill" style="background: #3498db; height: 100%; width: ${overallProgress}%; transition: width 0.3s ease;"></div>
        </div>
      </div>
      <div class="project-info" style="margin-bottom: 15px;">
        <small style="color: #666;">当前阶段: ${getStageText(
          project.currentStage
        )}</small><br>
        <small style="color: #666;">更新时间: ${formatDate(
          project.updatedAt
        )}</small>
      </div>
      <div class="project-actions" style="display: flex; gap: 10px;">
        <button onclick="viewProject('${
          project.id
        }')" class="btn-secondary" style="padding: 8px 16px; border: 1px solid #3498db; color: #3498db; background: white; border-radius: 4px; cursor: pointer;">查看详情</button>
        <button onclick="editProject('${
          project.id
        }')" class="btn-primary" style="padding: 8px 16px; background: #3498db; color: white; border: none; border-radius: 4px; cursor: pointer;">编辑</button>
        <button onclick="deleteProject('${
          project.id
        }')" class="btn-danger" style="padding: 8px 16px; background: #e74c3c; color: white; border: none; border-radius: 4px; cursor: pointer;">删除</button>
      </div>
    `;
    container.appendChild(projectCard);
  });
}

// 渲染交付物列表
function renderDeliverablesList() {
  const container = document.getElementById("deliverables-list");
  if (!container) {
    console.error("找不到deliverables-list容器");
    return;
  }

  if (!deliverables || deliverables.length === 0) {
    container.innerHTML = `
      <div class="empty-state" style="text-align: center; padding: 40px;">
        <div class="empty-state-icon" style="font-size: 3em; margin-bottom: 20px;">📁</div>
        <div class="empty-state-text" style="font-size: 1.2em; color: #666; margin-bottom: 20px;">暂无交付物</div>
        <button onclick="uploadDeliverable()" class="btn-primary">上传第一个交付物</button>
      </div>
    `;
    return;
  }

  container.innerHTML = `
    <div class="deliverables-header" style="margin-bottom: 20px;">
      <div class="deliverables-stats" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin-bottom: 20px;">
        <div class="stat-card" style="background: white; padding: 15px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); text-align: center;">
          <div class="stat-number" style="font-size: 2em; font-weight: bold; color: #3498db;">${
            deliverables.length
          }</div>
          <div class="stat-label" style="color: #666;">总交付物</div>
        </div>
        <div class="stat-card" style="background: white; padding: 15px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); text-align: center;">
          <div class="stat-number" style="font-size: 2em; font-weight: bold; color: #2ecc71;">${
            deliverables.filter((d) => d.approvalStatus === "approved").length
          }</div>
          <div class="stat-label" style="color: #666;">已审批</div>
        </div>
        <div class="stat-card" style="background: white; padding: 15px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); text-align: center;">
          <div class="stat-number" style="font-size: 2em; font-weight: bold; color: #f39c12;">${
            deliverables.filter((d) => d.approvalStatus === "pending").length
          }</div>
          <div class="stat-label" style="color: #666;">待审批</div>
        </div>
        <div class="stat-card" style="background: white; padding: 15px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); text-align: center;">
          <div class="stat-number" style="font-size: 2em; font-weight: bold; color: #9b59b6;">${
            deliverables.filter((d) => d.type === "document").length
          }</div>
          <div class="stat-label" style="color: #666;">文档类型</div>
        </div>
      </div>
    </div>

    <div class="deliverables-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(350px, 1fr)); gap: 20px;">
      ${deliverables
        .map((deliverable) => {
          const project = projects.find((p) => p.id === deliverable.projectId);
          return `
          <div class="deliverable-card" style="background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <div class="deliverable-header" style="display: flex; align-items: center; margin-bottom: 15px;">
              <div class="deliverable-icon" style="font-size: 2em; margin-right: 15px;">${getDeliverableIcon(
                deliverable.type
              )}</div>
              <div>
                <h4 style="margin: 0; color: #333;">${deliverable.name}</h4>
                <p style="margin: 5px 0 0 0; color: #666; font-size: 0.9em;">${
                  project ? project.name : "未知项目"
                }</p>
              </div>
            </div>
            <p style="color: #666; margin-bottom: 15px; font-size: 0.9em;">${
              deliverable.description
            }</p>
            <div class="deliverable-meta" style="margin-bottom: 15px;">
              <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                <span style="color: #666;">文件大小:</span>
                <span style="color: #333;">${deliverable.fileSize}</span>
              </div>
              <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                <span style="color: #666;">版本:</span>
                <span style="color: #333;">v${deliverable.version}</span>
              </div>
              <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                <span style="color: #666;">状态:</span>
                <span style="color: ${getApprovalStatusColor(
                  deliverable.approvalStatus
                )};">${getApprovalStatusText(deliverable.approvalStatus)}</span>
              </div>
            </div>
            <div class="deliverable-actions" style="display: flex; gap: 10px;">
              <button onclick="viewDeliverable('${
                deliverable.id
              }')" style="padding: 6px 12px; border: 1px solid #3498db; color: #3498db; background: white; border-radius: 4px; cursor: pointer;">查看</button>
              <button onclick="downloadDeliverable('${
                deliverable.id
              }')" style="padding: 6px 12px; background: #2ecc71; color: white; border: none; border-radius: 4px; cursor: pointer;">下载</button>
            </div>
          </div>
        `;
        })
        .join("")}
    </div>
  `;
}

// 工具函数
function calculateOverallProgress(project) {
  if (!project || !project.stages) return 0;
  const stages = Object.values(project.stages);
  if (stages.length === 0) return 0;
  const totalProgress = stages.reduce(
    (sum, stage) => sum + (stage.progress || 0),
    0
  );
  return Math.round(totalProgress / stages.length);
}

function getStatusText(status) {
  const statusMap = {
    not_started: "未开始",
    in_progress: "进行中",
    completed: "已完成",
    blocked: "已阻塞",
    cancelled: "已取消",
    planning: "规划中",
  };
  return statusMap[status] || status;
}

function getStatusColor(status) {
  const colorMap = {
    not_started: "#95a5a6",
    in_progress: "#3498db",
    completed: "#2ecc71",
    blocked: "#e74c3c",
    cancelled: "#95a5a6",
    planning: "#f39c12",
  };
  return colorMap[status] || "#95a5a6";
}

function getStageText(stage) {
  const stageMap = {
    concept: "概念阶段",
    plan: "计划阶段",
    develop: "开发阶段",
    verify: "验证阶段",
    release: "发布阶段",
    lifecycle: "生命周期阶段",
  };
  return stageMap[stage] || stage;
}

function formatDate(dateString) {
  if (!dateString) return "未设置";
  try {
    const date = new Date(dateString);
    return (
      date.toLocaleDateString("zh-CN") +
      " " +
      date.toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" })
    );
  } catch (error) {
    return "日期格式错误";
  }
}

function getDeliverableIcon(type) {
  const iconMap = {
    document: "📄",
    design: "🎨",
    code: "💻",
    test: "🧪",
    other: "📎",
  };
  return iconMap[type] || "📎";
}

function getApprovalStatusText(status) {
  const statusMap = {
    approved: "已审批",
    pending: "待审批",
    revision_required: "需修改",
    rejected: "已拒绝",
  };
  return statusMap[status] || status;
}

function getApprovalStatusColor(status) {
  const colorMap = {
    approved: "#2ecc71",
    pending: "#f39c12",
    revision_required: "#e67e22",
    rejected: "#e74c3c",
  };
  return colorMap[status] || "#95a5a6";
}

// 项目操作函数
function viewProject(projectId) {
  const project = projects.find((p) => p.id === projectId);
  if (project) {
    currentProject = project;
    showPage("project-detail");
  }
}

function createProject() {
  alert("创建项目功能开发中...");
}

function editProject(projectId) {
  alert(`编辑项目功能开发中... 项目ID: ${projectId}`);
}

function deleteProject(projectId) {
  if (confirm("确定要删除这个项目吗？")) {
    alert(`删除项目功能开发中... 项目ID: ${projectId}`);
  }
}

// 交付物操作函数
function viewDeliverable(deliverableId) {
  alert(`查看交付物功能开发中... 交付物ID: ${deliverableId}`);
}

function downloadDeliverable(deliverableId) {
  alert(`下载交付物功能开发中... 交付物ID: ${deliverableId}`);
}

function uploadDeliverable() {
  alert("上传交付物功能开发中...");
}

// 渲染项目详情
function renderProjectDetail() {
  const titleElement = document.getElementById("project-detail-title");
  const contentElement = document.getElementById("project-detail-content");

  if (!currentProject || !titleElement || !contentElement) {
    if (contentElement) {
      contentElement.innerHTML = `
        <div class="empty-state" style="text-align: center; padding: 40px;">
          <div class="empty-state-icon" style="font-size: 3em; margin-bottom: 20px;">📋</div>
          <div class="empty-state-text" style="font-size: 1.2em; color: #666; margin-bottom: 20px;">项目不存在</div>
          <button onclick="goBack()" class="btn-primary">返回项目列表</button>
        </div>
      `;
    }
    return;
  }

  titleElement.textContent = currentProject.name;
  const overallProgress = calculateOverallProgress(currentProject);

  contentElement.innerHTML = `
    <div class="project-detail-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px;">
      <div class="detail-card" style="background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
        <h3 style="margin-top: 0; color: #333;">基本信息</h3>
        <div class="info-list">
          <div style="margin-bottom: 10px;"><strong>项目名称:</strong> ${
            currentProject.name
          }</div>
          <div style="margin-bottom: 10px;"><strong>项目描述:</strong> ${
            currentProject.description
          }</div>
          <div style="margin-bottom: 10px;"><strong>项目状态:</strong> <span style="color: ${getStatusColor(
            currentProject.status
          )};">${getStatusText(currentProject.status)}</span></div>
          <div style="margin-bottom: 10px;"><strong>当前阶段:</strong> ${getStageText(
            currentProject.currentStage
          )}</div>
          <div style="margin-bottom: 10px;"><strong>整体进度:</strong> ${overallProgress}%</div>
          <div style="margin-bottom: 10px;"><strong>创建时间:</strong> ${formatDate(
            currentProject.createdAt
          )}</div>
          <div style="margin-bottom: 10px;"><strong>更新时间:</strong> ${formatDate(
            currentProject.updatedAt
          )}</div>
        </div>
      </div>
      
      <div class="detail-card" style="background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
        <h3 style="margin-top: 0; color: #333;">项目进度</h3>
        <div class="progress-container" style="margin-bottom: 20px;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
            <span>整体进度</span>
            <span style="font-weight: bold;">${overallProgress}%</span>
          </div>
          <div class="progress-bar" style="background: #f0f0f0; height: 20px; border-radius: 10px; overflow: hidden;">
            <div class="progress-fill" style="background: #3498db; height: 100%; width: ${overallProgress}%; transition: width 0.3s ease;"></div>
          </div>
        </div>
        <div class="stages-summary">
          ${Object.entries(currentProject.stages || {})
            .map(
              ([key, stage]) => `
            <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
              <span>${stage.name}</span>
              <span style="color: ${
                stage.status === "completed"
                  ? "#2ecc71"
                  : stage.status === "in_progress"
                  ? "#3498db"
                  : "#95a5a6"
              };">
                ${stage.progress || 0}%
              </span>
            </div>
          `
            )
            .join("")}
        </div>
      </div>
    </div>
  `;
}

// 返回函数
function goBack() {
  currentProject = null;
  showPage("overview");
}

// 模态框操作
function showModal(content) {
  const modal = document.getElementById("modal");
  const modalBody = document.getElementById("modal-body");
  if (modal && modalBody) {
    modalBody.innerHTML = content;
    modal.style.display = "block";
  }
}

function closeModal() {
  const modal = document.getElementById("modal");
  if (modal) {
    modal.style.display = "none";
  }
}

// 错误消息显示
function showErrorMessage(message) {
  const errorDiv = document.createElement("div");
  errorDiv.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: #e74c3c;
    color: white;
    padding: 15px;
    border-radius: 4px;
    z-index: 9999;
    max-width: 300px;
  `;
  errorDiv.textContent = message;
  document.body.appendChild(errorDiv);

  setTimeout(() => {
    if (document.body.contains(errorDiv)) {
      document.body.removeChild(errorDiv);
    }
  }, 5000);
}

// 默认数据（当API加载失败时使用）
function getDefaultProjects() {
  return [
    {
      id: "proj_001",
      name: "智能手机产品开发",
      description: "新一代智能手机产品研发项目",
      status: "in_progress",
      currentStage: "develop",
      createdAt: "2024-01-15T08:00:00Z",
      updatedAt: "2024-02-01T10:30:00Z",
      stages: {
        concept: { name: "概念阶段", status: "completed", progress: 100 },
        plan: { name: "计划阶段", status: "completed", progress: 100 },
        develop: { name: "开发阶段", status: "in_progress", progress: 65 },
        verify: { name: "验证阶段", status: "not_started", progress: 0 },
        release: { name: "发布阶段", status: "not_started", progress: 0 },
        lifecycle: { name: "生命周期阶段", status: "not_started", progress: 0 },
      },
    },
  ];
}

function getDefaultUsers() {
  return [
    {
      id: "user_001",
      name: "张明",
      email: "zhangming@company.com",
      role: "project_manager",
      department: "产品研发部",
      function: "项目管理",
    },
  ];
}

function getDefaultDCPReviews() {
  return [];
}

function getDefaultDeliverables() {
  return [];
}

function getDefaultTasks() {
  return [];
}

// 点击模态框外部关闭
window.onclick = function (event) {
  const modal = document.getElementById("modal");
  if (event.target === modal) {
    modal.style.display = "none";
  }
};

console.log("IPD系统主应用已加载");
