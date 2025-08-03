// IPD项目协作系统 - 完整版本

// 全局变量
let currentPage = "overview";
let currentProject = null;
let projects = [];
let users = [];
let dcpReviews = [];
let deliverables = [];
let tasks = [];

// 初始化数据
function initData() {
  // 项目数据
  projects = [
    {
      id: "proj_001",
      name: "档案数字化质检工具",
      description:
        "基于AI技术的档案数字化质量检测工具，提供自动化质检和智能分析功能",
      status: "in_progress",
      currentStage: "develop",
      progress: 75,
      createdAt: "2024-01-15",
      updatedAt: "2024-02-01",
      stages: {
        concept: { name: "概念阶段", status: "completed", progress: 100 },
        plan: { name: "计划阶段", status: "completed", progress: 100 },
        develop: { name: "开发阶段", status: "in_progress", progress: 75 },
        verify: { name: "验证阶段", status: "not_started", progress: 0 },
        release: { name: "发布阶段", status: "not_started", progress: 0 },
        lifecycle: { name: "生命周期阶段", status: "not_started", progress: 0 },
      },
    },
    {
      id: "proj_002",
      name: "矿山综合管控系统",
      description: "集成矿山生产、安全、环保等多维度的综合管控平台",
      status: "in_progress",
      currentStage: "verify",
      progress: 83,
      createdAt: "2023-10-10",
      updatedAt: "2024-01-20",
      stages: {
        concept: { name: "概念阶段", status: "completed", progress: 100 },
        plan: { name: "计划阶段", status: "completed", progress: 100 },
        develop: { name: "开发阶段", status: "completed", progress: 100 },
        verify: { name: "验证阶段", status: "in_progress", progress: 60 },
        release: { name: "发布阶段", status: "not_started", progress: 0 },
        lifecycle: { name: "生命周期阶段", status: "not_started", progress: 0 },
      },
    },
  ];
}
// 更多项目数据
projects.push(
  {
    id: "proj_003",
    name: "森林防火管理系统",
    description: "基于物联网和大数据的森林防火预警和应急管理系统",
    status: "completed",
    currentStage: "lifecycle",
    progress: 100,
    createdAt: "2023-06-15",
    updatedAt: "2024-01-10",
    stages: {
      concept: { name: "概念阶段", status: "completed", progress: 100 },
      plan: { name: "计划阶段", status: "completed", progress: 100 },
      develop: { name: "开发阶段", status: "completed", progress: 100 },
      verify: { name: "验证阶段", status: "completed", progress: 100 },
      release: { name: "发布阶段", status: "completed", progress: 100 },
      lifecycle: { name: "生命周期阶段", status: "in_progress", progress: 40 },
    },
  },
  {
    id: "proj_004",
    name: "道路保洁精细化管理系统",
    description: "智能化道路保洁作业管理和监督系统，提升城市环卫管理效率",
    status: "in_progress",
    currentStage: "develop",
    progress: 58,
    createdAt: "2024-02-01",
    updatedAt: "2024-02-15",
    stages: {
      concept: { name: "概念阶段", status: "completed", progress: 100 },
      plan: { name: "计划阶段", status: "completed", progress: 100 },
      develop: { name: "开发阶段", status: "in_progress", progress: 45 },
      verify: { name: "验证阶段", status: "not_started", progress: 0 },
      release: { name: "发布阶段", status: "not_started", progress: 0 },
      lifecycle: { name: "生命周期阶段", status: "not_started", progress: 0 },
    },
  },
  {
    id: "proj_005",
    name: "智慧公厕管理系统",
    description: "基于IoT技术的智能公厕管理平台，实现设施监控和服务优化",
    status: "in_progress",
    currentStage: "plan",
    progress: 47,
    createdAt: "2024-01-20",
    updatedAt: "2024-02-05",
    stages: {
      concept: { name: "概念阶段", status: "completed", progress: 100 },
      plan: { name: "计划阶段", status: "in_progress", progress: 80 },
      develop: { name: "开发阶段", status: "not_started", progress: 0 },
      verify: { name: "验证阶段", status: "not_started", progress: 0 },
      release: { name: "发布阶段", status: "not_started", progress: 0 },
      lifecycle: { name: "生命周期阶段", status: "not_started", progress: 0 },
    },
  }
);
// 用户数据
users = [
  {
    id: "user_001",
    name: "张明",
    email: "zhangming@company.com",
    department: "产品研发部",
    role: "项目经理",
    workload: 85,
    completedTasks: 12,
    ongoingTasks: 3,
    projects: ["proj_001", "proj_004"],
    skills: ["项目管理", "产品规划", "团队协作"],
  },
  {
    id: "user_002",
    name: "李华",
    email: "lihua@company.com",
    department: "市场部",
    role: "市场分析师",
    workload: 70,
    completedTasks: 8,
    ongoingTasks: 2,
    projects: ["proj_001", "proj_005"],
    skills: ["市场调研", "数据分析", "用户研究"],
  },
  {
    id: "user_003",
    name: "王强",
    email: "wangqiang@company.com",
    department: "技术部",
    role: "技术架构师",
    workload: 90,
    completedTasks: 15,
    ongoingTasks: 4,
    projects: ["proj_001", "proj_002"],
    skills: ["系统架构", "技术选型", "代码审查"],
  },
  {
    id: "user_004",
    name: "陈丽",
    email: "chenli@company.com",
    department: "设计部",
    role: "UI/UX设计师",
    workload: 75,
    completedTasks: 10,
    ongoingTasks: 2,
    projects: ["proj_004", "proj_005"],
    skills: ["界面设计", "用户体验", "原型制作"],
  },
  {
    id: "user_005",
    name: "刘伟",
    email: "liuwei@company.com",
    department: "技术部",
    role: "前端开发工程师",
    workload: 80,
    completedTasks: 18,
    ongoingTasks: 3,
    projects: ["proj_002"],
    skills: ["前端开发", "React", "Vue.js"],
  },
  {
    id: "user_006",
    name: "赵敏",
    email: "zhaomin@company.com",
    department: "质量部",
    role: "测试工程师",
    workload: 65,
    completedTasks: 14,
    ongoingTasks: 2,
    projects: ["proj_003"],
    skills: ["软件测试", "自动化测试", "性能测试"],
  },
];
  // DCP评审数据
  dcpReviews = [
    {
      id: "dcp_001",
      projectId: "proj_001",
      stage: "concept",
      title: "档案数字化质检工具概念阶段DCP评审",
      status: "completed",
      result: "pass",
      reviewers: ["user_001", "user_002", "user_003"],
      deadline: "2024-01-30",
      createdAt: "2024-01-25",
      completedAt: "2024-01-29"
    },
    {
      id: "dcp_002",
      projectId: "proj_001",
      stage: "plan",
      title: "档案数字化质检工具计划阶段DCP评审",
      status: "completed",
      result: "pass",
      reviewers: ["user_001", "user_003", "user_004"],
      deadline: "2024-02-15",
      createdAt: "2024-02-10",
      completedAt: "2024-02-14"
    },
    {
      id: "dcp_003",
      projectId: "proj_002",
      stage: "develop",
      title: "矿山综合管控系统开发阶段DCP评审",
      status: "in_review",
      result: null,
      reviewers: ["user_001", "user_003", "user_005"],
      deadline: "2024-03-01",
      createdAt: "2024-02-20",
      completedAt: null
    },
    {
      id: "dcp_004",
      projectId: "proj_004",
      stage: "concept",
      title: "道路保洁精细化管理系统概念阶段DCP评审",
      status: "pending",
      result: null,
      reviewers: ["user_001", "user_002", "user_004"],
      deadline: "2024-03-10",
      createdAt: "2024-02-25",
      completedAt: null
    }
  ];

  // 交付物数据
  deliverables = [
    {
      id: "deliv_001",
      projectId: "proj_001",
      stage: "concept",
      name: "市场需求分析报告",
      type: "document",
      description: "详细的市场需求调研和分析报告",
      fileName: "market_analysis_report.pdf",
      fileSize: "2.5MB",
      version: "1.0",
      uploadedBy: "user_002",
      uploadedAt: "2024-01-25",
      approvalStatus: "approved"
    },
    {
      id: "deliv_002",
      projectId: "proj_001",
      stage: "plan",
      name: "技术架构设计文档",
      type: "document",
      description: "系统技术架构和设计方案",
      fileName: "tech_architecture.pdf",
      fileSize: "3.2MB",
      version: "2.1",
      uploadedBy: "user_003",
      uploadedAt: "2024-02-10",
      approvalStatus: "approved"
    }
  ];
}//
 页面切换
function showPage(pageName) {
  console.log("切换到页面:", pageName);
  
  // 隐藏所有页面
  const pages = document.querySelectorAll('.page-content');
  pages.forEach(page => page.classList.remove('active'));
  
  // 显示目标页面
  const targetPage = document.getElementById(pageName + '-page');
  if (targetPage) {
    targetPage.classList.add('active');
  }
  
  // 更新导航
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => link.classList.remove('active'));
  
  const activeLink = document.querySelector(`[onclick="showPage('${pageName}')"]`);
  if (activeLink) {
    activeLink.classList.add('active');
  }
  
  // 渲染页面内容
  renderPage(pageName);
}

// 渲染页面内容
function renderPage(pageName) {
  switch(pageName) {
    case 'overview':
      renderProjectsList();
      break;
    case 'dashboard':
      renderDashboard();
      break;
    case 'team':
      renderTeam();
      break;
    case 'stages':
      renderStages();
      break;
    case 'dcp':
      renderDCP();
      break;
    case 'deliverables':
      renderDeliverables();
      break;
    case 'users':
      renderUsers();
      break;
    case 'settings':
      renderSettings();
      break;
    default:
      renderPlaceholder(pageName);
  }
}

// 项目详情查看
function viewProject(projectId) {
  currentProject = projects.find(p => p.id === projectId);
  if (currentProject) {
    showPage('project-detail');
  }
}

// 返回项目列表
function goBack() {
  currentProject = null;
  showPage('overview');
}/
/ 渲染项目列表
function renderProjectsList() {
  const container = document.getElementById('projects-list');
  if (!container) return;
  
  let html = '<div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 20px;">';
  
  projects.forEach(project => {
    const statusColor = getStatusColor(project.status);
    const statusText = getStatusText(project.status);
    const stageText = getStageText(project.currentStage);
    
    html += `
      <div style="background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
          <h3 style="margin: 0; color: #2c3e50; font-size: 1.1em;">${project.name}</h3>
          <span style="padding: 4px 12px; background: ${statusColor}; color: white; border-radius: 12px; font-size: 0.8em;">
            ${statusText}
          </span>
        </div>
        <p style="color: #666; margin-bottom: 15px; line-height: 1.5; font-size: 0.9em;">${project.description}</p>
        <div style="margin-bottom: 15px;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
            <span style="color: #666; font-size: 0.9em;">进度</span>
            <span style="font-weight: bold; color: #3498db;">${project.progress}%</span>
          </div>
          <div style="background: #ecf0f1; height: 8px; border-radius: 4px; overflow: hidden;">
            <div style="background: #3498db; height: 100%; width: ${project.progress}%; transition: width 0.3s ease;"></div>
          </div>
        </div>
        <div style="margin-bottom: 15px; font-size: 0.85em; color: #666;">
          <div style="margin-bottom: 5px;">当前阶段: ${stageText}</div>
          <div>更新时间: ${project.updatedAt}</div>
        </div>
        <div style="display: flex; gap: 10px;">
          <button onclick="viewProject('${project.id}')" style="flex: 1; padding: 8px 16px; border: 1px solid #3498db; color: #3498db; background: white; border-radius: 4px; cursor: pointer; font-size: 0.9em;">
            查看详情
          </button>
          <button onclick="alert('编辑功能开发中')" style="flex: 1; padding: 8px 16px; background: #3498db; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 0.9em;">
            编辑
          </button>
        </div>
      </div>
    `;
  });
  
  html += '</div>';
  container.innerHTML = html;
}

// 渲染项目详情页面
function renderProjectDetail() {
  const container = document.getElementById('project-detail-content');
  if (!container || !currentProject) return;
  
  const project = currentProject;
  
  container.innerHTML = `
    <div style="background: white; padding: 25px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
      <h2 style="color: #2c3e50; margin-bottom: 15px;">${project.name}</h2>
      <p style="color: #666; margin-bottom: 25px; line-height: 1.6;">${project.description}</p>
      
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 30px;">
        <div style="background: #f8f9fa; padding: 20px; border-radius: 6px; text-align: center;">
          <div style="font-size: 0.9em; color: #666; margin-bottom: 8px;">项目状态</div>
          <div style="font-weight: bold; color: ${getStatusColor(project.status)}; font-size: 1.1em;">${getStatusText(project.status)}</div>
        </div>
        <div style="background: #f8f9fa; padding: 20px; border-radius: 6px; text-align: center;">
          <div style="font-size: 0.9em; color: #666; margin-bottom: 8px;">当前阶段</div>
          <div style="font-weight: bold; color: #2c3e50; font-size: 1.1em;">${getStageText(project.currentStage)}</div>
        </div>
        <div style="background: #f8f9fa; padding: 20px; border-radius: 6px; text-align: center;">
          <div style="font-size: 0.9em; color: #666; margin-bottom: 8px;">整体进度</div>
          <div style="font-weight: bold; color: #3498db; font-size: 1.1em;">${project.progress}%</div>
        </div>
        <div style="background: #f8f9fa; padding: 20px; border-radius: 6px; text-align: center;">
          <div style="font-size: 0.9em; color: #666; margin-bottom: 8px;">最后更新</div>
          <div style="font-weight: bold; color: #2c3e50; font-size: 1.1em;">${project.updatedAt}</div>
        </div>
      </div>
      
      <div style="margin-bottom: 25px;">
        <h4 style="color: #2c3e50; margin-bottom: 15px;">六阶段进度</h4>
        ${Object.entries(project.stages).map(([key, stage]) => `
          <div style="display: flex; align-items: center; margin-bottom: 12px; padding: 15px; background: #f8f9fa; border-radius: 6px;">
            <div style="min-width: 140px; font-weight: 500; color: #2c3e50;">${stage.name}</div>
            <div style="flex: 1; margin: 0 20px;">
              <div style="background: #ecf0f1; height: 10px; border-radius: 5px; overflow: hidden;">
                <div style="background: ${getStatusColor(stage.status)}; height: 100%; width: ${stage.progress}%; transition: width 0.3s ease;"></div>
              </div>
            </div>
            <div style="min-width: 80px; text-align: right;">
              <span style="font-weight: bold; color: #3498db; margin-right: 10px;">${stage.progress}%</span>
              <span style="padding: 2px 8px; background: ${getStatusColor(stage.status)}; color: white; border-radius: 10px; font-size: 0.75em;">
                ${getStatusText(stage.status)}
              </span>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}// 
渲染仪表板
function renderDashboard() {
  const container = document.getElementById('dashboard-charts');
  if (!container) return;
  
  const totalProjects = projects.length;
  const activeProjects = projects.filter(p => p.status === 'in_progress').length;
  const completedProjects = projects.filter(p => p.status === 'completed').length;
  const planningProjects = projects.filter(p => p.status === 'planning').length;
  
  container.innerHTML = `
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 30px;">
      <div style="background: white; padding: 25px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); text-align: center;">
        <div style="font-size: 2.5em; font-weight: bold; color: #3498db; margin-bottom: 10px;">${totalProjects}</div>
        <div style="color: #666; font-size: 1.1em;">总项目数</div>
      </div>
      <div style="background: white; padding: 25px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); text-align: center;">
        <div style="font-size: 2.5em; font-weight: bold; color: #2ecc71; margin-bottom: 10px;">${activeProjects}</div>
        <div style="color: #666; font-size: 1.1em;">进行中</div>
      </div>
      <div style="background: white; padding: 25px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); text-align: center;">
        <div style="font-size: 2.5em; font-weight: bold; color: #27ae60; margin-bottom: 10px;">${completedProjects}</div>
        <div style="color: #666; font-size: 1.1em;">已完成</div>
      </div>
      <div style="background: white; padding: 25px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); text-align: center;">
        <div style="font-size: 2.5em; font-weight: bold; color: #f39c12; margin-bottom: 10px;">${planningProjects}</div>
        <div style="color: #666; font-size: 1.1em;">规划中</div>
      </div>
    </div>
    
    <div style="background: white; padding: 25px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); margin-bottom: 30px;">
      <h3 style="margin-top: 0; color: #2c3e50; margin-bottom: 20px;">项目进度概览</h3>
      ${projects.map(project => `
        <div style="display: flex; align-items: center; margin-bottom: 20px; padding: 15px; background: #f8f9fa; border-radius: 6px;">
          <div style="flex: 1; margin-right: 20px;">
            <div style="font-weight: bold; margin-bottom: 5px; color: #2c3e50;">${project.name}</div>
            <div style="color: #666; font-size: 0.9em;">${getStageText(project.currentStage)} - ${getStatusText(project.status)}</div>
          </div>
          <div style="width: 200px;">
            <div style="background: #ecf0f1; height: 20px; border-radius: 10px; overflow: hidden;">
              <div style="background: #3498db; height: 100%; width: ${project.progress}%; transition: width 0.3s ease;"></div>
            </div>
            <div style="text-align: center; margin-top: 8px; font-weight: bold; color: #3498db;">${project.progress}%</div>
          </div>
        </div>
      `).join('')}
    </div>
    
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
      <div style="background: white; padding: 25px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
        <h4 style="margin-top: 0; color: #2c3e50; margin-bottom: 15px;">阶段分布</h4>
        <div style="display: flex; flex-direction: column; gap: 10px;">
          ${['concept', 'plan', 'develop', 'verify', 'release', 'lifecycle'].map(stage => {
            const count = projects.filter(p => p.currentStage === stage).length;
            const percentage = totalProjects > 0 ? Math.round((count / totalProjects) * 100) : 0;
            return `
              <div style="display: flex; align-items: center; justify-content: space-between;">
                <span style="color: #666;">${getStageText(stage)}</span>
                <div style="display: flex; align-items: center; gap: 10px;">
                  <div style="width: 100px; background: #ecf0f1; height: 8px; border-radius: 4px; overflow: hidden;">
                    <div style="background: #3498db; height: 100%; width: ${percentage}%;"></div>
                  </div>
                  <span style="font-weight: bold; color: #2c3e50; min-width: 30px;">${count}</span>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
      
      <div style="background: white; padding: 25px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
        <h4 style="margin-top: 0; color: #2c3e50; margin-bottom: 15px;">团队工作负载</h4>
        <div style="display: flex; flex-direction: column; gap: 10px;">
          ${users.map(user => `
            <div style="display: flex; align-items: center; justify-content: space-between;">
              <span style="color: #666;">${user.name}</span>
              <div style="display: flex; align-items: center; gap: 10px;">
                <div style="width: 100px; background: #ecf0f1; height: 8px; border-radius: 4px; overflow: hidden;">
                  <div style="background: ${user.workload > 80 ? '#e74c3c' : '#27ae60'}; height: 100%; width: ${user.workload}%;"></div>
                </div>
                <span style="font-weight: bold; color: ${user.workload > 80 ? '#e74c3c' : '#27ae60'}; min-width: 40px;">${user.workload}%</span>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;
}// 渲染团队
页面
function renderTeam() {
  const container = document.getElementById('team-board');
  if (!container) return;
  
  const totalUsers = users.length;
  const highWorkload = users.filter(u => u.workload > 80).length;
  const normalWorkload = users.filter(u => u.workload <= 80).length;
  const avgWorkload = Math.round(users.reduce((sum, u) => sum + u.workload, 0) / totalUsers);
  const totalTasks = users.reduce((sum, u) => sum + u.completedTasks, 0);
  
  container.innerHTML = `
    <!-- 团队统计 -->
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 15px; margin-bottom: 25px;">
      <div style="background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); text-align: center;">
        <div style="font-size: 2em; font-weight: bold; color: #3498db; margin-bottom: 8px;">${totalUsers}</div>
        <div style="color: #666; font-size: 0.9em;">团队成员</div>
      </div>
      <div style="background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); text-align: center;">
        <div style="font-size: 2em; font-weight: bold; color: #27ae60; margin-bottom: 8px;">${normalWorkload}</div>
        <div style="color: #666; font-size: 0.9em;">负载正常</div>
      </div>
      <div style="background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); text-align: center;">
        <div style="font-size: 2em; font-weight: bold; color: #e74c3c; margin-bottom: 8px;">${highWorkload}</div>
        <div style="color: #666; font-size: 0.9em;">负载过高</div>
      </div>
      <div style="background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); text-align: center;">
        <div style="font-size: 2em; font-weight: bold; color: #9b59b6; margin-bottom: 8px;">${avgWorkload}%</div>
        <div style="color: #666; font-size: 0.9em;">平均负载</div>
      </div>
      <div style="background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); text-align: center;">
        <div style="font-size: 2em; font-weight: bold; color: #f39c12; margin-bottom: 8px;">${totalTasks}</div>
        <div style="color: #666; font-size: 0.9em;">总完成任务</div>
      </div>
    </div>

    <!-- 团队成员详情 -->
    <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 20px;">
      ${users.map(user => `
        <div style="background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          <div style="display: flex; align-items: center; margin-bottom: 15px;">
            <div style="width: 50px; height: 50px; border-radius: 50%; background: #3498db; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; margin-right: 15px; font-size: 1.2em;">
              ${user.name.charAt(0)}
            </div>
            <div style="flex: 1;">
              <h4 style="margin: 0; color: #2c3e50; font-size: 1.1em;">${user.name}</h4>
              <p style="margin: 5px 0 2px 0; color: #666; font-size: 0.9em;">${user.department}</p>
              <p style="margin: 0; color: #999; font-size: 0.8em;">${user.role}</p>
            </div>
            <div style="text-align: right;">
              <div style="font-size: 0.9em; font-weight: bold; color: ${user.workload > 80 ? '#e74c3c' : '#27ae60'};">${user.workload}%</div>
              <div style="font-size: 0.8em; color: #666;">负载</div>
            </div>
          </div>
          
          <div style="margin-bottom: 15px;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
              <span style="color: #666; font-size: 0.9em;">工作负载</span>
              <span style="font-weight: bold; color: ${user.workload > 80 ? '#e74c3c' : '#27ae60'};">${user.workload}%</span>
            </div>
            <div style="background: #ecf0f1; height: 8px; border-radius: 4px; overflow: hidden;">
              <div style="background: ${user.workload > 80 ? '#e74c3c' : '#27ae60'}; height: 100%; width: ${user.workload}%; transition: width 0.3s ease;"></div>
            </div>
          </div>
          
          <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px; margin-bottom: 15px; text-align: center;">
            <div style="background: #f8f9fa; padding: 10px; border-radius: 4px;">
              <div style="font-weight: bold; color: #3498db; font-size: 1.1em;">${user.completedTasks}</div>
              <div style="color: #666; font-size: 0.8em;">已完成</div>
            </div>
            <div style="background: #f8f9fa; padding: 10px; border-radius: 4px;">
              <div style="font-weight: bold; color: #f39c12; font-size: 1.1em;">${user.ongoingTasks}</div>
              <div style="color: #666; font-size: 0.8em;">进行中</div>
            </div>
            <div style="background: #f8f9fa; padding: 10px; border-radius: 4px;">
              <div style="font-weight: bold; color: #9b59b6; font-size: 1.1em;">${user.projects.length}</div>
              <div style="color: #666; font-size: 0.8em;">参与项目</div>
            </div>
          </div>
          
          <div style="margin-bottom: 15px;">
            <div style="color: #666; font-size: 0.9em; margin-bottom: 8px;">技能标签</div>
            <div style="display: flex; flex-wrap: wrap; gap: 5px;">
              ${user.skills.map(skill => `
                <span style="background: #ecf0f1; color: #2c3e50; padding: 3px 8px; border-radius: 12px; font-size: 0.75em;">${skill}</span>
              `).join('')}
            </div>
          </div>
          
          <div style="display: flex; gap: 8px;">
            <button onclick="alert('查看详情功能开发中')" style="flex: 1; padding: 8px 12px; border: 1px solid #3498db; color: #3498db; background: white; border-radius: 4px; cursor: pointer; font-size: 0.85em;">
              查看详情
            </button>
            <button onclick="alert('分配任务功能开发中')" style="flex: 1; padding: 8px 12px; background: #3498db; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 0.85em;">
              分配任务
            </button>
          </div>
        </div>
      `).join('')}
    </div>
  `;
}// 渲
染阶段管理页面
function renderStages() {
  const container = document.getElementById('stages-container');
  if (!container) return;
  
  container.innerHTML = `
    <div style="background: white; padding: 25px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); margin-bottom: 25px;">
      <h3 style="margin-top: 0; color: #2c3e50; margin-bottom: 20px;">IPD六阶段流程管理</h3>
      <p style="color: #666; margin-bottom: 25px;">集成产品开发(IPD)六阶段流程，确保产品从概念到生命周期管理的全过程质量控制。</p>
      
      <!-- 六阶段流程图 -->
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; overflow-x: auto; padding: 20px 0;">
        ${['concept', 'plan', 'develop', 'verify', 'release', 'lifecycle'].map((stage, index) => {
          const stageNames = {
            concept: '概念',
            plan: '计划', 
            develop: '开发',
            verify: '验证',
            release: '发布',
            lifecycle: '生命周期'
          };
          const projectsInStage = projects.filter(p => p.currentStage === stage).length;
          
          return `
            <div style="display: flex; flex-direction: column; align-items: center; min-width: 120px;">
              <div style="width: 80px; height: 80px; border-radius: 50%; background: #3498db; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 1.2em; margin-bottom: 10px; position: relative;">
                ${index + 1}
                ${projectsInStage > 0 ? `<div style="position: absolute; top: -5px; right: -5px; background: #e74c3c; color: white; border-radius: 50%; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; font-size: 0.8em;">${projectsInStage}</div>` : ''}
              </div>
              <div style="text-align: center;">
                <div style="font-weight: bold; color: #2c3e50; margin-bottom: 5px;">${stageNames[stage]}阶段</div>
                <div style="color: #666; font-size: 0.8em;">${projectsInStage} 个项目</div>
              </div>
              ${index < 5 ? '<div style="position: absolute; right: -60px; top: 40px; color: #bdc3c7; font-size: 1.5em;">→</div>' : ''}
            </div>
            ${index < 5 ? '<div style="flex: 1; height: 2px; background: #bdc3c7; margin: 0 20px; align-self: center;"></div>' : ''}
          `;
        }).join('')}
      </div>
    </div>
    
    <!-- 各阶段项目详情 -->
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px;">
      ${['concept', 'plan', 'develop', 'verify', 'release', 'lifecycle'].map(stage => {
        const stageNames = {
          concept: '概念阶段',
          plan: '计划阶段', 
          develop: '开发阶段',
          verify: '验证阶段',
          release: '发布阶段',
          lifecycle: '生命周期阶段'
        };
        const stageProjects = projects.filter(p => p.currentStage === stage);
        
        return `
          <div style="background: white; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); overflow: hidden;">
            <div style="background: #3498db; color: white; padding: 15px;">
              <h4 style="margin: 0; display: flex; justify-content: space-between; align-items: center;">
                ${stageNames[stage]}
                <span style="background: rgba(255,255,255,0.2); padding: 2px 8px; border-radius: 12px; font-size: 0.8em;">${stageProjects.length}</span>
              </h4>
            </div>
            <div style="padding: 15px;">
              ${stageProjects.length > 0 ? stageProjects.map(project => `
                <div style="padding: 12px; margin-bottom: 10px; background: #f8f9fa; border-radius: 6px; border-left: 4px solid #3498db;">
                  <div style="font-weight: bold; color: #2c3e50; margin-bottom: 5px; font-size: 0.95em;">${project.name}</div>
                  <div style="color: #666; font-size: 0.8em; margin-bottom: 8px;">${getStatusText(project.status)}</div>
                  <div style="display: flex; align-items: center; gap: 10px;">
                    <div style="flex: 1; background: #ecf0f1; height: 6px; border-radius: 3px; overflow: hidden;">
                      <div style="background: #3498db; height: 100%; width: ${project.progress}%;"></div>
                    </div>
                    <span style="font-size: 0.8em; font-weight: bold; color: #3498db;">${project.progress}%</span>
                  </div>
                </div>
              `).join('') : '<div style="text-align: center; color: #999; padding: 20px; font-style: italic;">暂无项目</div>'}
            </div>
          </div>
        `;
      }).join('')}
    </div>
  `;
}/
/ 渲染DCP评审页面
function renderDCP() {
  const container = document.getElementById('dcp-reviews');
  if (!container) return;
  
  const totalReviews = dcpReviews.length;
  const completedReviews = dcpReviews.filter(r => r.status === 'completed').length;
  const pendingReviews = dcpReviews.filter(r => r.status === 'pending').length;
  const inReviewReviews = dcpReviews.filter(r => r.status === 'in_review').length;
  const passRate = completedReviews > 0 ? Math.round((dcpReviews.filter(r => r.result === 'pass').length / completedReviews) * 100) : 0;
  
  container.innerHTML = `
    <!-- DCP评审统计 -->
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 15px; margin-bottom: 25px;">
      <div style="background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); text-align: center;">
        <div style="font-size: 2em; font-weight: bold; color: #3498db; margin-bottom: 8px;">${totalReviews}</div>
        <div style="color: #666; font-size: 0.9em;">总评审数</div>
      </div>
      <div style="background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); text-align: center;">
        <div style="font-size: 2em; font-weight: bold; color: #27ae60; margin-bottom: 8px;">${completedReviews}</div>
        <div style="color: #666; font-size: 0.9em;">已完成</div>
      </div>
      <div style="background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); text-align: center;">
        <div style="font-size: 2em; font-weight: bold; color: #f39c12; margin-bottom: 8px;">${inReviewReviews}</div>
        <div style="color: #666; font-size: 0.9em;">评审中</div>
      </div>
      <div style="background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); text-align: center;">
        <div style="font-size: 2em; font-weight: bold; color: #e74c3c; margin-bottom: 8px;">${pendingReviews}</div>
        <div style="color: #666; font-size: 0.9em;">待处理</div>
      </div>
      <div style="background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); text-align: center;">
        <div style="font-size: 2em; font-weight: bold; color: #9b59b6; margin-bottom: 8px;">${passRate}%</div>
        <div style="color: #666; font-size: 0.9em;">通过率</div>
      </div>
    </div>

    <!-- DCP评审列表 -->
    <div style="background: white; padding: 25px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
      <h3 style="margin-top: 0; color: #2c3e50; margin-bottom: 20px;">DCP评审记录</h3>
      
      ${dcpReviews.length > 0 ? `
        <div style="display: grid; gap: 15px;">
          ${dcpReviews.map(review => {
            const project = projects.find(p => p.id === review.projectId);
            const statusColors = {
              completed: '#27ae60',
              pending: '#e74c3c', 
              in_review: '#f39c12'
            };
            const statusTexts = {
              completed: '已完成',
              pending: '待处理',
              in_review: '评审中'
            };
            const resultColors = {
              pass: '#27ae60',
              fail: '#e74c3c',
              conditional_pass: '#f39c12'
            };
            const resultTexts = {
              pass: '通过',
              fail: '不通过', 
              conditional_pass: '有条件通过'
            };
            
            return `
              <div style="border: 1px solid #e9ecef; border-radius: 6px; padding: 20px; border-left: 4px solid ${statusColors[review.status]};">
                <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 15px;">
                  <div style="flex: 1;">
                    <h4 style="margin: 0 0 8px 0; color: #2c3e50; font-size: 1.1em;">${review.title}</h4>
                    <div style="color: #666; font-size: 0.9em; margin-bottom: 5px;">项目: ${project ? project.name : '未知项目'}</div>
                    <div style="color: #666; font-size: 0.9em;">阶段: ${getStageText(review.stage)}</div>
                  </div>
                  <div style="text-align: right;">
                    <div style="margin-bottom: 8px;">
                      <span style="padding: 4px 12px; background: ${statusColors[review.status]}; color: white; border-radius: 12px; font-size: 0.8em;">
                        ${statusTexts[review.status]}
                      </span>
                    </div>
                    ${review.result ? `
                      <div>
                        <span style="padding: 4px 12px; background: ${resultColors[review.result]}; color: white; border-radius: 12px; font-size: 0.8em;">
                          ${resultTexts[review.result]}
                        </span>
                      </div>
                    ` : ''}
                  </div>
                </div>
                
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 15px; margin-bottom: 15px; font-size: 0.9em;">
                  <div>
                    <span style="color: #666;">评审员数量:</span>
                    <span style="font-weight: bold; color: #2c3e50;">${review.reviewers.length} 人</span>
                  </div>
                  <div>
                    <span style="color: #666;">截止时间:</span>
                    <span style="font-weight: bold; color: #2c3e50;">${review.deadline}</span>
                  </div>
                  <div>
                    <span style="color: #666;">创建时间:</span>
                    <span style="font-weight: bold; color: #2c3e50;">${review.createdAt}</span>
                  </div>
                  ${review.completedAt ? `
                    <div>
                      <span style="color: #666;">完成时间:</span>
                      <span style="font-weight: bold; color: #2c3e50;">${review.completedAt}</span>
                    </div>
                  ` : ''}
                </div>
                
                <div style="display: flex; gap: 10px;">
                  <button onclick="alert('查看详情功能开发中')" style="padding: 8px 16px; border: 1px solid #3498db; color: #3498db; background: white; border-radius: 4px; cursor: pointer; font-size: 0.9em;">
                    查看详情
                  </button>
                  ${review.status === 'pending' ? `
                    <button onclick="alert('开始评审功能开发中')" style="padding: 8px 16px; background: #3498db; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 0.9em;">
                      开始评审
                    </button>
                  ` : ''}
                </div>
              </div>
            `;
          }).join('')}
        </div>
      ` : `
        <div style="text-align: center; color: #999; padding: 40px; font-style: italic;">
          <div style="font-size: 3em; margin-bottom: 15px;">📋</div>
          <div>暂无DCP评审记录</div>
        </div>
      `}
    </div>
  `;
}/
/ 渲染交付物管理页面
function renderDeliverables() {
  const container = document.getElementById('deliverables-list');
  if (!container) return;
  
  const totalDeliverables = deliverables.length;
  const approvedDeliverables = deliverables.filter(d => d.approvalStatus === 'approved').length;
  const pendingDeliverables = deliverables.filter(d => d.approvalStatus === 'pending').length;
  const underReviewDeliverables = deliverables.filter(d => d.approvalStatus === 'under_review').length;
  
  container.innerHTML = `
    <!-- 交付物统计 -->
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 15px; margin-bottom: 25px;">
      <div style="background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); text-align: center;">
        <div style="font-size: 2em; font-weight: bold; color: #3498db; margin-bottom: 8px;">${totalDeliverables}</div>
        <div style="color: #666; font-size: 0.9em;">总交付物</div>
      </div>
      <div style="background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); text-align: center;">
        <div style="font-size: 2em; font-weight: bold; color: #27ae60; margin-bottom: 8px;">${approvedDeliverables}</div>
        <div style="color: #666; font-size: 0.9em;">已批准</div>
      </div>
      <div style="background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); text-align: center;">
        <div style="font-size: 2em; font-weight: bold; color: #f39c12; margin-bottom: 8px;">${underReviewDeliverables}</div>
        <div style="color: #666; font-size: 0.9em;">审核中</div>
      </div>
      <div style="background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); text-align: center;">
        <div style="font-size: 2em; font-weight: bold; color: #e74c3c; margin-bottom: 8px;">${pendingDeliverables}</div>
        <div style="color: #666; font-size: 0.9em;">待审核</div>
      </div>
    </div>

    <!-- 交付物列表 -->
    <div style="background: white; padding: 25px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
        <h3 style="margin: 0; color: #2c3e50;">交付物列表</h3>
        <button onclick="alert('上传交付物功能开发中')" style="padding: 10px 20px; background: #3498db; color: white; border: none; border-radius: 4px; cursor: pointer;">
          上传交付物
        </button>
      </div>
      
      ${deliverables.length > 0 ? `
        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 20px;">
          ${deliverables.map(deliverable => {
            const project = projects.find(p => p.id === deliverable.projectId);
            const uploader = users.find(u => u.id === deliverable.uploadedBy);
            const statusColors = {
              approved: '#27ae60',
              pending: '#e74c3c',
              under_review: '#f39c12'
            };
            const statusTexts = {
              approved: '已批准',
              pending: '待审核',
              under_review: '审核中'
            };
            const typeIcons = {
              document: '📄',
              prototype: '🎨',
              code: '💻',
              design: '🎯'
            };
            
            return `
              <div style="border: 1px solid #e9ecef; border-radius: 8px; padding: 20px; border-left: 4px solid ${statusColors[deliverable.approvalStatus]};">
                <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 15px;">
                  <div style="display: flex; align-items: center; gap: 10px;">
                    <span style="font-size: 1.5em;">${typeIcons[deliverable.type] || '📁'}</span>
                    <div>
                      <h4 style="margin: 0; color: #2c3e50; font-size: 1.1em;">${deliverable.name}</h4>
                      <div style="color: #666; font-size: 0.8em; margin-top: 2px;">v${deliverable.version}</div>
                    </div>
                  </div>
                  <span style="padding: 4px 12px; background: ${statusColors[deliverable.approvalStatus]}; color: white; border-radius: 12px; font-size: 0.8em;">
                    ${statusTexts[deliverable.approvalStatus]}
                  </span>
                </div>
                
                <p style="color: #666; margin-bottom: 15px; font-size: 0.9em; line-height: 1.4;">${deliverable.description}</p>
                
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 15px; font-size: 0.85em;">
                  <div>
                    <span style="color: #666;">项目:</span>
                    <div style="font-weight: bold; color: #2c3e50; margin-top: 2px;">${project ? project.name : '未知项目'}</div>
                  </div>
                  <div>
                    <span style="color: #666;">阶段:</span>
                    <div style="font-weight: bold; color: #2c3e50; margin-top: 2px;">${getStageText(deliverable.stage)}</div>
                  </div>
                  <div>
                    <span style="color: #666;">上传者:</span>
                    <div style="font-weight: bold; color: #2c3e50; margin-top: 2px;">${uploader ? uploader.name : '未知用户'}</div>
                  </div>
                  <div>
                    <span style="color: #666;">文件大小:</span>
                    <div style="font-weight: bold; color: #2c3e50; margin-top: 2px;">${deliverable.fileSize}</div>
                  </div>
                </div>
                
                <div style="color: #999; font-size: 0.8em; margin-bottom: 15px;">
                  上传时间: ${deliverable.uploadedAt}
                </div>
                
                <div style="display: flex; gap: 8px;">
                  <button onclick="alert('下载功能开发中')" style="flex: 1; padding: 8px 12px; border: 1px solid #3498db; color: #3498db; background: white; border-radius: 4px; cursor: pointer; font-size: 0.85em;">
                    下载
                  </button>
                  <button onclick="alert('预览功能开发中')" style="flex: 1; padding: 8px 12px; border: 1px solid #27ae60; color: #27ae60; background: white; border-radius: 4px; cursor: pointer; font-size: 0.85em;">
                    预览
                  </button>
                  ${deliverable.approvalStatus === 'pending' ? `
                    <button onclick="alert('审核功能开发中')" style="flex: 1; padding: 8px 12px; background: #f39c12; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 0.85em;">
                      审核
                    </button>
                  ` : ''}
                </div>
              </div>
            `;
          }).join('')}
        </div>
      ` : `
        <div style="text-align: center; color: #999; padding: 40px; font-style: italic;">
          <div style="font-size: 3em; margin-bottom: 15px;">📁</div>
          <div>暂无交付物</div>
        </div>
      `}
    </div>
  `;
}// 渲染
用户管理页面
function renderUsers() {
  const container = document.getElementById('users-list');
  if (!container) return;
  
  container.innerHTML = `
    <div style="background: white; padding: 25px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px;">
        <h3 style="margin: 0; color: #2c3e50;">用户管理</h3>
        <button onclick="alert('添加用户功能开发中')" style="padding: 10px 20px; background: #3498db; color: white; border: none; border-radius: 4px; cursor: pointer;">
          添加用户
        </button>
      </div>
      
      <div style="overflow-x: auto;">
        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr style="background: #f8f9fa; border-bottom: 2px solid #e9ecef;">
              <th style="padding: 15px; text-align: left; color: #2c3e50; font-weight: bold;">用户</th>
              <th style="padding: 15px; text-align: left; color: #2c3e50; font-weight: bold;">部门</th>
              <th style="padding: 15px; text-align: left; color: #2c3e50; font-weight: bold;">角色</th>
              <th style="padding: 15px; text-align: center; color: #2c3e50; font-weight: bold;">工作负载</th>
              <th style="padding: 15px; text-align: center; color: #2c3e50; font-weight: bold;">任务统计</th>
              <th style="padding: 15px; text-align: center; color: #2c3e50; font-weight: bold;">参与项目</th>
              <th style="padding: 15px; text-align: center; color: #2c3e50; font-weight: bold;">操作</th>
            </tr>
          </thead>
          <tbody>
            ${users.map(user => `
              <tr style="border-bottom: 1px solid #e9ecef;">
                <td style="padding: 15px;">
                  <div style="display: flex; align-items: center; gap: 12px;">
                    <div style="width: 40px; height: 40px; border-radius: 50%; background: #3498db; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold;">
                      ${user.name.charAt(0)}
                    </div>
                    <div>
                      <div style="font-weight: bold; color: #2c3e50;">${user.name}</div>
                      <div style="color: #666; font-size: 0.85em;">${user.email}</div>
                    </div>
                  </div>
                </td>
                <td style="padding: 15px; color: #666;">${user.department}</td>
                <td style="padding: 15px; color: #666;">${user.role}</td>
                <td style="padding: 15px; text-align: center;">
                  <div style="display: flex; flex-direction: column; align-items: center; gap: 5px;">
                    <span style="font-weight: bold; color: ${user.workload > 80 ? '#e74c3c' : '#27ae60'};">${user.workload}%</span>
                    <div style="width: 60px; background: #ecf0f1; height: 6px; border-radius: 3px; overflow: hidden;">
                      <div style="background: ${user.workload > 80 ? '#e74c3c' : '#27ae60'}; height: 100%; width: ${user.workload}%;"></div>
                    </div>
                  </div>
                </td>
                <td style="padding: 15px; text-align: center;">
                  <div style="display: flex; flex-direction: column; gap: 2px;">
                    <span style="color: #27ae60; font-size: 0.9em;">完成: ${user.completedTasks}</span>
                    <span style="color: #f39c12; font-size: 0.9em;">进行: ${user.ongoingTasks}</span>
                  </div>
                </td>
                <td style="padding: 15px; text-align: center;">
                  <span style="font-weight: bold; color: #3498db;">${user.projects.length}</span>
                </td>
                <td style="padding: 15px; text-align: center;">
                  <div style="display: flex; gap: 5px; justify-content: center;">
                    <button onclick="alert('查看详情功能开发中')" style="padding: 6px 12px; border: 1px solid #3498db; color: #3498db; background: white; border-radius: 4px; cursor: pointer; font-size: 0.8em;">
                      详情
                    </button>
                    <button onclick="alert('编辑用户功能开发中')" style="padding: 6px 12px; background: #f39c12; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 0.8em;">
                      编辑
                    </button>
                  </div>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

// 渲染系统设置页面
function renderSettings() {
  const container = document.getElementById('settings-content');
  if (!container) return;
  
  container.innerHTML = `
    <div style="background: white; padding: 25px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
      <h3 style="margin-top: 0; color: #2c3e50; margin-bottom: 25px;">系统设置</h3>
      
      <div style="display: grid; grid-template-columns: 200px 1fr; gap: 30px;">
        <!-- 设置菜单 -->
        <div style="border-right: 1px solid #e9ecef; padding-right: 20px;">
          <div style="display: flex; flex-direction: column; gap: 5px;">
            <button onclick="showSettingsTab('general')" style="padding: 12px 15px; text-align: left; border: none; background: #3498db; color: white; border-radius: 4px; cursor: pointer;">
              基本设置
            </button>
            <button onclick="showSettingsTab('project')" style="padding: 12px 15px; text-align: left; border: none; background: #f8f9fa; color: #666; border-radius: 4px; cursor: pointer;">
              项目设置
            </button>
            <button onclick="showSettingsTab('user')" style="padding: 12px 15px; text-align: left; border: none; background: #f8f9fa; color: #666; border-radius: 4px; cursor: pointer;">
              用户设置
            </button>
            <button onclick="showSettingsTab('notification')" style="padding: 12px 15px; text-align: left; border: none; background: #f8f9fa; color: #666; border-radius: 4px; cursor: pointer;">
              通知设置
            </button>
          </div>
        </div>
        
        <!-- 设置内容 -->
        <div>
          <div id="settings-general" style="display: block;">
            <h4 style="color: #2c3e50; margin-bottom: 20px;">基本设置</h4>
            <div style="display: flex; flex-direction: column; gap: 20px;">
              <div>
                <label style="display: block; margin-bottom: 8px; color: #666; font-weight: bold;">系统名称</label>
                <input type="text" value="IPD项目协作系统" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 4px;">
              </div>
              <div>
                <label style="display: block; margin-bottom: 8px; color: #666; font-weight: bold;">系统描述</label>
                <textarea style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 4px; height: 80px;">集成产品开发(IPD)项目协作管理系统</textarea>
              </div>
              <div>
                <label style="display: block; margin-bottom: 8px; color: #666; font-weight: bold;">时区设置</label>
                <select style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 4px;">
                  <option>Asia/Shanghai (UTC+8)</option>
                  <option>Asia/Tokyo (UTC+9)</option>
                  <option>America/New_York (UTC-5)</option>
                </select>
              </div>
            </div>
          </div>
          
          <div id="settings-project" style="display: none;">
            <h4 style="color: #2c3e50; margin-bottom: 20px;">项目设置</h4>
            <p style="color: #666;">项目相关设置功能开发中...</p>
          </div>
          
          <div id="settings-user" style="display: none;">
            <h4 style="color: #2c3e50; margin-bottom: 20px;">用户设置</h4>
            <p style="color: #666;">用户相关设置功能开发中...</p>
          </div>
          
          <div id="settings-notification" style="display: none;">
            <h4 style="color: #2c3e50; margin-bottom: 20px;">通知设置</h4>
            <p style="color: #666;">通知相关设置功能开发中...</p>
          </div>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e9ecef;">
            <div style="display: flex; gap: 10px;">
              <button onclick="alert('设置已保存')" style="padding: 10px 20px; background: #27ae60; color: white; border: none; border-radius: 4px; cursor: pointer;">
                保存设置
              </button>
              <button onclick="alert('设置已重置')" style="padding: 10px 20px; background: #95a5a6; color: white; border: none; border-radius: 4px; cursor: pointer;">
                重置
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}// 设置页面标签切
换
function showSettingsTab(tabName) {
  // 隐藏所有标签内容
  const contents = document.querySelectorAll('[id^="settings-"]');
  contents.forEach(content => content.style.display = 'none');

  // 重置所有按钮样式
  const buttons = document.querySelectorAll('[onclick^="showSettingsTab"]');
  buttons.forEach(btn => {
    btn.style.background = '#f8f9fa';
    btn.style.color = '#666';
  });

  // 显示目标标签内容
  const targetContent = document.getElementById(`settings-${tabName}`);
  if (targetContent) {
    targetContent.style.display = 'block';
  }

  // 激活对应按钮
  event.target.style.background = '#3498db';
  event.target.style.color = 'white';
}

// 渲染占位页面
function renderPlaceholder(pageName) {
  const container = document.getElementById(pageName + '-page');
  if (!container) return;
  
  const pageNames = {
    'project-detail': '项目详情'
  };
  
  container.innerHTML = `
    <div style="text-align: center; padding: 60px;">
      <div style="font-size: 4em; margin-bottom: 20px;">🚧</div>
      <h2 style="color: #666; margin-bottom: 10px;">${pageNames[pageName] || pageName} 页面</h2>
      <p style="color: #999;">功能开发中，敬请期待...</p>
    </div>
  `;
}

// 辅助函数
function getStatusColor(status) {
  const colors = {
    'not_started': '#bdc3c7',
    'planning': '#f39c12',
    'in_progress': '#3498db',
    'completed': '#27ae60',
    'blocked': '#e74c3c'
  };
  return colors[status] || '#bdc3c7';
}

function getStatusText(status) {
  const texts = {
    'not_started': '未开始',
    'planning': '规划中',
    'in_progress': '进行中',
    'completed': '已完成',
    'blocked': '已阻塞'
  };
  return texts[status] || '未知状态';
}

function getStageText(stage) {
  const stages = {
    'concept': '概念阶段',
    'plan': '计划阶段',
    'develop': '开发阶段',
    'verify': '验证阶段',
    'release': '发布阶段',
    'lifecycle': '生命周期阶段'
  };
  return stages[stage] || '未知阶段';
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
  console.log('IPD项目协作系统加载完成');
  initData();
  showPage('overview');
});

// 导出全局函数
window.showPage = showPage;
window.viewProject = viewProject;
window.goBack = goBack;
window.showSettingsTab = showSettingsTab;