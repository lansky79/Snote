// 团队协作组件 - 处理跨职能团队协作

// 渲染团队协作页面
function renderTeamBoard() {
  const container = document.getElementById("team-board");
  if (!container) return;

  container.innerHTML = `
    <div class="team-overview">
      <div class="team-stats">
        <div class="stat-card">
          <h3>团队成员</h3>
          <div class="stat-number">${users.length}</div>
          <div class="stat-label">总人数</div>
        </div>
        <div class="stat-card">
          <h3>活跃项目</h3>
          <div class="stat-number">${
            projects.filter((p) => p.status === "in_progress").length
          }</div>
          <div class="stat-label">进行中</div>
        </div>
        <div class="stat-card">
          <h3>待办任务</h3>
          <div class="stat-number">${users.reduce(
            (sum, user) => sum + user.ongoingTasks,
            0
          )}</div>
          <div class="stat-label">总任务数</div>
        </div>
        <div class="stat-card">
          <h3>平均工作量</h3>
          <div class="stat-number">${Math.round(
            users.reduce((sum, user) => sum + user.workload, 0) / users.length
          )}%</div>
          <div class="stat-label">负载率</div>
        </div>
      </div>
    </div>

    <div class="team-tabs">
      <button class="tab-btn active" onclick="showTeamTab('members')">团队成员</button>
      <button class="tab-btn" onclick="showTeamTab('departments')">部门视图</button>
      <button class="tab-btn" onclick="showTeamTab('workload')">工作负载</button>
      <button class="tab-btn" onclick="showTeamTab('collaboration')">协作看板</button>
    </div>

    <div id="team-members" class="team-tab-content active">
      <div class="team-actions">
        <button class="btn-primary" onclick="showAddMemberModal()">添加成员</button>
        <button class="btn-secondary" onclick="exportTeamData()">导出数据</button>
      </div>
      <div class="team-grid">
        ${renderTeamMembers()}
      </div>
    </div>

    <div id="team-departments" class="team-tab-content">
      <div class="departments-grid">
        ${renderDepartments()}
      </div>
    </div>

    <div id="team-workload" class="team-tab-content">
      <div class="workload-chart">
        ${renderWorkloadChart()}
      </div>
    </div>

    <div id="team-collaboration" class="team-tab-content">
      <div class="collaboration-board">
        ${renderCollaborationBoard()}
      </div>
    </div>
  `;
}

// 渲染团队成员列表
function renderTeamMembers() {
  return users
    .map(
      (user) => `
    <div class="member-card">
      <div class="member-avatar">
        <img src="${user.avatar}" alt="${
        user.name
      }" onerror="this.src='/images/default-avatar.png'">
        <div class="member-status ${user.status}"></div>
      </div>
      <div class="member-info">
        <h4>${user.name}</h4>
        <p class="member-role">${getRoleText(user.role)}</p>
        <p class="member-department">${user.department}</p>
        <p class="member-function">${user.function}</p>
      </div>
      <div class="member-stats">
        <div class="stat-item">
          <span class="stat-label">工作负载</span>
          <div class="progress-bar small">
            <div class="progress-fill" style="width: ${user.workload}%"></div>
          </div>
          <span class="stat-value">${user.workload}%</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">完成任务</span>
          <span class="stat-value">${user.completedTasks}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">进行中</span>
          <span class="stat-value">${user.ongoingTasks}</span>
        </div>
      </div>
      <div class="member-skills">
        ${user.skills
          .map((skill) => `<span class="skill-tag">${skill}</span>`)
          .join("")}
      </div>
      <div class="member-projects">
        <strong>参与项目:</strong>
        ${user.projects
          .map((projId) => {
            const project = projects.find((p) => p.id === projId);
            return project
              ? `<span class="project-tag">${project.name}</span>`
              : "";
          })
          .join("")}
      </div>
      <div class="member-actions">
        <button class="btn-small" onclick="viewMemberDetails('${
          user.id
        }')">详情</button>
        <button class="btn-small" onclick="assignTask('${
          user.id
        }')">分配任务</button>
        <button class="btn-small" onclick="sendMessage('${
          user.id
        }')">发消息</button>
      </div>
    </div>
  `
    )
    .join("");
}

// 渲染部门视图
function renderDepartments() {
  // 模拟部门数据
  const departments = [
    {
      id: "rd",
      name: "产品研发部",
      members: users.filter((u) => u.department === "产品研发部"),
    },
    {
      id: "market",
      name: "市场部",
      members: users.filter((u) => u.department === "市场部"),
    },
    {
      id: "tech",
      name: "技术部",
      members: users.filter((u) => u.department === "技术部"),
    },
    {
      id: "hardware",
      name: "硬件部",
      members: users.filter((u) => u.department === "硬件部"),
    },
    {
      id: "software",
      name: "软件部",
      members: users.filter((u) => u.department === "软件部"),
    },
    {
      id: "quality",
      name: "质量部",
      members: users.filter((u) => u.department === "质量部"),
    },
    {
      id: "it",
      name: "IT部",
      members: users.filter((u) => u.department === "IT部"),
    },
  ];

  return departments
    .map(
      (dept) => `
    <div class="department-card">
      <div class="department-header">
        <h3>${dept.name}</h3>
        <span class="member-count">${dept.members.length}人</span>
      </div>
      <div class="department-members">
        ${dept.members
          .map(
            (member) => `
          <div class="mini-member-card">
            <img src="${member.avatar}" alt="${member.name}" onerror="this.src='/images/default-avatar.png'">
            <div class="mini-member-info">
              <span class="mini-member-name">${member.name}</span>
              <span class="mini-member-function">${member.function}</span>
              <div class="mini-workload">
                <div class="progress-bar mini">
                  <div class="progress-fill" style="width: ${member.workload}%"></div>
                </div>
                <span>${member.workload}%</span>
              </div>
            </div>
          </div>
        `
          )
          .join("")}
      </div>
      <div class="department-stats">
        <div class="dept-stat">
          <span>平均负载</span>
          <span>${
            dept.members.length > 0
              ? Math.round(
                  dept.members.reduce((sum, m) => sum + m.workload, 0) /
                    dept.members.length
                )
              : 0
          }%</span>
        </div>
        <div class="dept-stat">
          <span>总任务数</span>
          <span>${dept.members.reduce(
            (sum, m) => sum + m.ongoingTasks,
            0
          )}</span>
        </div>
      </div>
    </div>
  `
    )
    .join("");
}

// 渲染工作负载图表
function renderWorkloadChart() {
  const sortedUsers = [...users].sort((a, b) => b.workload - a.workload);

  return `
    <div class="workload-header">
      <h3>团队工作负载分析</h3>
      <div class="workload-legend">
        <span class="legend-item high">高负载 (>80%)</span>
        <span class="legend-item medium">中等负载 (50-80%)</span>
        <span class="legend-item low">低负载 (<50%)</span>
      </div>
    </div>
    <div class="workload-bars">
      ${sortedUsers
        .map((user) => {
          let loadClass = "low";
          if (user.workload > 80) loadClass = "high";
          else if (user.workload > 50) loadClass = "medium";

          return `
          <div class="workload-bar-item">
            <div class="workload-user-info">
              <img src="${user.avatar}" alt="${user.name}" onerror="this.src='/images/default-avatar.png'">
              <div>
                <span class="workload-user-name">${user.name}</span>
                <span class="workload-user-dept">${user.department}</span>
              </div>
            </div>
            <div class="workload-bar-container">
              <div class="workload-bar ${loadClass}" style="width: ${user.workload}%"></div>
              <span class="workload-percentage">${user.workload}%</span>
            </div>
            <div class="workload-tasks">
              <span>进行中: ${user.ongoingTasks}</span>
              <span>已完成: ${user.completedTasks}</span>
            </div>
          </div>
        `;
        })
        .join("")}
    </div>
  `;
}

// 渲染协作看板
function renderCollaborationBoard() {
  return `
    <div class="collaboration-header">
      <h3>跨职能协作看板</h3>
      <div class="board-filters">
        <select onchange="filterCollaborationBoard(this.value)">
          <option value="all">所有项目</option>
          ${projects
            .map((p) => `<option value="${p.id}">${p.name}</option>`)
            .join("")}
        </select>
      </div>
    </div>
    <div class="kanban-board">
      <div class="kanban-column">
        <div class="kanban-header">
          <h4>待开始</h4>
          <span class="task-count">3</span>
        </div>
        <div class="kanban-tasks">
          <div class="kanban-task">
            <div class="task-title">用户界面优化</div>
            <div class="task-project">智能手机产品开发</div>
            <div class="task-assignee">
              <img src="/images/avatars/user_005.jpg" alt="刘洋" onerror="this.src='/images/default-avatar.png'">
              <span>刘洋</span>
            </div>
            <div class="task-priority low">低优先级</div>
          </div>
          <div class="kanban-task">
            <div class="task-title">系统集成测试</div>
            <div class="task-project">智能手机产品开发</div>
            <div class="task-assignee">
              <img src="/images/avatars/user_003.jpg" alt="王强" onerror="this.src='/images/default-avatar.png'">
              <span>王强</span>
            </div>
            <div class="task-priority medium">中优先级</div>
          </div>
        </div>
      </div>
      
      <div class="kanban-column">
        <div class="kanban-header">
          <h4>进行中</h4>
          <span class="task-count">4</span>
        </div>
        <div class="kanban-tasks">
          <div class="kanban-task">
            <div class="task-title">硬件设计开发</div>
            <div class="task-project">智能手机产品开发</div>
            <div class="task-assignee">
              <img src="/images/avatars/user_004.jpg" alt="赵敏" onerror="this.src='/images/default-avatar.png'">
              <span>赵敏</span>
            </div>
            <div class="task-priority high">高优先级</div>
            <div class="task-progress">
              <div class="progress-bar mini">
                <div class="progress-fill" style="width: 70%"></div>
              </div>
              <span>70%</span>
            </div>
          </div>
          <div class="kanban-task">
            <div class="task-title">软件系统开发</div>
            <div class="task-project">智能手机产品开发</div>
            <div class="task-assignee">
              <img src="/images/avatars/user_005.jpg" alt="刘洋" onerror="this.src='/images/default-avatar.png'">
              <span>刘洋</span>
            </div>
            <div class="task-priority high">高优先级</div>
            <div class="task-progress">
              <div class="progress-bar mini">
                <div class="progress-fill" style="width: 60%"></div>
              </div>
              <span>60%</span>
            </div>
          </div>
          <div class="kanban-task">
            <div class="task-title">客户需求调研</div>
            <div class="task-project">企业管理软件系统</div>
            <div class="task-assignee">
              <img src="/images/avatars/user_007.jpg" alt="孙磊" onerror="this.src='/images/default-avatar.png'">
              <span>孙磊</span>
            </div>
            <div class="task-priority medium">中优先级</div>
            <div class="task-progress">
              <div class="progress-bar mini">
                <div class="progress-fill" style="width: 30%"></div>
              </div>
              <span>30%</span>
            </div>
          </div>
        </div>
      </div>
      
      <div class="kanban-column">
        <div class="kanban-header">
          <h4>已完成</h4>
          <span class="task-count">5</span>
        </div>
        <div class="kanban-tasks">
          <div class="kanban-task completed">
            <div class="task-title">市场需求分析</div>
            <div class="task-project">智能手机产品开发</div>
            <div class="task-assignee">
              <img src="/images/avatars/user_002.jpg" alt="李华" onerror="this.src='/images/default-avatar.png'">
              <span>李华</span>
            </div>
            <div class="task-completed-date">完成于: 2024-01-22</div>
          </div>
          <div class="kanban-task completed">
            <div class="task-title">技术可行性评估</div>
            <div class="task-project">智能手机产品开发</div>
            <div class="task-assignee">
              <img src="/images/avatars/user_003.jpg" alt="王强" onerror="this.src='/images/default-avatar.png'">
              <span>王强</span>
            </div>
            <div class="task-completed-date">完成于: 2024-01-28</div>
          </div>
          <div class="kanban-task completed">
            <div class="task-title">项目计划制定</div>
            <div class="task-project">智能手机产品开发</div>
            <div class="task-assignee">
              <img src="/images/avatars/user_001.jpg" alt="张明" onerror="this.src='/images/default-avatar.png'">
              <span>张明</span>
            </div>
            <div class="task-completed-date">完成于: 2024-02-12</div>
          </div>
        </div>
      </div>
    </div>
  `;
}

// 切换团队标签页
function showTeamTab(tabName) {
  // 隐藏所有标签内容
  const tabs = document.querySelectorAll(".team-tab-content");
  tabs.forEach((tab) => tab.classList.remove("active"));

  // 移除所有按钮的active状态
  const buttons = document.querySelectorAll(".tab-btn");
  buttons.forEach((btn) => btn.classList.remove("active"));

  // 显示目标标签内容
  const targetTab = document.getElementById(`team-${tabName}`);
  if (targetTab) {
    targetTab.classList.add("active");
  }

  // 激活对应按钮
  event.target.classList.add("active");
}

// 获取角色文本
function getRoleText(role) {
  const roleMap = {
    admin: "系统管理员",
    project_manager: "项目经理",
    team_member: "团队成员",
    reviewer: "评审员",
  };
  return roleMap[role] || role;
}

// 团队成员操作函数
function viewMemberDetails(userId) {
  const user = users.find((u) => u.id === userId);
  if (!user) return;

  const modalContent = `
    <h3>成员详情 - ${user.name}</h3>
    <div class="member-detail-content">
      <div class="member-detail-basic">
        <img src="${user.avatar}" alt="${
    user.name
  }" onerror="this.src='/images/default-avatar.png'">
        <div class="member-detail-info">
          <p><strong>姓名:</strong> ${user.name}</p>
          <p><strong>邮箱:</strong> ${user.email}</p>
          <p><strong>电话:</strong> ${user.phone}</p>
          <p><strong>部门:</strong> ${user.department}</p>
          <p><strong>职能:</strong> ${user.function}</p>
          <p><strong>角色:</strong> ${getRoleText(user.role)}</p>
          <p><strong>入职时间:</strong> ${user.joinDate}</p>
        </div>
      </div>
      <div class="member-detail-stats">
        <h4>工作统计</h4>
        <p><strong>当前工作负载:</strong> ${user.workload}%</p>
        <p><strong>已完成任务:</strong> ${user.completedTasks}</p>
        <p><strong>进行中任务:</strong> ${user.ongoingTasks}</p>
      </div>
      <div class="member-detail-skills">
        <h4>技能标签</h4>
        <div class="skills-list">
          ${user.skills
            .map((skill) => `<span class="skill-tag">${skill}</span>`)
            .join("")}
        </div>
      </div>
      <div class="member-detail-projects">
        <h4>参与项目</h4>
        <div class="projects-list">
          ${user.projects
            .map((projId) => {
              const project = projects.find((p) => p.id === projId);
              return project
                ? `<span class="project-tag">${project.name}</span>`
                : "";
            })
            .join("")}
        </div>
      </div>
    </div>
  `;

  showModal(modalContent);
}

function assignTask(userId) {
  const user = users.find((u) => u.id === userId);
  if (!user) return;

  const modalContent = `
    <h3>分配任务给 ${user.name}</h3>
    <form class="assign-task-form">
      <div class="form-group">
        <label>选择项目:</label>
        <select id="task-project" required>
          <option value="">请选择项目</option>
          ${projects
            .map((p) => `<option value="${p.id}">${p.name}</option>`)
            .join("")}
        </select>
      </div>
      <div class="form-group">
        <label>任务名称:</label>
        <input type="text" id="task-name" required placeholder="请输入任务名称">
      </div>
      <div class="form-group">
        <label>任务描述:</label>
        <textarea id="task-description" rows="3" placeholder="请输入任务描述"></textarea>
      </div>
      <div class="form-group">
        <label>优先级:</label>
        <select id="task-priority">
          <option value="low">低</option>
          <option value="medium" selected>中</option>
          <option value="high">高</option>
        </select>
      </div>
      <div class="form-group">
        <label>预计工时:</label>
        <input type="number" id="task-hours" min="1" placeholder="小时">
      </div>
      <div class="form-group">
        <label>截止日期:</label>
        <input type="date" id="task-deadline">
      </div>
      <div class="form-actions">
        <button type="button" class="btn-primary" onclick="submitTaskAssignment('${userId}')">分配任务</button>
        <button type="button" class="btn-secondary" onclick="closeModal()">取消</button>
      </div>
    </form>
  `;

  showModal(modalContent);
}

function sendMessage(userId) {
  const user = users.find((u) => u.id === userId);
  if (!user) return;

  const modalContent = `
    <h3>发送消息给 ${user.name}</h3>
    <form class="send-message-form">
      <div class="form-group">
        <label>消息主题:</label>
        <input type="text" id="message-subject" required placeholder="请输入消息主题">
      </div>
      <div class="form-group">
        <label>消息内容:</label>
        <textarea id="message-content" rows="5" required placeholder="请输入消息内容"></textarea>
      </div>
      <div class="form-group">
        <label>优先级:</label>
        <select id="message-priority">
          <option value="normal" selected>普通</option>
          <option value="urgent">紧急</option>
        </select>
      </div>
      <div class="form-actions">
        <button type="button" class="btn-primary" onclick="submitMessage('${userId}')">发送消息</button>
        <button type="button" class="btn-secondary" onclick="closeModal()">取消</button>
      </div>
    </form>
  `;

  showModal(modalContent);
}

function showAddMemberModal() {
  const modalContent = `
    <h3>添加团队成员</h3>
    <form class="add-member-form">
      <div class="form-group">
        <label>姓名:</label>
        <input type="text" id="member-name" required placeholder="请输入姓名">
      </div>
      <div class="form-group">
        <label>邮箱:</label>
        <input type="email" id="member-email" required placeholder="请输入邮箱">
      </div>
      <div class="form-group">
        <label>电话:</label>
        <input type="tel" id="member-phone" placeholder="请输入电话">
      </div>
      <div class="form-group">
        <label>部门:</label>
        <select id="member-department" required>
          <option value="">请选择部门</option>
          <option value="产品研发部">产品研发部</option>
          <option value="市场部">市场部</option>
          <option value="技术部">技术部</option>
          <option value="硬件部">硬件部</option>
          <option value="软件部">软件部</option>
          <option value="质量部">质量部</option>
          <option value="IT部">IT部</option>
        </select>
      </div>
      <div class="form-group">
        <label>职能:</label>
        <input type="text" id="member-function" required placeholder="请输入职能">
      </div>
      <div class="form-group">
        <label>角色:</label>
        <select id="member-role" required>
          <option value="">请选择角色</option>
          <option value="team_member">团队成员</option>
          <option value="project_manager">项目经理</option>
          <option value="reviewer">评审员</option>
          <option value="admin">系统管理员</option>
        </select>
      </div>
      <div class="form-group">
        <label>技能标签 (用逗号分隔):</label>
        <input type="text" id="member-skills" placeholder="例如: JavaScript, 项目管理, 数据分析">
      </div>
      <div class="form-actions">
        <button type="button" class="btn-primary" onclick="submitAddMember()">添加成员</button>
        <button type="button" class="btn-secondary" onclick="closeModal()">取消</button>
      </div>
    </form>
  `;

  showModal(modalContent);
}

// 提交任务分配
function submitTaskAssignment(userId) {
  const projectId = document.getElementById("task-project").value;
  const taskName = document.getElementById("task-name").value;
  const taskDescription = document.getElementById("task-description").value;
  const priority = document.getElementById("task-priority").value;
  const hours = document.getElementById("task-hours").value;
  const deadline = document.getElementById("task-deadline").value;

  if (!projectId || !taskName) {
    alert("请填写必填项");
    return;
  }

  // 这里应该调用API创建任务
  console.log("分配任务:", {
    userId,
    projectId,
    taskName,
    taskDescription,
    priority,
    hours,
    deadline,
  });

  alert("任务分配成功！");
  closeModal();
}

// 提交消息发送
function submitMessage(userId) {
  const subject = document.getElementById("message-subject").value;
  const content = document.getElementById("message-content").value;
  const priority = document.getElementById("message-priority").value;

  if (!subject || !content) {
    alert("请填写必填项");
    return;
  }

  // 这里应该调用API发送消息
  console.log("发送消息:", { userId, subject, content, priority });

  alert("消息发送成功！");
  closeModal();
}

// 提交添加成员
function submitAddMember() {
  const name = document.getElementById("member-name").value;
  const email = document.getElementById("member-email").value;
  const phone = document.getElementById("member-phone").value;
  const department = document.getElementById("member-department").value;
  const func = document.getElementById("member-function").value;
  const role = document.getElementById("member-role").value;
  const skills = document.getElementById("member-skills").value;

  if (!name || !email || !department || !func || !role) {
    alert("请填写必填项");
    return;
  }

  // 这里应该调用API添加成员
  console.log("添加成员:", {
    name,
    email,
    phone,
    department,
    function: func,
    role,
    skills: skills
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s),
  });

  alert("成员添加成功！");
  closeModal();
}

// 导出团队数据
function exportTeamData() {
  const data = {
    exportTime: new Date().toISOString(),
    teamMembers: users,
    projects: projects,
    summary: {
      totalMembers: users.length,
      activeProjects: projects.filter((p) => p.status === "in_progress").length,
      averageWorkload: Math.round(
        users.reduce((sum, user) => sum + user.workload, 0) / users.length
      ),
    },
  };

  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `team_data_${new Date().toISOString().split("T")[0]}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// 过滤协作看板
function filterCollaborationBoard(projectId) {
  // 这里应该根据项目ID过滤任务
  console.log("过滤协作看板:", projectId);
  // 重新渲染看板内容
}

console.log("团队协作组件已加载");
