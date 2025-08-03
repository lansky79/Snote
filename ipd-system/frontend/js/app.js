// 全局状态
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
  await loadInitialData();
  showPage("overview");
  console.log("系统初始化完成");
});

// 加载初始数据
async function loadInitialData() {
  try {
    console.log("正在加载数据...");

    // 并行加载所有数据
    const [projectsData, usersData, dcpData, deliverablesData, tasksData] =
      await Promise.all([
        api.getProjects().catch((err) => {
          console.warn("加载项目数据失败:", err);
          return [];
        }),
        api.getUsers().catch((err) => {
          console.warn("加载用户数据失败:", err);
          return [];
        }),
        api.getDCPReviews().catch((err) => {
          console.warn("加载DCP数据失败:", err);
          return [];
        }),
        api.getDeliverables().catch((err) => {
          console.warn("加载交付物数据失败:", err);
          return [];
        }),
        api.getTasks().catch((err) => {
          console.warn("加载任务数据失败:", err);
          return [];
        }),
      ]);

    projects = projectsData;
    users = usersData;
    dcpReviews = dcpData;
    deliverables = deliverablesData;
    tasks = tasksData;

    console.log("数据加载完成:", {
      projects: projects.length,
      users: users.length,
      dcpReviews: dcpReviews.length,
      deliverables: deliverables.length,
      tasks: tasks.length,
    });
  } catch (error) {
    console.error("初始数据加载失败:", error);
    api.showError("数据加载失败，请检查服务器连接");
  }
}

// 页面切换
function showPage(pageName) {
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
    switch (pageName) {
      case "overview":
        renderProjectsList();
        break;
      case "project-detail":
        renderProjectDetail();
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
      case "deliverables":
        renderDeliverablesList();
        break;
      case "dashboard":
        renderDashboard();
        break;
      case "users":
        renderUsersList();
        break;
      case "settings":
        renderSettings();
        break;
    }
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
  updateBreadcrumb(pageName);
}

// 更新面包屑导航
function updateBreadcrumb(pageName) {
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

  const breadcrumbElement = document.getElementById("breadcrumb-content");
  if (breadcrumbElement) {
    breadcrumbElement.textContent =
      breadcrumbMap[pageName] || "IPD项目协作系统";
  }
}

// 工具函数
function calculateOverallProgress(project) {
  if (!project.stages) return 0;
  const stages = Object.values(project.stages);
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
  };
  return statusMap[status] || status;
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
  const date = new Date(dateString);
  return (
    date.toLocaleDateString("zh-CN") +
    " " +
    date.toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" })
  );
}

function getDeliverableTypeText(type) {
  const typeMap = {
    document: "文档",
    design: "设计",
    code: "代码",
    test: "测试",
    other: "其他",
  };
  return typeMap[type] || type;
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

function goBack() {
  currentProject = null;
  showPage("overview");
}

// ==================== 项目管理相关函数 ====================

// 渲染项目列表
function renderProjectsList() {
  const container = document.getElementById("projects-list");
  if (!container) return;

  if (projects.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">📋</div>
        <div class="empty-state-text">暂无项目</div>
        <button onclick="createProject()" class="btn-primary empty-state-action">创建第一个项目</button>
      </div>
    `;
    return;
  }

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
        <span class="progress-text">${calculateOverallProgress(project)}%</span>
      </div>
      <div class="project-info">
        <small>当前阶段: ${getStageText(project.currentStage)}</small><br>
        <small>更新时间: ${formatDate(project.updatedAt)}</small>
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

// 项目操作函数
async function createProject() {
  const modalContent = `
    <h2>新建项目</h2>
    <form id="create-project-form" onsubmit="handleCreateProject(event)">
      <div class="form-group">
        <label for="project-name">项目名称 *</label>
        <input type="text" id="project-name" name="name" required maxlength="100" placeholder="请输入项目名称">
      </div>
      <div class="form-group">
        <label for="project-description">项目描述 *</label>
        <textarea id="project-description" name="description" required maxlength="500" placeholder="请输入项目描述"></textarea>
      </div>
      <div class="form-group">
        <label for="team-leader">项目负责人</label>
        <select id="team-leader" name="teamLeader">
          <option value="">请选择项目负责人</option>
          ${users
            .filter((u) => u.role === "project_manager" || u.role === "admin")
            .map(
              (user) =>
                `<option value="${user.id}">${user.name} - ${user.department}</option>`
            )
            .join("")}
        </select>
      </div>
      <div class="form-actions">
        <button type="button" onclick="closeModal()" class="btn-secondary">取消</button>
        <button type="submit" class="btn-primary">创建项目</button>
      </div>
    </form>
  `;

  showModal(modalContent);
}

async function handleCreateProject(event) {
  event.preventDefault();

  const formData = new FormData(event.target);
  const projectData = {
    name: formData.get("name").trim(),
    description: formData.get("description").trim(),
    teamLeader: formData.get("teamLeader") || null,
  };

  if (!projectData.name || !projectData.description) {
    api.showError("项目名称和描述不能为空");
    return;
  }

  try {
    const newProject = await api.createProject(projectData);
    projects.push(newProject);
    renderProjectsList();
    closeModal();
    api.showSuccess("项目创建成功");
  } catch (error) {
    console.error("创建项目失败:", error);
  }
}

async function editProject(projectId) {
  const project = projects.find((p) => p.id === projectId);
  if (!project) return;

  const modalContent = `
    <h2>编辑项目</h2>
    <form id="edit-project-form" onsubmit="handleEditProject(event, '${projectId}')">
      <div class="form-group">
        <label for="edit-project-name">项目名称 *</label>
        <input type="text" id="edit-project-name" name="name" required maxlength="100" 
               value="${project.name}" placeholder="请输入项目名称">
      </div>
      <div class="form-group">
        <label for="edit-project-description">项目描述 *</label>
        <textarea id="edit-project-description" name="description" required maxlength="500" 
                  placeholder="请输入项目描述">${project.description}</textarea>
      </div>
      <div class="form-group">
        <label for="edit-team-leader">项目负责人</label>
        <select id="edit-team-leader" name="teamLeader">
          <option value="">请选择项目负责人</option>
          ${users
            .filter((u) => u.role === "project_manager" || u.role === "admin")
            .map(
              (user) =>
                `<option value="${user.id}" ${
                  project.teamLeader === user.id ? "selected" : ""
                }>
              ${user.name} - ${user.department}
            </option>`
            )
            .join("")}
        </select>
      </div>
      <div class="form-group">
        <label for="edit-project-status">项目状态</label>
        <select id="edit-project-status" name="status">
          <option value="not_started" ${
            project.status === "not_started" ? "selected" : ""
          }>未开始</option>
          <option value="in_progress" ${
            project.status === "in_progress" ? "selected" : ""
          }>进行中</option>
          <option value="completed" ${
            project.status === "completed" ? "selected" : ""
          }>已完成</option>
          <option value="blocked" ${
            project.status === "blocked" ? "selected" : ""
          }>已阻塞</option>
        </select>
      </div>
      <div class="form-actions">
        <button type="button" onclick="closeModal()" class="btn-secondary">取消</button>
        <button type="submit" class="btn-primary">保存更改</button>
      </div>
    </form>
  `;

  showModal(modalContent);
}

async function handleEditProject(event, projectId) {
  event.preventDefault();

  const formData = new FormData(event.target);
  const projectData = {
    name: formData.get("name").trim(),
    description: formData.get("description").trim(),
    teamLeader: formData.get("teamLeader") || null,
    status: formData.get("status"),
  };

  if (!projectData.name || !projectData.description) {
    api.showError("项目名称和描述不能为空");
    return;
  }

  try {
    const updatedProject = await api.updateProject(projectId, projectData);
    const index = projects.findIndex((p) => p.id === projectId);
    projects[index] = updatedProject;

    // 如果当前正在查看这个项目的详情，更新当前项目数据
    if (currentProject && currentProject.id === projectId) {
      currentProject = updatedProject;
      if (currentPage === "project-detail") {
        renderProjectDetail();
      }
    }

    renderProjectsList();
    closeModal();
    api.showSuccess("项目更新成功");
  } catch (error) {
    console.error("更新项目失败:", error);
  }
}

async function deleteProject(projectId) {
  const project = projects.find((p) => p.id === projectId);
  if (!project) return;

  const modalContent = `
    <h2>删除项目</h2>
    <div class="delete-confirmation">
      <div class="warning-icon">⚠️</div>
      <p>确定要删除项目 <strong>"${project.name}"</strong> 吗？</p>
      <p class="warning-text">此操作不可撤销，将同时删除项目相关的所有数据。</p>
      <div class="project-info-summary">
        <div class="info-item">
          <span class="label">项目描述:</span>
          <span class="value">${project.description}</span>
        </div>
        <div class="info-item">
          <span class="label">创建时间:</span>
          <span class="value">${formatDate(project.createdAt)}</span>
        </div>
      </div>
    </div>
    <div class="form-actions">
      <button type="button" onclick="closeModal()" class="btn-secondary">取消</button>
      <button type="button" onclick="confirmDeleteProject('${projectId}')" class="btn-danger">确认删除</button>
    </div>
  `;

  showModal(modalContent);
}

async function confirmDeleteProject(projectId) {
  try {
    await api.deleteProject(projectId);
    projects = projects.filter((p) => p.id !== projectId);

    // 如果当前正在查看被删除的项目，返回项目列表
    if (currentProject && currentProject.id === projectId) {
      currentProject = null;
      showPage("overview");
    } else {
      renderProjectsList();
    }

    closeModal();
    api.showSuccess("项目删除成功");
  } catch (error) {
    console.error("删除项目失败:", error);
  }
}

function viewProject(projectId) {
  currentProject = projects.find((p) => p.id === projectId);
  if (currentProject) {
    showPage("project-detail");
  }
}

// 渲染项目详情页面
function renderProjectDetail() {
  const titleElement = document.getElementById("project-detail-title");
  const contentElement = document.getElementById("project-detail-content");

  if (!currentProject || !titleElement || !contentElement) {
    if (contentElement) {
      contentElement.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">📋</div>
          <div class="empty-state-text">项目不存在</div>
          <button onclick="goBack()" class="btn-primary empty-state-action">返回项目列表</button>
        </div>
      `;
    }
    return;
  }

  titleElement.textContent = currentProject.name;

  const overallProgress = calculateOverallProgress(currentProject);
  const teamMembers = users.filter(
    (user) => user.projects && user.projects.includes(currentProject.id)
  );
  const projectTasks = tasks.filter(
    (task) => task.projectId === currentProject.id
  );
  const projectDeliverables = deliverables.filter(
    (d) => d.projectId === currentProject.id
  );
  const projectDCPReviews = dcpReviews.filter(
    (r) => r.projectId === currentProject.id
  );

  contentElement.innerHTML = `
    <div class="project-detail-grid">
      <!-- 基本信息卡片 -->
      <div class="detail-card">
        <div class="card-header">
          <h3>基本信息</h3>
        </div>
        <div class="card-content">
          <div class="info-row">
            <span class="info-label">项目名称:</span>
            <span class="info-value">${currentProject.name}</span>
          </div>
          <div class="info-row">
            <span class="info-label">项目描述:</span>
            <span class="info-value">${currentProject.description}</span>
          </div>
          <div class="info-row">
            <span class="info-label">项目状态:</span>
            <span class="project-status ${
              currentProject.status
            }">${getStatusText(currentProject.status)}</span>
          </div>
          <div class="info-row">
            <span class="info-label">当前阶段:</span>
            <span class="info-value">${getStageText(
              currentProject.currentStage
            )}</span>
          </div>
          <div class="info-row">
            <span class="info-label">整体进度:</span>
            <div class="progress-container">
              <div class="progress-bar">
                <div class="progress-fill" style="width: ${overallProgress}%"></div>
              </div>
              <span class="progress-text">${overallProgress}%</span>
            </div>
          </div>
          <div class="info-row">
            <span class="info-label">创建时间:</span>
            <span class="info-value">${formatDate(
              currentProject.createdAt
            )}</span>
          </div>
          <div class="info-row">
            <span class="info-label">更新时间:</span>
            <span class="info-value">${formatDate(
              currentProject.updatedAt
            )}</span>
          </div>
        </div>
      </div>

      <!-- 团队成员卡片 -->
      <div class="detail-card">
        <div class="card-header">
          <h3>团队成员 (${teamMembers.length}人)</h3>
          <button onclick="manageProjectTeam()" class="btn-secondary btn-sm">管理团队</button>
        </div>
        <div class="card-content">
          ${
            teamMembers.length > 0
              ? teamMembers
                  .map(
                    (member) => `
                <div class="team-member-item">
                  <div class="member-avatar">${member.name.charAt(0)}</div>
                  <div class="member-info">
                    <div class="member-name">${member.name}</div>
                    <div class="member-role">${member.function} - ${
                      member.department
                    }</div>
                  </div>
                </div>
              `
                  )
                  .join("")
              : '<div class="empty-text">暂无团队成员</div>'
          }
        </div>
      </div>

      <!-- 任务统计卡片 -->
      <div class="detail-card">
        <div class="card-header">
          <h3>任务统计</h3>
          <button onclick="viewProjectTasks()" class="btn-secondary btn-sm">查看任务</button>
        </div>
        <div class="card-content">
          <div class="stats-grid">
            <div class="stat-item">
              <div class="stat-number">${projectTasks.length}</div>
              <div class="stat-label">总任务数</div>
            </div>
            <div class="stat-item">
              <div class="stat-number">${
                projectTasks.filter((t) => t.status === "completed").length
              }</div>
              <div class="stat-label">已完成</div>
            </div>
            <div class="stat-item">
              <div class="stat-number">${
                projectTasks.filter((t) => t.status === "in_progress").length
              }</div>
              <div class="stat-label">进行中</div>
            </div>
            <div class="stat-item">
              <div class="stat-number">${
                projectTasks.filter((t) => t.status === "not_started").length
              }</div>
              <div class="stat-label">未开始</div>
            </div>
          </div>
        </div>
      </div>

      <!-- 六阶段进度卡片 -->
      <div class="detail-card full-width">
        <div class="card-header">
          <h3>六阶段进度</h3>
          <button onclick="viewProjectStages()" class="btn-secondary btn-sm">详细管理</button>
        </div>
        <div class="card-content">
          <div class="stages-progress">
            ${Object.entries(currentProject.stages || {})
              .map(
                ([stageKey, stage]) => `
                <div class="stage-progress-item">
                  <div class="stage-info">
                    <div class="stage-name">${stage.name}</div>
                    <div class="stage-status ${stage.status}">${getStatusText(
                  stage.status
                )}</div>
                  </div>
                  <div class="stage-progress-bar">
                    <div class="progress-bar">
                      <div class="progress-fill" style="width: ${
                        stage.progress || 0
                      }%"></div>
                    </div>
                    <span class="progress-text">${stage.progress || 0}%</span>
                  </div>
                </div>
            `
              )
              .join("")}
          </div>
        </div>
      </div>
    </div>
  `;
}

// 项目详情页面的辅助函数
function editCurrentProject() {
  if (currentProject) {
    editProject(currentProject.id);
  }
}

function viewProjectStages() {
  if (currentProject) {
    showPage("stages");
  }
}

function manageProjectTeam() {
  api.showError("团队管理功能开发中");
}

function viewProjectTasks() {
  api.showError("任务查看功能开发中");
}

function viewProjectDeliverables() {
  api.showError("交付物查看功能开发中");
}

function viewProjectDCPReviews() {
  api.showError("DCP评审查看功能开发中");
}

// ==================== 交付物管理相关函数 ====================

// 渲染交付物列表
function renderDeliverablesList() {
  const container = document.getElementById("deliverables-list");
  if (!container) return;

  if (deliverables.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">📁</div>
        <div class="empty-state-text">暂无交付物</div>
        <button onclick="uploadDeliverable()" class="btn-primary empty-state-action">上传第一个交付物</button>
      </div>
    `;
    return;
  }

  // 按项目和阶段分组显示交付物
  const groupedDeliverables = {};
  deliverables.forEach((deliverable) => {
    const project = projects.find((p) => p.id === deliverable.projectId);
    const projectName = project ? project.name : "未知项目";
    const stageText = getStageText(deliverable.stage);

    const key = `${projectName} - ${stageText}`;
    if (!groupedDeliverables[key]) {
      groupedDeliverables[key] = [];
    }
    groupedDeliverables[key].push(deliverable);
  });

  container.innerHTML = `
    <div class="deliverables-header">
      <div class="deliverables-stats">
        <div class="stat-item">
          <span class="stat-number">${deliverables.length}</span>
          <span class="stat-label">总交付物</span>
        </div>
        <div class="stat-item">
          <span class="stat-number">${
            new Set(deliverables.map((d) => d.projectId)).size
          }</span>
          <span class="stat-label">涉及项目</span>
        </div>
        <div class="stat-item">
          <span class="stat-number">${
            deliverables.filter((d) => d.type === "document").length
          }</span>
          <span class="stat-label">文档类型</span>
        </div>
        <div class="stat-item">
          <span class="stat-number">${
            deliverables.filter((d) => d.type === "design").length
          }</span>
          <span class="stat-label">设计类型</span>
        </div>
      </div>
      
      <div class="deliverables-filters">
        <select id="project-filter" onchange="filterDeliverables()">
          <option value="">所有项目</option>
          ${projects
            .map((p) => `<option value="${p.id}">${p.name}</option>`)
            .join("")}
        </select>
        <select id="stage-filter" onchange="filterDeliverables()">
          <option value="">所有阶段</option>
          <option value="concept">概念阶段</option>
          <option value="plan">计划阶段</option>
          <option value="develop">开发阶段</option>
          <option value="verify">验证阶段</option>
          <option value="release">发布阶段</option>
          <option value="lifecycle">生命周期阶段</option>
        </select>
        <select id="type-filter" onchange="filterDeliverables()">
          <option value="">所有类型</option>
          <option value="document">文档</option>
          <option value="design">设计</option>
          <option value="code">代码</option>
          <option value="test">测试</option>
          <option value="other">其他</option>
        </select>
      </div>
    </div>

    <div class="deliverables-groups">
      ${Object.entries(groupedDeliverables)
        .map(
          ([groupName, groupDeliverables]) => `
        <div class="deliverable-group">
          <div class="group-header">
            <h3>${groupName}</h3>
            <span class="group-count">${
              groupDeliverables.length
            } 个交付物</span>
          </div>
          <div class="deliverables-grid">
            ${groupDeliverables
              .map(
                (deliverable) => `
              <div class="deliverable-card" data-project="${
                deliverable.projectId
              }" data-stage="${deliverable.stage}" data-type="${
                  deliverable.type
                }">
                <div class="deliverable-header">
                  <div class="deliverable-icon">
                    ${getDeliverableIcon(deliverable.type)}
                  </div>
                  <div class="deliverable-type">${getDeliverableTypeText(
                    deliverable.type
                  )}</div>
                </div>
                <div class="deliverable-content">
                  <h4 class="deliverable-name">${deliverable.name}</h4>
                  <p class="deliverable-description">${
                    deliverable.description
                  }</p>
                  <div class="deliverable-meta">
                    <div class="meta-item">
                      <span class="meta-label">文件名:</span>
                      <span class="meta-value">${deliverable.fileName}</span>
                    </div>
                    <div class="meta-item">
                      <span class="meta-label">大小:</span>
                      <span class="meta-value">${deliverable.fileSize}</span>
                    </div>
                    <div class="meta-item">
                      <span class="meta-label">版本:</span>
                      <span class="meta-value">v${deliverable.version}</span>
                    </div>
                    <div class="meta-item">
                      <span class="meta-label">上传者:</span>
                      <span class="meta-value">${
                        users.find((u) => u.id === deliverable.uploadedBy)
                          ?.name || "未知"
                      }</span>
                    </div>
                    <div class="meta-item">
                      <span class="meta-label">上传时间:</span>
                      <span class="meta-value">${formatDate(
                        deliverable.uploadedAt
                      )}</span>
                    </div>
                  </div>
                </div>
                <div class="deliverable-actions">
                  <button onclick="viewDeliverable('${
                    deliverable.id
                  }')" class="btn-secondary btn-sm">查看详情</button>
                  <button onclick="downloadDeliverable('${
                    deliverable.id
                  }')" class="btn-primary btn-sm">下载</button>
                  <button onclick="editDeliverable('${
                    deliverable.id
                  }')" class="btn-secondary btn-sm">编辑</button>
                  <button onclick="approveDeliverable('${
                    deliverable.id
                  }')" class="btn-success btn-sm">审批</button>
                  <button onclick="deleteDeliverable('${
                    deliverable.id
                  }')" class="btn-danger btn-sm">删除</button>
                </div>
              </div>
            `
              )
              .join("")}
          </div>
        </div>
      `
        )
        .join("")}
    </div>
  `;
}

// 获取交付物图标
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

// 筛选交付物
function filterDeliverables() {
  const projectFilter = document.getElementById("project-filter").value;
  const stageFilter = document.getElementById("stage-filter").value;
  const typeFilter = document.getElementById("type-filter").value;

  const cards = document.querySelectorAll(".deliverable-card");

  cards.forEach((card) => {
    const projectId = card.getAttribute("data-project");
    const stage = card.getAttribute("data-stage");
    const type = card.getAttribute("data-type");

    const showProject = !projectFilter || projectId === projectFilter;
    const showStage = !stageFilter || stage === stageFilter;
    const showType = !typeFilter || type === typeFilter;

    if (showProject && showStage && showType) {
      card.style.display = "block";
    } else {
      card.style.display = "none";
    }
  });

  // 隐藏空的分组
  const groups = document.querySelectorAll(".deliverable-group");
  groups.forEach((group) => {
    const visibleCards = group.querySelectorAll(
      '.deliverable-card[style="display: block"], .deliverable-card:not([style])'
    );
    if (visibleCards.length === 0) {
      group.style.display = "none";
    } else {
      group.style.display = "block";
    }
  });
}

// 上传交付物
async function uploadDeliverable() {
  const modalContent = `
    <h2>上传交付物</h2>
    <form id="upload-deliverable-form" onsubmit="handleUploadDeliverable(event)">
      <div class="form-group">
        <label for="deliverable-project">所属项目 *</label>
        <select id="deliverable-project" name="projectId" required onchange="updateStageOptions()">
          <option value="">请选择项目</option>
          ${projects
            .map((p) => `<option value="${p.id}">${p.name}</option>`)
            .join("")}
        </select>
      </div>
      <div class="form-group">
        <label for="deliverable-stage">项目阶段 *</label>
        <select id="deliverable-stage" name="stage" required>
          <option value="">请先选择项目</option>
        </select>
      </div>
      <div class="form-group">
        <label for="deliverable-name">交付物名称 *</label>
        <input type="text" id="deliverable-name" name="name" required maxlength="100" placeholder="请输入交付物名称">
      </div>
      <div class="form-group">
        <label for="deliverable-type">交付物类型 *</label>
        <select id="deliverable-type" name="type" required>
          <option value="">请选择类型</option>
          <option value="document">文档</option>
          <option value="design">设计</option>
          <option value="code">代码</option>
          <option value="test">测试</option>
          <option value="other">其他</option>
        </select>
      </div>
      <div class="form-group">
        <label for="deliverable-description">描述信息 *</label>
        <textarea id="deliverable-description" name="description" required maxlength="500" placeholder="请输入交付物描述"></textarea>
      </div>
      <div class="form-group">
        <label for="deliverable-filename">文件名 *</label>
        <input type="text" id="deliverable-filename" name="fileName" required placeholder="例如: requirements_doc.pdf">
      </div>
      <div class="form-group">
        <label for="deliverable-filesize">文件大小</label>
        <input type="text" id="deliverable-filesize" name="fileSize" placeholder="例如: 2.5MB">
      </div>
      <div class="form-group">
        <label for="deliverable-uploader">上传者</label>
        <select id="deliverable-uploader" name="uploadedBy">
          <option value="">请选择上传者</option>
          ${users
            .map(
              (u) =>
                `<option value="${u.id}">${u.name} - ${u.department}</option>`
            )
            .join("")}
        </select>
      </div>
      <div class="form-actions">
        <button type="button" onclick="closeModal()" class="btn-secondary">取消</button>
        <button type="submit" class="btn-primary">上传交付物</button>
      </div>
    </form>
  `;

  showModal(modalContent);
}

// 更新阶段选项
function updateStageOptions() {
  const projectSelect = document.getElementById("deliverable-project");
  const stageSelect = document.getElementById("deliverable-stage");

  if (!projectSelect || !stageSelect) return;

  const selectedProjectId = projectSelect.value;

  if (!selectedProjectId) {
    stageSelect.innerHTML = '<option value="">请先选择项目</option>';
    return;
  }

  const project = projects.find((p) => p.id === selectedProjectId);
  if (!project) return;

  const stageOptions = [
    { value: "concept", text: "概念阶段" },
    { value: "plan", text: "计划阶段" },
    { value: "develop", text: "开发阶段" },
    { value: "verify", text: "验证阶段" },
    { value: "release", text: "发布阶段" },
    { value: "lifecycle", text: "生命周期阶段" },
  ];

  stageSelect.innerHTML = `
    <option value="">请选择阶段</option>
    ${stageOptions
      .map((stage) => `<option value="${stage.value}">${stage.text}</option>`)
      .join("")}
  `;
}

// 处理上传交付物
async function handleUploadDeliverable(event) {
  event.preventDefault();

  const formData = new FormData(event.target);
  const deliverableData = {
    projectId: formData.get("projectId"),
    stage: formData.get("stage"),
    name: formData.get("name").trim(),
    type: formData.get("type"),
    description: formData.get("description").trim(),
    fileName: formData.get("fileName").trim(),
    fileSize: formData.get("fileSize").trim() || "未知",
    uploadedBy: formData.get("uploadedBy") || users[0]?.id,
  };

  // 验证必填字段
  if (
    !deliverableData.projectId ||
    !deliverableData.stage ||
    !deliverableData.name ||
    !deliverableData.type ||
    !deliverableData.description ||
    !deliverableData.fileName
  ) {
    api.showError("请填写所有必填字段");
    return;
  }

  try {
    const newDeliverable = await api.createDeliverable(deliverableData);
    deliverables.push(newDeliverable);
    renderDeliverablesList();
    closeModal();
    api.showSuccess("交付物上传成功");
  } catch (error) {
    console.error("上传交付物失败:", error);
  }
}

// 查看交付物详情
function viewDeliverable(deliverableId) {
  const deliverable = deliverables.find((d) => d.id === deliverableId);
  if (!deliverable) return;

  const project = projects.find((p) => p.id === deliverable.projectId);
  const uploader = users.find((u) => u.id === deliverable.uploadedBy);

  const modalContent = `
    <h2>交付物详情</h2>
    <div class="deliverable-detail">
      <div class="detail-header">
        <div class="deliverable-icon-large">
          ${getDeliverableIcon(deliverable.type)}
        </div>
        <div class="detail-title">
          <h3>${deliverable.name}</h3>
          <span class="deliverable-type-badge">${getDeliverableTypeText(
            deliverable.type
          )}</span>
        </div>
      </div>
      
      <div class="detail-content">
        <div class="detail-section">
          <h4>基本信息</h4>
          <div class="detail-grid">
            <div class="detail-item">
              <span class="detail-label">所属项目:</span>
              <span class="detail-value">${
                project ? project.name : "未知项目"
              }</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">项目阶段:</span>
              <span class="detail-value">${getStageText(
                deliverable.stage
              )}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">文件名:</span>
              <span class="detail-value">${deliverable.fileName}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">文件大小:</span>
              <span class="detail-value">${deliverable.fileSize}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">版本:</span>
              <span class="detail-value">v${deliverable.version}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">上传者:</span>
              <span class="detail-value">${
                uploader ? uploader.name : "未知"
              }</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">上传时间:</span>
              <span class="detail-value">${formatDate(
                deliverable.uploadedAt
              )}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">更新时间:</span>
              <span class="detail-value">${formatDate(
                deliverable.updatedAt
              )}</span>
            </div>
          </div>
        </div>
        
        <div class="detail-section">
          <h4>描述信息</h4>
          <p class="deliverable-description-full">${deliverable.description}</p>
        </div>
      </div>
    </div>
    
    <div class="form-actions">
      <button type="button" onclick="closeModal()" class="btn-secondary">关闭</button>
      <button type="button" onclick="downloadDeliverable('${
        deliverable.id
      }')" class="btn-primary">下载文件</button>
    </div>
  `;

  showModal(modalContent);
}

// 下载交付物
function downloadDeliverable(deliverableId) {
  const deliverable = deliverables.find((d) => d.id === deliverableId);
  if (!deliverable) return;

  // 模拟下载功能
  api.showSuccess(`正在下载 ${deliverable.fileName}...`);

  // 在实际应用中，这里应该触发真实的文件下载
  console.log("下载交付物:", deliverable);
}

// 查看交付物版本历史
function viewDeliverableHistory(deliverableId) {
  const deliverable = deliverables.find((d) => d.id === deliverableId);
  if (!deliverable) return;

  // 模拟版本历史数据
  const versionHistory = [
    {
      version: deliverable.version,
      uploadedAt: deliverable.updatedAt,
      uploadedBy: deliverable.uploadedBy,
      changes: "当前版本",
    },
  ];

  const modalContent = `
    <h2>版本历史 - ${deliverable.name}</h2>
    <div class="version-history">
      <div class="version-list">
        ${versionHistory
          .map(
            (version) => `
          <div class="version-item">
            <div class="version-header">
              <span class="version-number">v${version.version}</span>
              <span class="version-date">${formatDate(
                version.uploadedAt
              )}</span>
            </div>
            <div class="version-info">
              <div class="version-uploader">
                上传者: ${
                  users.find((u) => u.id === version.uploadedBy)?.name || "未知"
                }
              </div>
              <div class="version-changes">${version.changes}</div>
            </div>
            <div class="version-actions">
              <button class="btn-secondary btn-sm">下载此版本</button>
              ${
                version.version === deliverable.version
                  ? '<span class="current-version">当前版本</span>'
                  : ""
              }
            </div>
          </div>
        `
          )
          .join("")}
      </div>
    </div>
    
    <div class="form-actions">
      <button type="button" onclick="closeModal()" class="btn-secondary">关闭</button>
    </div>
  `;

  showModal(modalContent);
}

// 编辑交付物
async function editDeliverable(deliverableId) {
  const deliverable = deliverables.find((d) => d.id === deliverableId);
  if (!deliverable) return;

  const modalContent = `
    <h2>编辑交付物</h2>
    <form id="edit-deliverable-form" onsubmit="handleEditDeliverable(event, '${deliverableId}')">
      <div class="form-group">
        <label for="edit-deliverable-name">交付物名称 *</label>
        <input type="text" id="edit-deliverable-name" name="name" required maxlength="100" 
               value="${deliverable.name}" placeholder="请输入交付物名称">
      </div>
      <div class="form-group">
        <label for="edit-deliverable-type">交付物类型 *</label>
        <select id="edit-deliverable-type" name="type" required>
          <option value="document" ${
            deliverable.type === "document" ? "selected" : ""
          }>文档</option>
          <option value="design" ${
            deliverable.type === "design" ? "selected" : ""
          }>设计</option>
          <option value="code" ${
            deliverable.type === "code" ? "selected" : ""
          }>代码</option>
          <option value="test" ${
            deliverable.type === "test" ? "selected" : ""
          }>测试</option>
          <option value="other" ${
            deliverable.type === "other" ? "selected" : ""
          }>其他</option>
        </select>
      </div>
      <div class="form-group">
        <label for="edit-deliverable-description">描述信息 *</label>
        <textarea id="edit-deliverable-description" name="description" required maxlength="500" 
                  placeholder="请输入交付物描述">${
                    deliverable.description
                  }</textarea>
      </div>
      <div class="form-group">
        <label for="edit-deliverable-filename">文件名 *</label>
        <input type="text" id="edit-deliverable-filename" name="fileName" required 
               value="${
                 deliverable.fileName
               }" placeholder="例如: requirements_doc.pdf">
      </div>
      <div class="form-group">
        <label for="edit-deliverable-filesize">文件大小</label>
        <input type="text" id="edit-deliverable-filesize" name="fileSize" 
               value="${deliverable.fileSize}" placeholder="例如: 2.5MB">
      </div>
      <div class="form-actions">
        <button type="button" onclick="closeModal()" class="btn-secondary">取消</button>
        <button type="submit" class="btn-primary">保存更改</button>
      </div>
    </form>
  `;

  showModal(modalContent);
}

// 处理编辑交付物
async function handleEditDeliverable(event, deliverableId) {
  event.preventDefault();

  const formData = new FormData(event.target);
  const updates = {
    name: formData.get("name").trim(),
    type: formData.get("type"),
    description: formData.get("description").trim(),
    fileName: formData.get("fileName").trim(),
    fileSize: formData.get("fileSize").trim() || "未知",
  };

  // 验证必填字段
  if (
    !updates.name ||
    !updates.type ||
    !updates.description ||
    !updates.fileName
  ) {
    api.showError("请填写所有必填字段");
    return;
  }

  try {
    const updatedDeliverable = await api.updateDeliverable(
      deliverableId,
      updates
    );
    const index = deliverables.findIndex((d) => d.id === deliverableId);
    deliverables[index] = updatedDeliverable;
    renderDeliverablesList();
    closeModal();
    api.showSuccess("交付物更新成功");
  } catch (error) {
    console.error("更新交付物失败:", error);
  }
}

// 审批交付物
async function approveDeliverable(deliverableId) {
  const deliverable = deliverables.find((d) => d.id === deliverableId);
  if (!deliverable) return;

  const modalContent = `
    <h2>审批交付物 - ${deliverable.name}</h2>
    <form id="approve-deliverable-form" onsubmit="handleApproveDeliverable(event, '${deliverableId}')">
      <div class="form-group">
        <label for="approval-status">审批结果 *</label>
        <select id="approval-status" name="status" required>
          <option value="">请选择审批结果</option>
          <option value="approved">通过</option>
          <option value="rejected">拒绝</option>
          <option value="revision_required">需要修改</option>
        </select>
      </div>
      <div class="form-group">
        <label for="approval-comment">审批意见</label>
        <textarea id="approval-comment" name="comment" maxlength="500" 
                  placeholder="请输入审批意见（可选）"></textarea>
      </div>
      <div class="form-group">
        <label for="approval-reviewer">审批人 *</label>
        <select id="approval-reviewer" name="approvedBy" required>
          <option value="">请选择审批人</option>
          ${users
            .filter((u) => u.role === "project_manager" || u.role === "admin")
            .map(
              (user) =>
                `<option value="${user.id}">${user.name} - ${user.department}</option>`
            )
            .join("")}
        </select>
      </div>
      <div class="form-actions">
        <button type="button" onclick="closeModal()" class="btn-secondary">取消</button>
        <button type="submit" class="btn-primary">提交审批</button>
      </div>
    </form>
  `;

  showModal(modalContent);
}

// 处理审批交付物
async function handleApproveDeliverable(event, deliverableId) {
  event.preventDefault();

  const formData = new FormData(event.target);
  const approvalData = {
    status: formData.get("status"),
    comment: formData.get("comment").trim(),
    approvedBy: formData.get("approvedBy"),
  };

  // 验证必填字段
  if (!approvalData.status || !approvalData.approvedBy) {
    api.showError("请填写所有必填字段");
    return;
  }

  try {
    const updatedDeliverable = await api.approveDeliverable(
      deliverableId,
      approvalData
    );
    const index = deliverables.findIndex((d) => d.id === deliverableId);
    deliverables[index] = updatedDeliverable;
    renderDeliverablesList();
    closeModal();
    api.showSuccess("交付物审批完成");
  } catch (error) {
    console.error("审批交付物失败:", error);
  }
}

// 删除交付物
async function deleteDeliverable(deliverableId) {
  const deliverable = deliverables.find((d) => d.id === deliverableId);
  if (!deliverable) return;

  const modalContent = `
    <h2>删除交付物</h2>
    <div class="delete-confirmation">
      <div class="warning-icon">⚠️</div>
      <p>确定要删除交付物 <strong>"${deliverable.name}"</strong> 吗？</p>
      <p class="warning-text">此操作不可撤销，将永久删除该交付物及其所有版本历史。</p>
      <div class="deliverable-info-summary">
        <div class="info-item">
          <span class="label">文件名:</span>
          <span class="value">${deliverable.fileName}</span>
        </div>
        <div class="info-item">
          <span class="label">类型:</span>
          <span class="value">${getDeliverableTypeText(deliverable.type)}</span>
        </div>
        <div class="info-item">
          <span class="label">上传时间:</span>
          <span class="value">${formatDate(deliverable.uploadedAt)}</span>
        </div>
      </div>
    </div>
    <div class="form-actions">
      <button type="button" onclick="closeModal()" class="btn-secondary">取消</button>
      <button type="button" onclick="confirmDeleteDeliverable('${deliverableId}')" class="btn-danger">确认删除</button>
    </div>
  `;

  showModal(modalContent);
}

// 确认删除交付物
async function confirmDeleteDeliverable(deliverableId) {
  try {
    await api.deleteDeliverable(deliverableId);
    deliverables = deliverables.filter((d) => d.id !== deliverableId);
    renderDeliverablesList();
    closeModal();
    api.showSuccess("交付物删除成功");
  } catch (error) {
    console.error("删除交付物失败:", error);
  }
}

// 交付物分类管理
function manageDeliverableCategories() {
  const categories = [
    {
      id: "requirements",
      name: "需求文档",
      description: "需求分析、用户故事等文档",
    },
    { id: "design", name: "设计文档", description: "系统设计、架构设计等文档" },
    { id: "technical", name: "技术文档", description: "技术规范、API文档等" },
    { id: "test", name: "测试文档", description: "测试计划、测试用例等" },
    { id: "management", name: "管理文档", description: "项目计划、会议纪要等" },
  ];

  const modalContent = `
    <h2>交付物分类管理</h2>
    <div class="categories-management">
      <div class="categories-list">
        <h3>现有分类</h3>
        ${categories
          .map(
            (category) => `
          <div class="category-item">
            <div class="category-info">
              <h4>${category.name}</h4>
              <p>${category.description}</p>
            </div>
            <div class="category-actions">
              <button class="btn-secondary btn-sm" onclick="editCategory('${category.id}')">编辑</button>
              <button class="btn-danger btn-sm" onclick="deleteCategory('${category.id}')">删除</button>
            </div>
          </div>
        `
          )
          .join("")}
      </div>
      
      <div class="add-category-section">
        <h3>添加新分类</h3>
        <form id="add-category-form" onsubmit="handleAddCategory(event)">
          <div class="form-group">
            <label for="category-name">分类名称 *</label>
            <input type="text" id="category-name" name="name" required maxlength="50" placeholder="请输入分类名称">
          </div>
          <div class="form-group">
            <label for="category-description">分类描述</label>
            <textarea id="category-description" name="description" maxlength="200" placeholder="请输入分类描述"></textarea>
          </div>
          <button type="submit" class="btn-primary">添加分类</button>
        </form>
      </div>
    </div>
    
    <div class="form-actions">
      <button type="button" onclick="closeModal()" class="btn-secondary">关闭</button>
    </div>
  `;

  showModal(modalContent);
}

// 处理添加分类
function handleAddCategory(event) {
  event.preventDefault();
  const formData = new FormData(event.target);
  const categoryData = {
    name: formData.get("name").trim(),
    description: formData.get("description").trim(),
  };

  if (!categoryData.name) {
    api.showError("分类名称不能为空");
    return;
  }

  // 这里应该调用API保存分类，暂时只显示成功消息
  api.showSuccess("分类添加成功");
  event.target.reset();
}

// ==================== 仪表板相关函数 ====================

// 渲染项目仪表板
function renderDashboard() {
  const container = document.getElementById("dashboard-charts");
  if (!container) return;

  // 计算统计数据
  const stats = calculateDashboardStats();

  container.innerHTML = `
    <div class="dashboard-header">
      <div class="dashboard-filters">
        <div class="filter-group">
          <label for="dashboard-project-filter">项目筛选:</label>
          <select id="dashboard-project-filter" onchange="updateDashboard()">
            <option value="">所有项目</option>
            ${projects
              .map((p) => `<option value="${p.id}">${p.name}</option>`)
              .join("")}
          </select>
        </div>
        <div class="filter-group">
          <label for="dashboard-time-range">时间范围:</label>
          <select id="dashboard-time-range" onchange="updateDashboard()">
            <option value="all">全部时间</option>
            <option value="month">最近一个月</option>
            <option value="quarter">最近三个月</option>
            <option value="year">最近一年</option>
          </select>
        </div>
        <button onclick="showAdvancedFilters()" class="btn-secondary">高级筛选</button>
      </div>
    </div>

    <div class="dashboard-grid">
      <!-- 项目概览统计 -->
      <div class="dashboard-card overview-stats">
        <div class="card-header">
          <h3>项目概览</h3>
          <button onclick="exportStats()" class="btn-secondary btn-sm">导出数据</button>
        </div>
        <div class="card-content">
          <div class="stats-overview">
            <div class="stat-item">
              <div class="stat-icon">📊</div>
              <div class="stat-info">
                <div class="stat-number">${stats.totalProjects}</div>
                <div class="stat-label">总项目数</div>
              </div>
            </div>
            <div class="stat-item">
              <div class="stat-icon">🚀</div>
              <div class="stat-info">
                <div class="stat-number">${stats.activeProjects}</div>
                <div class="stat-label">进行中项目</div>
              </div>
            </div>
            <div class="stat-item">
              <div class="stat-icon">✅</div>
              <div class="stat-info">
                <div class="stat-number">${stats.completedProjects}</div>
                <div class="stat-label">已完成项目</div>
              </div>
            </div>
            <div class="stat-item">
              <div class="stat-icon">⚠️</div>
              <div class="stat-info">
                <div class="stat-number">${stats.blockedProjects}</div>
                <div class="stat-label">阻塞项目</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 项目进度分析 -->
      <div class="dashboard-card progress-analysis">
        <div class="card-header">
          <h3>项目进度分析</h3>
          <button onclick="showProgressDetails()" class="btn-secondary btn-sm">详细分析</button>
        </div>
        <div class="card-content">
          <div class="progress-chart">
            ${renderProgressChart(stats.projectProgress)}
          </div>
        </div>
      </div>

      <!-- 团队工作量分析 -->
      <div class="dashboard-card workload-analysis">
        <div class="card-header">
          <h3>团队工作量分析</h3>
          <button onclick="showWorkloadDetails()" class="btn-secondary btn-sm">详细分析</button>
        </div>
        <div class="card-content">
          <div class="workload-chart">
            ${renderWorkloadChart(stats.teamWorkload)}
          </div>
        </div>
      </div>

      <!-- 阶段分布统计 -->
      <div class="dashboard-card stage-distribution">
        <div class="card-header">
          <h3>项目阶段分布</h3>
        </div>
        <div class="card-content">
          <div class="stage-stats">
            ${renderStageDistribution(stats.stageDistribution)}
          </div>
        </div>
      </div>

      <!-- 交付物统计 -->
      <div class="dashboard-card deliverable-stats">
        <div class="card-header">
          <h3>交付物统计</h3>
          <button onclick="showDeliverableAnalysis()" class="btn-secondary btn-sm">详细分析</button>
        </div>
        <div class="card-content">
          <div class="deliverable-overview">
            <div class="deliverable-stat">
              <span class="stat-label">总交付物:</span>
              <span class="stat-value">${stats.totalDeliverables}</span>
            </div>
            <div class="deliverable-stat">
              <span class="stat-label">已审批:</span>
              <span class="stat-value">${stats.approvedDeliverables}</span>
            </div>
            <div class="deliverable-stat">
              <span class="stat-label">待审批:</span>
              <span class="stat-value">${stats.pendingDeliverables}</span>
            </div>
            <div class="deliverable-stat">
              <span class="stat-label">需修改:</span>
              <span class="stat-value">${stats.revisionDeliverables}</span>
            </div>
          </div>
          <div class="deliverable-type-chart">
            ${renderDeliverableTypeChart(stats.deliverableTypes)}
          </div>
        </div>
      </div>

      <!-- DCP评审统计 -->
      <div class="dashboard-card dcp-stats">
        <div class="card-header">
          <h3>DCP评审统计</h3>
          <button onclick="showDCPAnalysis()" class="btn-secondary btn-sm">详细分析</button>
        </div>
        <div class="card-content">
          <div class="dcp-overview">
            <div class="dcp-stat">
              <span class="stat-label">总评审数:</span>
              <span class="stat-value">${stats.totalReviews}</span>
            </div>
            <div class="dcp-stat">
              <span class="stat-label">已完成:</span>
              <span class="stat-value">${stats.completedReviews}</span>
            </div>
            <div class="dcp-stat">
              <span class="stat-label">进行中:</span>
              <span class="stat-value">${stats.inProgressReviews}</span>
            </div>
            <div class="dcp-stat">
              <span class="stat-label">逾期:</span>
              <span class="stat-value">${stats.overdueReviews}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

// 计算仪表板统计数据
function calculateDashboardStats() {
  const stats = {
    totalProjects: projects.length,
    activeProjects: projects.filter((p) => p.status === "in_progress").length,
    completedProjects: projects.filter((p) => p.status === "completed").length,
    blockedProjects: projects.filter((p) => p.status === "blocked").length,
    totalDeliverables: deliverables.length,
    approvedDeliverables: deliverables.filter(
      (d) => d.approvalStatus === "approved"
    ).length,
    pendingDeliverables: deliverables.filter(
      (d) => d.approvalStatus === "pending"
    ).length,
    revisionDeliverables: deliverables.filter(
      (d) => d.approvalStatus === "revision_required"
    ).length,
    totalReviews: dcpReviews.length,
    completedReviews: dcpReviews.filter((r) => r.status === "completed").length,
    inProgressReviews: dcpReviews.filter((r) => r.status === "in_review")
      .length,
    overdueReviews: dcpReviews.filter((r) => {
      return r.status !== "completed" && new Date(r.deadline) < new Date();
    }).length,
    projectProgress: calculateProjectProgress(),
    teamWorkload: calculateTeamWorkload(),
    stageDistribution: calculateStageDistribution(),
    deliverableTypes: calculateDeliverableTypes(),
  };

  return stats;
}

// 计算项目进度数据
function calculateProjectProgress() {
  return projects.map((project) => ({
    id: project.id,
    name: project.name,
    progress: calculateOverallProgress(project),
    status: project.status,
    currentStage: project.currentStage,
  }));
}

// 计算团队工作量数据
function calculateTeamWorkload() {
  const workloadMap = {};

  users.forEach((user) => {
    const userTasks = tasks.filter((task) => task.assignee === user.id);
    const activeTasks = userTasks.filter(
      (task) => task.status === "in_progress"
    );
    const completedTasks = userTasks.filter(
      (task) => task.status === "completed"
    );

    workloadMap[user.id] = {
      name: user.name,
      department: user.department,
      function: user.function,
      totalTasks: userTasks.length,
      activeTasks: activeTasks.length,
      completedTasks: completedTasks.length,
      workloadLevel:
        activeTasks.length > 5
          ? "high"
          : activeTasks.length > 2
          ? "medium"
          : "low",
    };
  });

  return Object.values(workloadMap);
}

// 计算阶段分布数据
function calculateStageDistribution() {
  const stageCount = {
    concept: 0,
    plan: 0,
    develop: 0,
    verify: 0,
    release: 0,
    lifecycle: 0,
  };

  projects.forEach((project) => {
    if (
      project.currentStage &&
      stageCount.hasOwnProperty(project.currentStage)
    ) {
      stageCount[project.currentStage]++;
    }
  });

  return stageCount;
}

// 计算交付物类型分布
function calculateDeliverableTypes() {
  const typeCount = {};

  deliverables.forEach((deliverable) => {
    typeCount[deliverable.type] = (typeCount[deliverable.type] || 0) + 1;
  });

  return typeCount;
}

// 渲染进度图表
function renderProgressChart(progressData) {
  if (!progressData || progressData.length === 0) {
    return '<div class="empty-chart">暂无项目数据</div>';
  }

  return `
    <div class="progress-chart-container">
      <div class="chart-header">
        <h4>项目进度概览</h4>
      </div>
      <div class="progress-bars">
        ${progressData
          .map(
            (project) => `
          <div class="project-progress-item">
            <div class="project-info">
              <span class="project-name">${project.name}</span>
              <span class="project-stage">${getStageText(
                project.currentStage
              )}</span>
            </div>
            <div class="progress-bar-container">
              <div class="progress-bar">
                <div class="progress-fill" style="width: ${
                  project.progress
                }%"></div>
              </div>
              <span class="progress-percentage">${project.progress}%</span>
            </div>
          </div>
        `
          )
          .join("")}
      </div>
    </div>
  `;
}

// 渲染工作量图表
function renderWorkloadChart(workloadData) {
  if (!workloadData || workloadData.length === 0) {
    return '<div class="empty-chart">暂无团队数据</div>';
  }

  return `
    <div class="workload-chart-container">
      <div class="chart-header">
        <h4>团队工作量分布</h4>
      </div>
      <div class="workload-bars">
        ${workloadData
          .map(
            (member) => `
          <div class="member-workload-item">
            <div class="member-info">
              <span class="member-name">${member.name}</span>
              <span class="member-dept">${member.department}</span>
            </div>
            <div class="workload-indicator">
              <div class="workload-bar">
                <div class="workload-fill ${member.workloadLevel}" 
                     style="width: ${Math.min(
                       member.activeTasks * 20,
                       100
                     )}%"></div>
              </div>
              <span class="workload-count">${member.activeTasks}个任务</span>
            </div>
          </div>
        `
          )
          .join("")}
      </div>
    </div>
  `;
}

// 渲染阶段分布
function renderStageDistribution(stageData) {
  const total = Object.values(stageData).reduce((sum, count) => sum + count, 0);

  if (total === 0) {
    return '<div class="empty-chart">暂无阶段数据</div>';
  }

  return `
    <div class="stage-distribution-container">
      ${Object.entries(stageData)
        .map(([stage, count]) => {
          const percentage = total > 0 ? Math.round((count / total) * 100) : 0;
          return `
          <div class="stage-item">
            <div class="stage-info">
              <span class="stage-name">${getStageText(stage)}</span>
              <span class="stage-count">${count}个项目</span>
            </div>
            <div class="stage-bar">
              <div class="stage-fill" style="width: ${percentage}%"></div>
            </div>
            <span class="stage-percentage">${percentage}%</span>
          </div>
        `;
        })
        .join("")}
    </div>
  `;
}

// 渲染交付物类型图表
function renderDeliverableTypeChart(typeData) {
  const total = Object.values(typeData).reduce((sum, count) => sum + count, 0);

  if (total === 0) {
    return '<div class="empty-chart">暂无交付物数据</div>';
  }

  return `
    <div class="deliverable-type-chart-container">
      <div class="type-distribution">
        ${Object.entries(typeData)
          .map(([type, count]) => {
            const percentage = Math.round((count / total) * 100);
            return `
            <div class="type-item">
              <div class="type-icon">${getDeliverableIcon(type)}</div>
              <div class="type-info">
                <span class="type-name">${getDeliverableTypeText(type)}</span>
                <span class="type-count">${count}个 (${percentage}%)</span>
              </div>
            </div>
          `;
          })
          .join("")}
      </div>
    </div>
  `;
}

// 更新仪表板数据
function updateDashboard() {
  renderDashboard();
}

// 显示高级筛选
function showAdvancedFilters() {
  const modalContent = `
    <h2>高级筛选设置</h2>
    <form id="advanced-filters-form" onsubmit="applyAdvancedFilters(event)">
      <div class="filter-section">
        <h3>项目筛选</h3>
        <div class="form-group">
          <label>项目状态:</label>
          <div class="checkbox-group">
            <label class="checkbox-label">
              <input type="checkbox" name="status" value="not_started" checked> 未开始
            </label>
            <label class="checkbox-label">
              <input type="checkbox" name="status" value="in_progress" checked> 进行中
            </label>
            <label class="checkbox-label">
              <input type="checkbox" name="status" value="completed" checked> 已完成
            </label>
            <label class="checkbox-label">
              <input type="checkbox" name="status" value="blocked" checked> 已阻塞
            </label>
          </div>
        </div>
        <div class="form-group">
          <label>项目阶段:</label>
          <div class="checkbox-group">
            <label class="checkbox-label">
              <input type="checkbox" name="stage" value="concept" checked> 概念阶段
            </label>
            <label class="checkbox-label">
              <input type="checkbox" name="stage" value="plan" checked> 计划阶段
            </label>
            <label class="checkbox-label">
              <input type="checkbox" name="stage" value="develop" checked> 开发阶段
            </label>
            <label class="checkbox-label">
              <input type="checkbox" name="stage" value="verify" checked> 验证阶段
            </label>
            <label class="checkbox-label">
              <input type="checkbox" name="stage" value="release" checked> 发布阶段
            </label>
            <label class="checkbox-label">
              <input type="checkbox" name="stage" value="lifecycle" checked> 生命周期阶段
            </label>
          </div>
        </div>
      </div>
      
      <div class="filter-section">
        <h3>时间范围</h3>
        <div class="form-group">
          <label for="start-date">开始日期:</label>
          <input type="date" id="start-date" name="startDate">
        </div>
        <div class="form-group">
          <label for="end-date">结束日期:</label>
          <input type="date" id="end-date" name="endDate">
        </div>
      </div>
      
      <div class="filter-section">
        <h3>团队筛选</h3>
        <div class="form-group">
          <label for="department-filter">部门:</label>
          <select id="department-filter" name="department">
            <option value="">所有部门</option>
            ${[...new Set(users.map((u) => u.department))]
              .map((dept) => `<option value="${dept}">${dept}</option>`)
              .join("")}
          </select>
        </div>
      </div>
      
      <div class="form-actions">
        <button type="button" onclick="resetFilters()" class="btn-secondary">重置</button>
        <button type="button" onclick="closeModal()" class="btn-secondary">取消</button>
        <button type="submit" class="btn-primary">应用筛选</button>
      </div>
    </form>
  `;

  showModal(modalContent);
}

// 应用高级筛选
function applyAdvancedFilters(event) {
  event.preventDefault();
  // 这里应该根据筛选条件重新计算和渲染数据
  api.showSuccess("筛选条件已应用");
  closeModal();
  updateDashboard();
}

// 重置筛选条件
function resetFilters() {
  document.getElementById("dashboard-project-filter").value = "";
  document.getElementById("dashboard-time-range").value = "all";
  updateDashboard();
}

// 导出统计数据
function exportStats() {
  const stats = calculateDashboardStats();
  const exportData = {
    exportTime: new Date().toISOString(),
    projectStats: {
      total: stats.totalProjects,
      active: stats.activeProjects,
      completed: stats.completedProjects,
      blocked: stats.blockedProjects,
    },
    deliverableStats: {
      total: stats.totalDeliverables,
      approved: stats.approvedDeliverables,
      pending: stats.pendingDeliverables,
      revision: stats.revisionDeliverables,
    },
    reviewStats: {
      total: stats.totalReviews,
      completed: stats.completedReviews,
      inProgress: stats.inProgressReviews,
      overdue: stats.overdueReviews,
    },
  };

  // 模拟导出功能
  const dataStr = JSON.stringify(exportData, null, 2);
  console.log("导出数据:", dataStr);
  api.showSuccess("统计数据已导出到控制台");
}

// 显示进度详细分析
function showProgressDetails() {
  const progressData = calculateProjectProgress();

  const modalContent = `
    <h2>项目进度详细分析</h2>
    <div class="progress-details">
      <div class="progress-summary">
        <h3>进度概览</h3>
        <div class="summary-stats">
          <div class="summary-item">
            <span class="summary-label">平均进度:</span>
            <span class="summary-value">${Math.round(
              progressData.reduce((sum, p) => sum + p.progress, 0) /
                progressData.length
            )}%</span>
          </div>
          <div class="summary-item">
            <span class="summary-label">最快项目:</span>
            <span class="summary-value">${
              progressData.reduce(
                (max, p) => (p.progress > max.progress ? p : max),
                progressData[0]
              )?.name || "无"
            }</span>
          </div>
          <div class="summary-item">
            <span class="summary-label">最慢项目:</span>
            <span class="summary-value">${
              progressData.reduce(
                (min, p) => (p.progress < min.progress ? p : min),
                progressData[0]
              )?.name || "无"
            }</span>
          </div>
        </div>
      </div>
      
      <div class="progress-table">
        <h3>详细进度表</h3>
        <table class="data-table">
          <thead>
            <tr>
              <th>项目名称</th>
              <th>当前阶段</th>
              <th>整体进度</th>
              <th>项目状态</th>
            </tr>
          </thead>
          <tbody>
            ${progressData
              .map(
                (project) => `
              <tr>
                <td>${project.name}</td>
                <td>${getStageText(project.currentStage)}</td>
                <td>
                  <div class="progress-cell">
                    <div class="progress-bar">
                      <div class="progress-fill" style="width: ${
                        project.progress
                      }%"></div>
                    </div>
                    <span>${project.progress}%</span>
                  </div>
                </td>
                <td><span class="project-status ${
                  project.status
                }">${getStatusText(project.status)}</span></td>
              </tr>
            `
              )
              .join("")}
          </tbody>
        </table>
      </div>
    </div>
    
    <div class="form-actions">
      <button type="button" onclick="closeModal()" class="btn-secondary">关闭</button>
    </div>
  `;

  showModal(modalContent);
}

// 显示工作量详细分析
function showWorkloadDetails() {
  const workloadData = calculateTeamWorkload();

  const modalContent = `
    <h2>团队工作量详细分析</h2>
    <div class="workload-details">
      <div class="workload-summary">
        <h3>工作量概览</h3>
        <div class="summary-stats">
          <div class="summary-item">
            <span class="summary-label">团队总人数:</span>
            <span class="summary-value">${workloadData.length}人</span>
          </div>
          <div class="summary-item">
            <span class="summary-label">高负荷人员:</span>
            <span class="summary-value">${
              workloadData.filter((m) => m.workloadLevel === "high").length
            }人</span>
          </div>
          <div class="summary-item">
            <span class="summary-label">平均任务数:</span>
            <span class="summary-value">${Math.round(
              workloadData.reduce((sum, m) => sum + m.activeTasks, 0) /
                workloadData.length
            )}个</span>
          </div>
        </div>
      </div>
      
      <div class="workload-table">
        <h3>详细工作量表</h3>
        <table class="data-table">
          <thead>
            <tr>
              <th>姓名</th>
              <th>部门</th>
              <th>职能</th>
              <th>进行中任务</th>
              <th>已完成任务</th>
              <th>工作负荷</th>
            </tr>
          </thead>
          <tbody>
            ${workloadData
              .map(
                (member) => `
              <tr>
                <td>${member.name}</td>
                <td>${member.department}</td>
                <td>${member.function}</td>
                <td>${member.activeTasks}</td>
                <td>${member.completedTasks}</td>
                <td><span class="workload-indicator ${
                  member.workloadLevel
                }">${getWorkloadText(member.workloadLevel)}</span></td>
              </tr>
            `
              )
              .join("")}
          </tbody>
        </table>
      </div>
    </div>
    
    <div class="form-actions">
      <button type="button" onclick="closeModal()" class="btn-secondary">关闭</button>
    </div>
  `;

  showModal(modalContent);
}

// 显示交付物分析
function showDeliverableAnalysis() {
  const typeData = calculateDeliverableTypes();

  const modalContent = `
    <h2>交付物详细分析</h2>
    <div class="deliverable-analysis">
      <div class="deliverable-summary">
        <h3>交付物概览</h3>
        <div class="summary-stats">
          <div class="summary-item">
            <span class="summary-label">总交付物数:</span>
            <span class="summary-value">${deliverables.length}个</span>
          </div>
          <div class="summary-item">
            <span class="summary-label">审批通过率:</span>
            <span class="summary-value">${Math.round(
              (deliverables.filter((d) => d.approvalStatus === "approved")
                .length /
                deliverables.length) *
                100
            )}%</span>
          </div>
          <div class="summary-item">
            <span class="summary-label">主要类型:</span>
            <span class="summary-value">${
              Object.entries(typeData).reduce(
                (max, [type, count]) =>
                  count > max.count ? { type, count } : max,
                { type: "", count: 0 }
              ).type
            }</span>
          </div>
        </div>
      </div>
      
      <div class="deliverable-type-analysis">
        <h3>类型分布分析</h3>
        <div class="type-analysis-grid">
          ${Object.entries(typeData)
            .map(([type, count]) => {
              const percentage = Math.round(
                (count / deliverables.length) * 100
              );
              return `
              <div class="type-analysis-item">
                <div class="type-header">
                  <span class="type-icon">${getDeliverableIcon(type)}</span>
                  <span class="type-name">${getDeliverableTypeText(type)}</span>
                </div>
                <div class="type-stats">
                  <div class="type-count">${count}个</div>
                  <div class="type-percentage">${percentage}%</div>
                </div>
                <div class="type-bar">
                  <div class="type-fill" style="width: ${percentage}%"></div>
                </div>
              </div>
            `;
            })
            .join("")}
        </div>
      </div>
    </div>
    
    <div class="form-actions">
      <button type="button" onclick="closeModal()" class="btn-secondary">关闭</button>
    </div>
  `;

  showModal(modalContent);
}

// 显示DCP分析
function showDCPAnalysis() {
  const modalContent = `
    <h2>DCP评审详细分析</h2>
    <div class="dcp-analysis">
      <div class="dcp-summary">
        <h3>评审概览</h3>
        <div class="summary-stats">
          <div class="summary-item">
            <span class="summary-label">总评审数:</span>
            <span class="summary-value">${dcpReviews.length}个</span>
          </div>
          <div class="summary-item">
            <span class="summary-label">完成率:</span>
            <span class="summary-value">${Math.round(
              (dcpReviews.filter((r) => r.status === "completed").length /
                dcpReviews.length) *
                100
            )}%</span>
          </div>
          <div class="summary-item">
            <span class="summary-label">逾期率:</span>
            <span class="summary-value">${Math.round(
              (dcpReviews.filter(
                (r) =>
                  r.status !== "completed" && new Date(r.deadline) < new Date()
              ).length /
                dcpReviews.length) *
                100
            )}%</span>
          </div>
        </div>
      </div>
      
      <div class="dcp-table">
        <h3>评审详情表</h3>
        <table class="data-table">
          <thead>
            <tr>
              <th>评审标题</th>
              <th>项目阶段</th>
              <th>状态</th>
              <th>截止时间</th>
              <th>评审员数量</th>
            </tr>
          </thead>
          <tbody>
            ${dcpReviews
              .map((review) => {
                const project = projects.find((p) => p.id === review.projectId);
                const isOverdue =
                  review.status !== "completed" &&
                  new Date(review.deadline) < new Date();
                return `
                <tr>
                  <td>${review.title}</td>
                  <td>${getStageText(review.stage)}</td>
                  <td><span class="dcp-status ${review.status}">${
                  review.status === "completed"
                    ? "已完成"
                    : review.status === "in_review"
                    ? "评审中"
                    : "待开始"
                }</span></td>
                  <td class="${isOverdue ? "overdue-text" : ""}">${formatDate(
                  review.deadline
                )}</td>
                  <td>${review.reviewers ? review.reviewers.length : 0}人</td>
                </tr>
              `;
              })
              .join("")}
          </tbody>
        </table>
      </div>
    </div>
    
    <div class="form-actions">
      <button type="button" onclick="closeModal()" class="btn-secondary">关闭</button>
    </div>
  `;

  showModal(modalContent);
}

// 获取工作负荷文本
function getWorkloadText(level) {
  const levelMap = {
    low: "轻松",
    medium: "适中",
    high: "繁忙",
  };
  return levelMap[level] || level;
}

// ==================== 用户管理相关函数 ====================

// 渲染用户列表
function renderUsersList() {
  const container = document.getElementById("users-list");
  if (!container) return;

  if (users.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">👤</div>
        <div class="empty-state-text">暂无用户</div>
        <button onclick="createUser()" class="btn-primary empty-state-action">创建第一个用户</button>
      </div>
    `;
    return;
  }

  // 按部门分组显示用户
  const usersByDepartment = {};
  users.forEach((user) => {
    if (!usersByDepartment[user.department]) {
      usersByDepartment[user.department] = [];
    }
    usersByDepartment[user.department].push(user);
  });

  container.innerHTML = `
    <div class="users-header">
      <div class="users-stats">
        <div class="stat-item">
          <span class="stat-number">${users.length}</span>
          <span class="stat-label">总用户数</span>
        </div>
        <div class="stat-item">
          <span class="stat-number">${
            users.filter((u) => u.role === "admin").length
          }</span>
          <span class="stat-label">管理员</span>
        </div>
        <div class="stat-item">
          <span class="stat-number">${
            users.filter((u) => u.role === "project_manager").length
          }</span>
          <span class="stat-label">项目经理</span>
        </div>
        <div class="stat-item">
          <span class="stat-number">${
            users.filter((u) => u.role === "team_member").length
          }</span>
          <span class="stat-label">团队成员</span>
        </div>
      </div>
      
      <div class="users-filters">
        <select id="role-filter" onchange="filterUsers()">
          <option value="">所有角色</option>
          <option value="admin">管理员</option>
          <option value="project_manager">项目经理</option>
          <option value="team_member">团队成员</option>
          <option value="reviewer">评审员</option>
        </select>
        <select id="department-filter-users" onchange="filterUsers()">
          <option value="">所有部门</option>
          ${[...new Set(users.map((u) => u.department))]
            .map((dept) => `<option value="${dept}">${dept}</option>`)
            .join("")}
        </select>
        <button onclick="showRoleManagement()" class="btn-secondary">角色管理</button>
      </div>
    </div>

    <div class="users-departments">
      ${Object.entries(usersByDepartment)
        .map(
          ([department, departmentUsers]) => `
        <div class="department-section">
          <div class="department-header">
            <h3>${department}</h3>
            <span class="department-count">${departmentUsers.length} 人</span>
          </div>
          <div class="users-grid">
            ${departmentUsers
              .map(
                (user) => `
              <div class="user-card" data-role="${
                user.role
              }" data-department="${user.department}">
                <div class="user-header">
                  <div class="user-avatar">
                    ${user.name.charAt(0)}
                  </div>
                  <div class="user-basic-info">
                    <h4 class="user-name">${user.name}</h4>
                    <p class="user-email">${user.email}</p>
                  </div>
                  <div class="user-status">
                    <span class="role-badge ${user.role}">${getRoleText(
                  user.role
                )}</span>
                  </div>
                </div>
                <div class="user-details">
                  <div class="user-info-item">
                    <span class="info-label">部门:</span>
                    <span class="info-value">${user.department}</span>
                  </div>
                  <div class="user-info-item">
                    <span class="info-label">职能:</span>
                    <span class="info-value">${user.function}</span>
                  </div>
                  <div class="user-info-item">
                    <span class="info-label">参与项目:</span>
                    <span class="info-value">${
                      user.projects ? user.projects.length : 0
                    } 个</span>
                  </div>
                  <div class="user-info-item">
                    <span class="info-label">创建时间:</span>
                    <span class="info-value">${formatDate(
                      user.createdAt
                    )}</span>
                  </div>
                </div>
                <div class="user-actions">
                  <button onclick="viewUser('${
                    user.id
                  }')" class="btn-secondary btn-sm">查看详情</button>
                  <button onclick="editUser('${
                    user.id
                  }')" class="btn-primary btn-sm">编辑</button>
                  <button onclick="resetUserPassword('${
                    user.id
                  }')" class="btn-secondary btn-sm">重置密码</button>
                  <button onclick="deleteUser('${
                    user.id
                  }')" class="btn-danger btn-sm">删除</button>
                </div>
              </div>
            `
              )
              .join("")}
          </div>
        </div>
      `
        )
        .join("")}
    </div>
  `;
}

// 获取角色文本
function getRoleText(role) {
  const roleMap = {
    admin: "管理员",
    project_manager: "项目经理",
    team_member: "团队成员",
    reviewer: "评审员",
  };
  return roleMap[role] || role;
}

// 筛选用户
function filterUsers() {
  const roleFilter = document.getElementById("role-filter").value;
  const departmentFilter = document.getElementById(
    "department-filter-users"
  ).value;

  const userCards = document.querySelectorAll(".user-card");

  userCards.forEach((card) => {
    const userRole = card.getAttribute("data-role");
    const userDepartment = card.getAttribute("data-department");

    const showRole = !roleFilter || userRole === roleFilter;
    const showDepartment =
      !departmentFilter || userDepartment === departmentFilter;

    if (showRole && showDepartment) {
      card.style.display = "block";
    } else {
      card.style.display = "none";
    }
  });

  // 隐藏空的部门
  const departmentSections = document.querySelectorAll(".department-section");
  departmentSections.forEach((section) => {
    const visibleCards = section.querySelectorAll(
      '.user-card[style="display: block"], .user-card:not([style])'
    );
    if (visibleCards.length === 0) {
      section.style.display = "none";
    } else {
      section.style.display = "block";
    }
  });
}

// 创建用户
async function createUser() {
  const modalContent = `
    <h2>新建用户</h2>
    <form id="create-user-form" onsubmit="handleCreateUser(event)">
      <div class="form-group">
        <label for="user-name">姓名 *</label>
        <input type="text" id="user-name" name="name" required maxlength="50" placeholder="请输入用户姓名">
      </div>
      <div class="form-group">
        <label for="user-email">邮箱 *</label>
        <input type="email" id="user-email" name="email" required maxlength="100" placeholder="请输入邮箱地址">
      </div>
      <div class="form-group">
        <label for="user-role">角色 *</label>
        <select id="user-role" name="role" required>
          <option value="">请选择角色</option>
          <option value="admin">管理员</option>
          <option value="project_manager">项目经理</option>
          <option value="team_member">团队成员</option>
          <option value="reviewer">评审员</option>
        </select>
      </div>
      <div class="form-group">
        <label for="user-department">部门 *</label>
        <input type="text" id="user-department" name="department" required maxlength="50" placeholder="请输入所属部门">
      </div>
      <div class="form-group">
        <label for="user-function">职能 *</label>
        <input type="text" id="user-function" name="function" required maxlength="50" placeholder="请输入职能角色">
      </div>
      <div class="form-group">
        <label for="user-password">初始密码 *</label>
        <input type="password" id="user-password" name="password" required minlength="6" placeholder="请输入初始密码">
      </div>
      <div class="form-group">
        <label for="user-projects">参与项目</label>
        <div class="projects-selection">
          ${projects
            .map(
              (project) => `
            <label class="checkbox-label">
              <input type="checkbox" name="projects" value="${project.id}">
              ${project.name}
            </label>
          `
            )
            .join("")}
        </div>
      </div>
      <div class="form-actions">
        <button type="button" onclick="closeModal()" class="btn-secondary">取消</button>
        <button type="submit" class="btn-primary">创建用户</button>
      </div>
    </form>
  `;

  showModal(modalContent);
}

// 处理创建用户
async function handleCreateUser(event) {
  event.preventDefault();

  const formData = new FormData(event.target);
  const selectedProjects = Array.from(formData.getAll("projects"));

  const userData = {
    name: formData.get("name").trim(),
    email: formData.get("email").trim(),
    role: formData.get("role"),
    department: formData.get("department").trim(),
    function: formData.get("function").trim(),
    password: formData.get("password"),
    projects: selectedProjects,
  };

  // 验证必填字段
  if (
    !userData.name ||
    !userData.email ||
    !userData.role ||
    !userData.department ||
    !userData.function ||
    !userData.password
  ) {
    api.showError("请填写所有必填字段");
    return;
  }

  // 验证邮箱格式
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(userData.email)) {
    api.showError("邮箱格式不正确");
    return;
  }

  // 检查邮箱是否已存在
  if (users.find((u) => u.email === userData.email)) {
    api.showError("该邮箱已被使用");
    return;
  }

  try {
    const newUser = await api.createUser(userData);
    users.push(newUser);
    renderUsersList();
    closeModal();
    api.showSuccess("用户创建成功");
  } catch (error) {
    console.error("创建用户失败:", error);
  }
}

// 查看用户详情
function viewUser(userId) {
  const user = users.find((u) => u.id === userId);
  if (!user) return;

  const userProjects = projects.filter(
    (p) => user.projects && user.projects.includes(p.id)
  );
  const userTasks = tasks.filter((t) => t.assignee === userId);

  const modalContent = `
    <h2>用户详情 - ${user.name}</h2>
    <div class="user-detail">
      <div class="user-detail-header">
        <div class="user-avatar-large">
          ${user.name.charAt(0)}
        </div>
        <div class="user-detail-info">
          <h3>${user.name}</h3>
          <p class="user-email">${user.email}</p>
          <span class="role-badge ${user.role}">${getRoleText(user.role)}</span>
        </div>
      </div>
      
      <div class="user-detail-content">
        <div class="detail-section">
          <h4>基本信息</h4>
          <div class="detail-grid">
            <div class="detail-item">
              <span class="detail-label">部门:</span>
              <span class="detail-value">${user.department}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">职能:</span>
              <span class="detail-value">${user.function}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">创建时间:</span>
              <span class="detail-value">${formatDate(user.createdAt)}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">最后更新:</span>
              <span class="detail-value">${formatDate(user.updatedAt)}</span>
            </div>
          </div>
        </div>
        
        <div class="detail-section">
          <h4>参与项目 (${userProjects.length}个)</h4>
          ${
            userProjects.length > 0
              ? `
            <div class="projects-list">
              ${userProjects
                .map(
                  (project) => `
                <div class="project-item">
                  <span class="project-name">${project.name}</span>
                  <span class="project-status ${
                    project.status
                  }">${getStatusText(project.status)}</span>
                </div>
              `
                )
                .join("")}
            </div>
          `
              : '<p class="empty-text">暂未参与任何项目</p>'
          }
        </div>
        
        <div class="detail-section">
          <h4>任务统计</h4>
          <div class="task-stats">
            <div class="task-stat-item">
              <span class="stat-number">${userTasks.length}</span>
              <span class="stat-label">总任务数</span>
            </div>
            <div class="task-stat-item">
              <span class="stat-number">${
                userTasks.filter((t) => t.status === "completed").length
              }</span>
              <span class="stat-label">已完成</span>
            </div>
            <div class="task-stat-item">
              <span class="stat-number">${
                userTasks.filter((t) => t.status === "in_progress").length
              }</span>
              <span class="stat-label">进行中</span>
            </div>
            <div class="task-stat-item">
              <span class="stat-number">${
                userTasks.filter((t) => t.status === "not_started").length
              }</span>
              <span class="stat-label">未开始</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <div class="form-actions">
      <button type="button" onclick="closeModal()" class="btn-secondary">关闭</button>
      <button type="button" onclick="editUser('${
        user.id
      }')" class="btn-primary">编辑用户</button>
    </div>
  `;

  showModal(modalContent);
}

// 编辑用户
async function editUser(userId) {
  const user = users.find((u) => u.id === userId);
  if (!user) return;

  const modalContent = `
    <h2>编辑用户 - ${user.name}</h2>
    <form id="edit-user-form" onsubmit="handleEditUser(event, '${userId}')">
      <div class="form-group">
        <label for="edit-user-name">姓名 *</label>
        <input type="text" id="edit-user-name" name="name" required maxlength="50" 
               value="${user.name}" placeholder="请输入用户姓名">
      </div>
      <div class="form-group">
        <label for="edit-user-email">邮箱 *</label>
        <input type="email" id="edit-user-email" name="email" required maxlength="100" 
               value="${user.email}" placeholder="请输入邮箱地址">
      </div>
      <div class="form-group">
        <label for="edit-user-role">角色 *</label>
        <select id="edit-user-role" name="role" required>
          <option value="admin" ${
            user.role === "admin" ? "selected" : ""
          }>管理员</option>
          <option value="project_manager" ${
            user.role === "project_manager" ? "selected" : ""
          }>项目经理</option>
          <option value="team_member" ${
            user.role === "team_member" ? "selected" : ""
          }>团队成员</option>
          <option value="reviewer" ${
            user.role === "reviewer" ? "selected" : ""
          }>评审员</option>
        </select>
      </div>
      <div class="form-group">
        <label for="edit-user-department">部门 *</label>
        <input type="text" id="edit-user-department" name="department" required maxlength="50" 
               value="${user.department}" placeholder="请输入所属部门">
      </div>
      <div class="form-group">
        <label for="edit-user-function">职能 *</label>
        <input type="text" id="edit-user-function" name="function" required maxlength="50" 
               value="${user.function}" placeholder="请输入职能角色">
      </div>
      <div class="form-group">
        <label for="edit-user-projects">参与项目</label>
        <div class="projects-selection">
          ${projects
            .map(
              (project) => `
            <label class="checkbox-label">
              <input type="checkbox" name="projects" value="${project.id}" 
                     ${
                       user.projects && user.projects.includes(project.id)
                         ? "checked"
                         : ""
                     }>
              ${project.name}
            </label>
          `
            )
            .join("")}
        </div>
      </div>
      <div class="form-actions">
        <button type="button" onclick="closeModal()" class="btn-secondary">取消</button>
        <button type="submit" class="btn-primary">保存更改</button>
      </div>
    </form>
  `;

  showModal(modalContent);
}

// 处理编辑用户
async function handleEditUser(event, userId) {
  event.preventDefault();

  const formData = new FormData(event.target);
  const selectedProjects = Array.from(formData.getAll("projects"));

  const updates = {
    name: formData.get("name").trim(),
    email: formData.get("email").trim(),
    role: formData.get("role"),
    department: formData.get("department").trim(),
    function: formData.get("function").trim(),
    projects: selectedProjects,
  };

  // 验证必填字段
  if (
    !updates.name ||
    !updates.email ||
    !updates.role ||
    !updates.department ||
    !updates.function
  ) {
    api.showError("请填写所有必填字段");
    return;
  }

  // 验证邮箱格式
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(updates.email)) {
    api.showError("邮箱格式不正确");
    return;
  }

  // 检查邮箱是否已被其他用户使用
  const existingUser = users.find(
    (u) => u.email === updates.email && u.id !== userId
  );
  if (existingUser) {
    api.showError("该邮箱已被其他用户使用");
    return;
  }

  try {
    const updatedUser = await api.updateUser(userId, updates);
    const index = users.findIndex((u) => u.id === userId);
    users[index] = updatedUser;
    renderUsersList();
    closeModal();
    api.showSuccess("用户更新成功");
  } catch (error) {
    console.error("更新用户失败:", error);
  }
}

// 重置用户密码
async function resetUserPassword(userId) {
  const user = users.find((u) => u.id === userId);
  if (!user) return;

  const modalContent = `
    <h2>重置密码 - ${user.name}</h2>
    <form id="reset-password-form" onsubmit="handleResetPassword(event, '${userId}')">
      <div class="form-group">
        <label for="new-password">新密码 *</label>
        <input type="password" id="new-password" name="password" required minlength="6" placeholder="请输入新密码">
      </div>
      <div class="form-group">
        <label for="confirm-password">确认密码 *</label>
        <input type="password" id="confirm-password" name="confirmPassword" required minlength="6" placeholder="请再次输入新密码">
      </div>
      <div class="form-group">
        <label class="checkbox-label">
          <input type="checkbox" name="forceChange" checked>
          要求用户下次登录时修改密码
        </label>
      </div>
      <div class="form-actions">
        <button type="button" onclick="closeModal()" class="btn-secondary">取消</button>
        <button type="submit" class="btn-primary">重置密码</button>
      </div>
    </form>
  `;

  showModal(modalContent);
}

// 处理重置密码
async function handleResetPassword(event, userId) {
  event.preventDefault();

  const formData = new FormData(event.target);
  const password = formData.get("password");
  const confirmPassword = formData.get("confirmPassword");
  const forceChange = formData.get("forceChange") === "on";

  if (password !== confirmPassword) {
    api.showError("两次输入的密码不一致");
    return;
  }

  if (password.length < 6) {
    api.showError("密码长度至少6位");
    return;
  }

  try {
    // 这里应该调用重置密码的API
    // await api.resetUserPassword(userId, { password, forceChange });

    // 模拟成功
    closeModal();
    api.showSuccess("密码重置成功");
  } catch (error) {
    console.error("重置密码失败:", error);
  }
}

// 删除用户
async function deleteUser(userId) {
  const user = users.find((u) => u.id === userId);
  if (!user) return;

  const modalContent = `
    <h2>删除用户</h2>
    <div class="delete-confirmation">
      <div class="warning-icon">⚠️</div>
      <p>确定要删除用户 <strong>"${user.name}"</strong> 吗？</p>
      <p class="warning-text">此操作不可撤销，将同时删除用户的所有相关数据。</p>
      <div class="user-info-summary">
        <div class="info-item">
          <span class="label">邮箱:</span>
          <span class="value">${user.email}</span>
        </div>
        <div class="info-item">
          <span class="label">部门:</span>
          <span class="value">${user.department}</span>
        </div>
        <div class="info-item">
          <span class="label">角色:</span>
          <span class="value">${getRoleText(user.role)}</span>
        </div>
        <div class="info-item">
          <span class="label">参与项目:</span>
          <span class="value">${
            user.projects ? user.projects.length : 0
          } 个</span>
        </div>
      </div>
    </div>
    <div class="form-actions">
      <button type="button" onclick="closeModal()" class="btn-secondary">取消</button>
      <button type="button" onclick="confirmDeleteUser('${userId}')" class="btn-danger">确认删除</button>
    </div>
  `;

  showModal(modalContent);
}

// 确认删除用户
async function confirmDeleteUser(userId) {
  try {
    await api.deleteUser(userId);
    users = users.filter((u) => u.id !== userId);
    renderUsersList();
    closeModal();
    api.showSuccess("用户删除成功");
  } catch (error) {
    console.error("删除用户失败:", error);
  }
}

// 角色管理
function showRoleManagement() {
  const roles = [
    {
      id: "admin",
      name: "管理员",
      description: "系统管理员，拥有所有权限",
      permissions: ["用户管理", "项目管理", "系统设置", "数据导出", "角色管理"],
      userCount: users.filter((u) => u.role === "admin").length,
    },
    {
      id: "project_manager",
      name: "项目经理",
      description: "项目负责人，管理项目和团队",
      permissions: [
        "项目管理",
        "团队管理",
        "任务分配",
        "DCP评审",
        "交付物管理",
      ],
      userCount: users.filter((u) => u.role === "project_manager").length,
    },
    {
      id: "team_member",
      name: "团队成员",
      description: "项目团队成员，执行具体任务",
      permissions: ["查看项目", "更新任务", "上传交付物", "参与评审"],
      userCount: users.filter((u) => u.role === "team_member").length,
    },
    {
      id: "reviewer",
      name: "评审员",
      description: "专业评审人员，参与DCP评审",
      permissions: ["查看项目", "参与评审", "提交评审意见"],
      userCount: users.filter((u) => u.role === "reviewer").length,
    },
  ];

  const modalContent = `
    <h2>角色权限管理</h2>
    <div class="role-management">
      <div class="roles-list">
        ${roles
          .map(
            (role) => `
          <div class="role-item">
            <div class="role-header">
              <div class="role-info">
                <h4>${role.name}</h4>
                <p>${role.description}</p>
              </div>
              <div class="role-stats">
                <span class="user-count">${role.userCount} 人</span>
                <button onclick="editRole('${
                  role.id
                }')" class="btn-secondary btn-sm">编辑权限</button>
              </div>
            </div>
            <div class="role-permissions">
              <h5>权限列表:</h5>
              <div class="permissions-list">
                ${role.permissions
                  .map(
                    (permission) => `
                  <span class="permission-tag">${permission}</span>
                `
                  )
                  .join("")}
              </div>
            </div>
          </div>
        `
          )
          .join("")}
      </div>
    </div>
    
    <div class="form-actions">
      <button type="button" onclick="closeModal()" class="btn-secondary">关闭</button>
    </div>
  `;

  showModal(modalContent);
}

// 编辑角色权限
function editRole(roleId) {
  const allPermissions = [
    "用户管理",
    "项目管理",
    "团队管理",
    "任务分配",
    "DCP评审",
    "交付物管理",
    "系统设置",
    "数据导出",
    "角色管理",
    "查看项目",
    "更新任务",
    "上传交付物",
    "参与评审",
    "提交评审意见",
  ];

  const role = {
    admin: {
      name: "管理员",
      permissions: ["用户管理", "项目管理", "系统设置", "数据导出", "角色管理"],
    },
    project_manager: {
      name: "项目经理",
      permissions: [
        "项目管理",
        "团队管理",
        "任务分配",
        "DCP评审",
        "交付物管理",
      ],
    },
    team_member: {
      name: "团队成员",
      permissions: ["查看项目", "更新任务", "上传交付物", "参与评审"],
    },
    reviewer: {
      name: "评审员",
      permissions: ["查看项目", "参与评审", "提交评审意见"],
    },
  }[roleId];

  const modalContent = `
    <h2>编辑角色权限 - ${role.name}</h2>
    <form id="edit-role-form" onsubmit="handleEditRole(event, '${roleId}')">
      <div class="form-group">
        <label>权限设置:</label>
        <div class="permissions-grid">
          ${allPermissions
            .map(
              (permission) => `
            <label class="checkbox-label">
              <input type="checkbox" name="permissions" value="${permission}" 
                     ${role.permissions.includes(permission) ? "checked" : ""}>
              ${permission}
            </label>
          `
            )
            .join("")}
        </div>
      </div>
      <div class="form-actions">
        <button type="button" onclick="closeModal()" class="btn-secondary">取消</button>
        <button type="submit" class="btn-primary">保存权限</button>
      </div>
    </form>
  `;

  showModal(modalContent);
}

// 处理编辑角色权限
function handleEditRole(event, roleId) {
  event.preventDefault();

  const formData = new FormData(event.target);
  const selectedPermissions = Array.from(formData.getAll("permissions"));

  // 这里应该调用API保存角色权限
  console.log(`更新角色 ${roleId} 的权限:`, selectedPermissions);

  closeModal();
  api.showSuccess("角色权限更新成功");
}

// ==================== 系统设置相关函数 ====================

// 渲染系统设置页面
function renderSettings() {
  const container = document.getElementById("settings-content");
  if (!container) return;

  container.innerHTML = `
    <div class="settings-grid">
      <!-- 系统信息 -->
      <div class="settings-card">
        <div class="card-header">
          <h3>系统信息</h3>
          <button onclick="refreshSystemInfo()" class="btn-secondary btn-sm">刷新</button>
        </div>
        <div class="card-content">
          <div id="system-info-content">
            <div class="loading">
              <div class="loading-spinner"></div>
              <span>正在加载系统信息...</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 数据管理 -->
      <div class="settings-card">
        <div class="card-header">
          <h3>数据管理</h3>
        </div>
        <div class="card-content">
          <div class="data-management">
            <div class="data-stats">
              <div class="data-stat-item">
                <span class="stat-label">项目数据:</span>
                <span class="stat-value">${projects.length} 个项目</span>
              </div>
              <div class="data-stat-item">
                <span class="stat-label">用户数据:</span>
                <span class="stat-value">${users.length} 个用户</span>
              </div>
              <div class="data-stat-item">
                <span class="stat-label">交付物:</span>
                <span class="stat-value">${deliverables.length} 个文件</span>
              </div>
              <div class="data-stat-item">
                <span class="stat-label">DCP评审:</span>
                <span class="stat-value">${dcpReviews.length} 个评审</span>
              </div>
              <div class="data-stat-item">
                <span class="stat-label">任务数据:</span>
                <span class="stat-value">${tasks.length} 个任务</span>
              </div>
            </div>
            <div class="data-actions">
              <button onclick="exportAllData()" class="btn-primary">导出所有数据</button>
              <button onclick="importData()" class="btn-secondary">导入数据</button>
              <button onclick="clearAllData()" class="btn-danger">清空所有数据</button>
            </div>
          </div>
        </div>
      </div>

      <!-- 系统配置 -->
      <div class="settings-card">
        <div class="card-header">
          <h3>系统配置</h3>
        </div>
        <div class="card-content">
          <form id="system-config-form" onsubmit="saveSystemConfig(event)">
            <div class="form-group">
              <label for="system-name">系统名称:</label>
              <input type="text" id="system-name" name="systemName" value="IPD项目协作系统">
            </div>
            <div class="form-group">
              <label for="max-projects">最大项目数:</label>
              <input type="number" id="max-projects" name="maxProjects" value="100" min="1" max="1000">
            </div>
            <div class="form-group">
              <label for="session-timeout">会话超时(分钟):</label>
              <input type="number" id="session-timeout" name="sessionTimeout" value="30" min="5" max="480">
            </div>
            <div class="form-group">
              <label for="auto-backup">自动备份:</label>
              <select id="auto-backup" name="autoBackup">
                <option value="disabled">禁用</option>
                <option value="daily" selected>每日</option>
                <option value="weekly">每周</option>
                <option value="monthly">每月</option>
              </select>
            </div>
            <div class="form-group">
              <label class="checkbox-label">
                <input type="checkbox" name="enableNotifications" checked>
                启用系统通知
              </label>
            </div>
            <div class="form-group">
              <label class="checkbox-label">
                <input type="checkbox" name="enableAuditLog" checked>
                启用审计日志
              </label>
            </div>
            <div class="form-actions">
              <button type="submit" class="btn-primary">保存配置</button>
              <button type="button" onclick="resetSystemConfig()" class="btn-secondary">重置默认</button>
            </div>
          </form>
        </div>
      </div>

      <!-- 系统监控 -->
      <div class="settings-card">
        <div class="card-header">
          <h3>系统监控</h3>
          <button onclick="refreshMonitorData()" class="btn-secondary btn-sm">刷新</button>
        </div>
        <div class="card-content">
          <div id="monitor-content">
            <div class="loading">
              <div class="loading-spinner"></div>
              <span>正在加载监控数据...</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 系统日志 -->
      <div class="settings-card full-width">
        <div class="card-header">
          <h3>系统日志</h3>
          <div class="log-actions">
            <button onclick="refreshLogs()" class="btn-secondary btn-sm">刷新</button>
            <button onclick="clearLogs()" class="btn-danger btn-sm">清空日志</button>
            <button onclick="downloadLogs()" class="btn-primary btn-sm">下载日志</button>
          </div>
        </div>
        <div class="card-content">
          <div class="log-filters">
            <select id="log-level-filter" onchange="filterLogs()">
              <option value="">所有级别</option>
              <option value="info">信息</option>
              <option value="warn">警告</option>
              <option value="error">错误</option>
            </select>
            <input type="text" id="log-search" placeholder="搜索日志..." onkeyup="searchLogs()">
          </div>
          <div id="system-logs" class="system-logs">
            <!-- 日志内容将通过JavaScript动态加载 -->
          </div>
        </div>
      </div>

      <!-- 关于系统 -->
      <div class="settings-card">
        <div class="card-header">
          <h3>关于系统</h3>
        </div>
        <div class="card-content">
          <div class="about-system">
            <div class="system-logo">
              <div class="logo-icon">🏢</div>
              <h4>IPD项目协作系统</h4>
            </div>
            <div class="system-details">
              <div class="detail-item">
                <span class="detail-label">版本:</span>
                <span class="detail-value">v1.0.0</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">构建日期:</span>
                <span class="detail-value">${new Date().toLocaleDateString(
                  "zh-CN"
                )}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">技术栈:</span>
                <span class="detail-value">HTML + CSS + JavaScript + Node.js</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">开发团队:</span>
                <span class="detail-value">IPD Team</span>
              </div>
            </div>
            <div class="system-links">
              <button onclick="showLicense()" class="btn-secondary">许可证</button>
              <button onclick="showChangelog()" class="btn-secondary">更新日志</button>
              <button onclick="showHelp()" class="btn-primary">帮助文档</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  // 加载系统信息和监控数据
  loadSystemInfo();
  loadMonitorData();
  loadSystemLogs();
}

// 加载系统信息
async function loadSystemInfo() {
  try {
    const response = await fetch("/api/info");
    const result = await response.json();

    if (result.success) {
      const systemInfo = result.data;
      document.getElementById("system-info-content").innerHTML = `
        <div class="system-info-grid">
          <div class="info-item">
            <span class="info-label">系统名称:</span>
            <span class="info-value">${systemInfo.name}</span>
          </div>
          <div class="info-item">
            <span class="info-label">系统版本:</span>
            <span class="info-value">${systemInfo.version}</span>
          </div>
          <div class="info-item">
            <span class="info-label">启动时间:</span>
            <span class="info-value">${formatDate(systemInfo.startTime)}</span>
          </div>
          <div class="info-item">
            <span class="info-label">Node.js版本:</span>
            <span class="info-value">${systemInfo.nodeVersion}</span>
          </div>
          <div class="info-item">
            <span class="info-label">运行平台:</span>
            <span class="info-value">${systemInfo.platform} (${
        systemInfo.arch
      })</span>
          </div>
        </div>
      `;
    }
  } catch (error) {
    console.error("加载系统信息失败:", error);
    document.getElementById("system-info-content").innerHTML = `
      <div class="error-message">加载系统信息失败</div>
    `;
  }
}

// 加载监控数据
async function loadMonitorData() {
  try {
    const response = await fetch("/api/health");
    const result = await response.json();

    if (result.success) {
      const healthData = result.data;
      document.getElementById("monitor-content").innerHTML = `
        <div class="monitor-grid">
          <div class="monitor-item">
            <div class="monitor-icon">🟢</div>
            <div class="monitor-info">
              <div class="monitor-label">系统状态</div>
              <div class="monitor-value">${
                healthData.status === "healthy" ? "正常" : "异常"
              }</div>
            </div>
          </div>
          <div class="monitor-item">
            <div class="monitor-icon">⏱️</div>
            <div class="monitor-info">
              <div class="monitor-label">运行时间</div>
              <div class="monitor-value">${healthData.uptime}</div>
            </div>
          </div>
          <div class="monitor-item">
            <div class="monitor-icon">💾</div>
            <div class="monitor-info">
              <div class="monitor-label">内存使用</div>
              <div class="monitor-value">${healthData.memory.used} / ${
        healthData.memory.total
      }</div>
            </div>
          </div>
          <div class="monitor-item">
            <div class="monitor-icon">📊</div>
            <div class="monitor-info">
              <div class="monitor-label">外部内存</div>
              <div class="monitor-value">${healthData.memory.external}</div>
            </div>
          </div>
        </div>
      `;
    }
  } catch (error) {
    console.error("加载监控数据失败:", error);
    document.getElementById("monitor-content").innerHTML = `
      <div class="error-message">加载监控数据失败</div>
    `;
  }
}

// 加载系统日志
function loadSystemLogs() {
  // 模拟系统日志数据
  const logs = [
    { time: new Date().toISOString(), level: "info", message: "系统启动完成" },
    {
      time: new Date(Date.now() - 60000).toISOString(),
      level: "info",
      message: "用户登录: admin",
    },
    {
      time: new Date(Date.now() - 120000).toISOString(),
      level: "warn",
      message: "数据库连接超时，正在重试",
    },
    {
      time: new Date(Date.now() - 180000).toISOString(),
      level: "info",
      message: "项目数据同步完成",
    },
    {
      time: new Date(Date.now() - 240000).toISOString(),
      level: "error",
      message: "API请求失败: /api/projects/invalid-id",
    },
  ];

  renderLogs(logs);
}

// 渲染日志
function renderLogs(logs) {
  const container = document.getElementById("system-logs");
  if (!container) return;

  container.innerHTML = logs
    .map(
      (log) => `
    <div class="log-entry ${log.level}">
      <span class="log-time">${formatDate(log.time)}</span>
      <span class="log-level">${log.level.toUpperCase()}</span>
      <span class="log-message">${log.message}</span>
    </div>
  `
    )
    .join("");
}

// 刷新系统信息
function refreshSystemInfo() {
  document.getElementById("system-info-content").innerHTML = `
    <div class="loading">
      <div class="loading-spinner"></div>
      <span>正在刷新...</span>
    </div>
  `;
  loadSystemInfo();
}

// 刷新监控数据
function refreshMonitorData() {
  document.getElementById("monitor-content").innerHTML = `
    <div class="loading">
      <div class="loading-spinner"></div>
      <span>正在刷新...</span>
    </div>
  `;
  loadMonitorData();
}

// 导出所有数据
function exportAllData() {
  const allData = {
    exportTime: new Date().toISOString(),
    version: "1.0.0",
    data: {
      projects,
      users,
      dcpReviews,
      deliverables,
      tasks,
    },
  };

  const dataStr = JSON.stringify(allData, null, 2);
  const blob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = `ipd-system-data-${
    new Date().toISOString().split("T")[0]
  }.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);

  api.showSuccess("数据导出成功");
}

// 导入数据
function importData() {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = ".json";
  input.onchange = handleImportData;
  input.click();
}

// 处理导入数据
function handleImportData(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (e) {
    try {
      const importedData = JSON.parse(e.target.result);

      if (importedData.data) {
        // 确认导入
        if (confirm("确定要导入数据吗？这将覆盖现有数据。")) {
          projects = importedData.data.projects || [];
          users = importedData.data.users || [];
          dcpReviews = importedData.data.dcpReviews || [];
          deliverables = importedData.data.deliverables || [];
          tasks = importedData.data.tasks || [];

          // 重新渲染当前页面
          renderSettings();
          api.showSuccess("数据导入成功");
        }
      } else {
        api.showError("导入文件格式不正确");
      }
    } catch (error) {
      console.error("导入数据失败:", error);
      api.showError("导入数据失败，请检查文件格式");
    }
  };
  reader.readAsText(file);
}

// 清空所有数据
function clearAllData() {
  const modalContent = `
    <h2>清空所有数据</h2>
    <div class="delete-confirmation">
      <div class="warning-icon">⚠️</div>
      <p><strong>警告：此操作将删除所有系统数据！</strong></p>
      <p class="warning-text">包括项目、用户、交付物、DCP评审和任务数据。此操作不可撤销！</p>
      <div class="data-summary">
        <div class="summary-item">
          <span class="label">项目数据:</span>
          <span class="value">${projects.length} 个项目</span>
        </div>
        <div class="summary-item">
          <span class="label">用户数据:</span>
          <span class="value">${users.length} 个用户</span>
        </div>
        <div class="summary-item">
          <span class="label">交付物:</span>
          <span class="value">${deliverables.length} 个文件</span>
        </div>
        <div class="summary-item">
          <span class="label">其他数据:</span>
          <span class="value">${dcpReviews.length + tasks.length} 条记录</span>
        </div>
      </div>
    </div>
    <div class="form-actions">
      <button type="button" onclick="closeModal()" class="btn-secondary">取消</button>
      <button type="button" onclick="confirmClearAllData()" class="btn-danger">确认清空</button>
    </div>
  `;

  showModal(modalContent);
}

// 确认清空所有数据
function confirmClearAllData() {
  projects = [];
  users = [];
  dcpReviews = [];
  deliverables = [];
  tasks = [];

  closeModal();
  renderSettings();
  api.showSuccess("所有数据已清空");
}

// 保存系统配置
function saveSystemConfig(event) {
  event.preventDefault();

  const formData = new FormData(event.target);
  const config = {
    systemName: formData.get("systemName"),
    maxProjects: parseInt(formData.get("maxProjects")),
    sessionTimeout: parseInt(formData.get("sessionTimeout")),
    autoBackup: formData.get("autoBackup"),
    enableNotifications: formData.get("enableNotifications") === "on",
    enableAuditLog: formData.get("enableAuditLog") === "on",
  };

  // 这里应该调用API保存配置
  console.log("保存系统配置:", config);
  api.showSuccess("系统配置已保存");
}

// 重置系统配置
function resetSystemConfig() {
  if (confirm("确定要重置为默认配置吗？")) {
    document.getElementById("system-name").value = "IPD项目协作系统";
    document.getElementById("max-projects").value = "100";
    document.getElementById("session-timeout").value = "30";
    document.getElementById("auto-backup").value = "daily";
    api.showSuccess("配置已重置为默认值");
  }
}

// 筛选日志
function filterLogs() {
  // 实现日志筛选逻辑
  api.showSuccess("日志筛选功能开发中");
}

// 搜索日志
function searchLogs() {
  // 实现日志搜索逻辑
  const searchTerm = document.getElementById("log-search").value;
  if (searchTerm) {
    console.log("搜索日志:", searchTerm);
  }
}

// 刷新日志
function refreshLogs() {
  loadSystemLogs();
  api.showSuccess("日志已刷新");
}

// 清空日志
function clearLogs() {
  if (confirm("确定要清空所有日志吗？")) {
    document.getElementById("system-logs").innerHTML =
      '<div class="empty-text">暂无日志</div>';
    api.showSuccess("日志已清空");
  }
}

// 下载日志
function downloadLogs() {
  const logs = document.getElementById("system-logs").innerText;
  const blob = new Blob([logs], { type: "text/plain" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = `system-logs-${new Date().toISOString().split("T")[0]}.txt`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);

  api.showSuccess("日志下载成功");
}

// 显示许可证
function showLicense() {
  const modalContent = `
    <h2>软件许可证</h2>
    <div class="license-content">
      <h3>MIT License</h3>
      <p>Copyright (c) 2024 IPD Team</p>
      <p>Permission is hereby granted, free of charge, to any person obtaining a copy
      of this software and associated documentation files (the "Software"), to deal
      in the Software without restriction, including without limitation the rights
      to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
      copies of the Software, and to permit persons to whom the Software is
      furnished to do so, subject to the following conditions:</p>
      <p>The above copyright notice and this permission notice shall be included in all
      copies or substantial portions of the Software.</p>
      <p>THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
      IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
      FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
      AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
      LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
      OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
      SOFTWARE.</p>
    </div>
    <div class="form-actions">
      <button type="button" onclick="closeModal()" class="btn-secondary">关闭</button>
    </div>
  `;

  showModal(modalContent);
}

// 显示更新日志
function showChangelog() {
  const modalContent = `
    <h2>更新日志</h2>
    <div class="changelog-content">
      <div class="version-entry">
        <h3>v1.0.0 (2024-02-08)</h3>
        <ul>
          <li>✨ 初始版本发布</li>
          <li>✨ 实现IPD六阶段流程管理</li>
          <li>✨ 项目管理功能</li>
          <li>✨ 团队协作功能</li>
          <li>✨ DCP评审管理</li>
          <li>✨ 交付物管理</li>
          <li>✨ 用户权限管理</li>
          <li>✨ 项目仪表板</li>
          <li>✨ 系统设置功能</li>
        </ul>
      </div>
    </div>
    <div class="form-actions">
      <button type="button" onclick="closeModal()" class="btn-secondary">关闭</button>
    </div>
  `;

  showModal(modalContent);
}

// 显示帮助文档
function showHelp() {
  const modalContent = `
    <h2>帮助文档</h2>
    <div class="help-content">
      <div class="help-section">
        <h3>快速开始</h3>
        <ol>
          <li>创建项目：在项目概览页面点击"新建项目"</li>
          <li>添加团队成员：在用户管理页面添加用户</li>
          <li>管理项目阶段：在阶段管理页面跟踪项目进度</li>
          <li>创建DCP评审：在DCP评审页面创建决策评审点</li>
          <li>上传交付物：在交付物管理页面上传项目文档</li>
        </ol>
      </div>
      
      <div class="help-section">
        <h3>功能说明</h3>
        <ul>
          <li><strong>项目概览</strong>：查看所有项目的基本信息和进度</li>
          <li><strong>阶段管理</strong>：管理IPD六阶段流程</li>
          <li><strong>团队协作</strong>：管理团队成员和任务分配</li>
          <li><strong>DCP评审</strong>：管理决策评审点和评审流程</li>
          <li><strong>交付物管理</strong>：上传、管理项目交付物</li>
          <li><strong>仪表板</strong>：查看项目统计和分析数据</li>
          <li><strong>用户管理</strong>：管理用户账户和权限</li>
          <li><strong>系统设置</strong>：配置系统参数和查看系统信息</li>
        </ul>
      </div>
      
      <div class="help-section">
        <h3>技术支持</h3>
        <p>如需技术支持，请联系系统管理员或查看项目文档。</p>
      </div>
    </div>
    <div class="form-actions">
      <button type="button" onclick="closeModal()" class="btn-secondary">关闭</button>
    </div>
  `;

  showModal(modalContent);
}

// ==================== 阶段管理相关函数 ====================

function renderProjectStages() {
  const container = document.getElementById("stages-container");
  if (!container) return;

  if (!currentProject) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">🔄</div>
        <div class="empty-state-text">请先选择一个项目</div>
        <button onclick="goBack()" class="btn-primary empty-state-action">返回项目列表</button>
      </div>
    `;
    return;
  }

  const stages = currentProject.stages || {};
  const stageOrder = [
    "concept",
    "plan",
    "develop",
    "verify",
    "release",
    "lifecycle",
  ];

  container.innerHTML = `
    <div class="stages-header">
      <div class="project-info">
        <h2>${currentProject.name}</h2>
        <p>${currentProject.description}</p>
        <div class="project-meta">
          <span class="meta-item">状态: <span class="project-status ${
            currentProject.status
          }">${getStatusText(currentProject.status)}</span></span>
          <span class="meta-item">当前阶段: ${getStageText(
            currentProject.currentStage
          )}</span>
          <span class="meta-item">整体进度: ${calculateOverallProgress(
            currentProject
          )}%</span>
        </div>
      </div>
    </div>

    <!-- 六阶段流程图 -->
    <div class="stages-flow">
      ${stageOrder
        .map((stageKey, index) => {
          const stage = stages[stageKey] || {
            name: getStageText(stageKey),
            status: "not_started",
            progress: 0,
          };
          const isActive = currentProject.currentStage === stageKey;
          const isCompleted = stage.status === "completed";
          const isBlocked = stage.status === "blocked";

          return `
          <div class="stage-item ${
            isActive ? "active" : ""
          }" onclick="viewStageDetail('${stageKey}')">
            <div class="stage-circle ${stage.status}">
              <span class="stage-number">${index + 1}</span>
              ${isCompleted ? '<span class="stage-check">✓</span>' : ""}
              ${isBlocked ? '<span class="stage-block">⚠</span>' : ""}
            </div>
            <div class="stage-info">
              <div class="stage-name">${stage.name}</div>
              <div class="stage-progress">${stage.progress || 0}%</div>
              <div class="stage-dates">
                ${stage.startDate ? `开始: ${stage.startDate}` : ""}
                ${stage.endDate ? `<br>结束: ${stage.endDate}` : ""}
              </div>
            </div>
          </div>
          ${
            index < stageOrder.length - 1
              ? `
            <div class="stage-connector ${isCompleted ? "completed" : ""}">
              <div class="connector-line"></div>
              <div class="connector-arrow">→</div>
            </div>
          `
              : ""
          }
        `;
        })
        .join("")}
    </div>

    <!-- 当前阶段详情 -->
    <div class="current-stage-detail">
      <div class="stage-detail-header">
        <h3>当前阶段: ${getStageText(currentProject.currentStage)}</h3>
        <div class="stage-actions">
          <button onclick="updateStageStatus()" class="btn-primary">更新状态</button>
          <button onclick="viewStageDetail('${
            currentProject.currentStage
          }')" class="btn-secondary">查看详情</button>
        </div>
      </div>
      <div class="stage-detail-content">
        ${renderCurrentStageContent()}
      </div>
    </div>

    <!-- 阶段统计 -->
    <div class="stages-stats">
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-number">${
            stageOrder.filter((key) => stages[key]?.status === "completed")
              .length
          }</div>
          <div class="stat-label">已完成阶段</div>
        </div>
        <div class="stat-card">
          <div class="stat-number">${
            stageOrder.filter((key) => stages[key]?.status === "in_progress")
              .length
          }</div>
          <div class="stat-label">进行中阶段</div>
        </div>
        <div class="stat-card">
          <div class="stat-number">${
            stageOrder.filter((key) => stages[key]?.status === "not_started")
              .length
          }</div>
          <div class="stat-label">未开始阶段</div>
        </div>
        <div class="stat-card">
          <div class="stat-number">${Math.round(
            stageOrder.reduce(
              (sum, key) => sum + (stages[key]?.progress || 0),
              0
            ) / stageOrder.length
          )}%</div>
          <div class="stat-label">平均进度</div>
        </div>
      </div>
    </div>
  `;
}

// 渲染当前阶段内容
function renderCurrentStageContent() {
  if (!currentProject || !currentProject.stages) return "";

  const currentStage = currentProject.stages[currentProject.currentStage];
  if (!currentStage) return "<p>当前阶段信息不可用</p>";

  const stageTasks = tasks.filter(
    (task) =>
      task.projectId === currentProject.id &&
      task.stage === currentProject.currentStage
  );

  return `
    <div class="stage-content-grid">
      <div class="stage-progress-section">
        <h4>阶段进度</h4>
        <div class="progress-bar-large">
          <div class="progress-fill" style="width: ${
            currentStage.progress || 0
          }%"></div>
        </div>
        <div class="progress-info">
          <span>${currentStage.progress || 0}% 完成</span>
          <span class="stage-status ${currentStage.status}">${getStatusText(
    currentStage.status
  )}</span>
        </div>
      </div>
      
      <div class="stage-tasks-section">
        <h4>阶段任务</h4>
        <div class="tasks-summary">
          <div class="task-stat">
            <span class="task-count">${stageTasks.length}</span>
            <span class="task-label">总任务</span>
          </div>
          <div class="task-stat">
            <span class="task-count">${
              stageTasks.filter((t) => t.status === "completed").length
            }</span>
            <span class="task-label">已完成</span>
          </div>
          <div class="task-stat">
            <span class="task-count">${
              stageTasks.filter((t) => t.status === "in_progress").length
            }</span>
            <span class="task-label">进行中</span>
          </div>
        </div>
        ${
          stageTasks.length > 0
            ? `
          <div class="tasks-list">
            ${stageTasks
              .slice(0, 3)
              .map(
                (task) => `
              <div class="task-item">
                <div class="task-info">
                  <div class="task-name">${task.name}</div>
                  <div class="task-meta">
                    <span class="task-assignee">负责人: ${
                      users.find((u) => u.id === task.assignee)?.name ||
                      "未分配"
                    }</span>
                    <span class="task-progress">${getStatusText(
                      task.status
                    )}</span>
                  </div>
                </div>
              </div>
            `
              )
              .join("")}
            ${
              stageTasks.length > 3
                ? `<div class="more-tasks">还有 ${
                    stageTasks.length - 3
                  } 个任务...</div>`
                : ""
            }
          </div>
        `
            : '<div class="no-tasks">暂无任务</div>'
        }
      </div>
      
      <div class="stage-timeline-section">
        <h4>时间安排</h4>
        <div class="timeline-info">
          <div class="timeline-item">
            <span class="timeline-label">开始时间:</span>
            <span class="timeline-value">${
              currentStage.startDate || "未设置"
            }</span>
          </div>
          <div class="timeline-item">
            <span class="timeline-label">结束时间:</span>
            <span class="timeline-value">${
              currentStage.endDate || "未设置"
            }</span>
          </div>
          <div class="timeline-item">
            <span class="timeline-label">持续时间:</span>
            <span class="timeline-value">${
              currentStage.startDate && currentStage.endDate
                ? Math.ceil(
                    (new Date(currentStage.endDate) -
                      new Date(currentStage.startDate)) /
                      (1000 * 60 * 60 * 24)
                  ) + " 天"
                : "未计算"
            }</span>
          </div>
        </div>
      </div>
    </div>
  `;
}

function viewStageDetail(stageKey) {
  if (!currentProject || !currentProject.stages[stageKey]) return;

  const stage = currentProject.stages[stageKey];
  const stageTasks = tasks.filter(
    (task) => task.projectId === currentProject.id && task.stage === stageKey
  );

  const modalContent = `
    <h2>${stage.name} - 详细信息</h2>
    <div class="stage-detail-modal">
      <div class="stage-status-section">
        <h4>状态信息</h4>
        <div class="status-info">
          <span class="stage-status ${stage.status}">${getStatusText(
    stage.status
  )}</span>
          <span class="progress-info">${stage.progress || 0}% 完成</span>
        </div>
        <div class="progress-bar-large">
          <div class="progress-fill" style="width: ${
            stage.progress || 0
          }%"></div>
        </div>
      </div>
      
      <div class="stage-timeline-section">
        <h4>时间安排</h4>
        <div class="timeline-info">
          <div class="timeline-item">
            <span class="timeline-label">开始时间:</span>
            <span class="timeline-value">${stage.startDate || "未设置"}</span>
          </div>
          <div class="timeline-item">
            <span class="timeline-label">结束时间:</span>
            <span class="timeline-value">${stage.endDate || "未设置"}</span>
          </div>
        </div>
      </div>
      
      <div class="stage-tasks-section">
        <h4>阶段任务 (${stageTasks.length})</h4>
        ${
          stageTasks.length > 0
            ? `
          <div class="tasks-list">
            ${stageTasks
              .map(
                (task) => `
              <div class="task-item">
                <div class="task-info">
                  <div class="task-name">${task.name}</div>
                  <div class="task-meta">
                    <span class="task-assignee">负责人: ${
                      users.find((u) => u.id === task.assignee)?.name ||
                      "未分配"
                    }</span>
                    <span class="task-progress">${getStatusText(
                      task.status
                    )}</span>
                  </div>
                </div>
              </div>
            `
              )
              .join("")}
          </div>
        `
            : '<div class="no-tasks">暂无任务</div>'
        }
      </div>
    </div>
    
    <div class="form-actions">
      <button onclick="editStage('${stageKey}')" class="btn-primary">编辑阶段</button>
      <button onclick="closeModal()" class="btn-secondary">关闭</button>
    </div>
  `;

  showModal(modalContent);
}

function updateStageStatus() {
  api.showError("阶段状态更新功能开发中");
}

function editStage(stageKey) {
  api.showError("阶段编辑功能开发中");
}
