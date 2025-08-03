// 修复用户管理页面显示问题

// 简化的用户管理页面渲染函数
function renderUsersListFixed() {
  const container = document.getElementById("users-list");
  if (!container) {
    console.error("找不到users-list容器");
    return;
  }

  console.log("开始渲染用户列表，用户数量:", users.length);

  if (users.length === 0) {
    container.innerHTML = `
      <div class="empty-state" style="text-align: center; padding: 40px;">
        <div class="empty-state-icon" style="font-size: 3em; margin-bottom: 20px;">👤</div>
        <div class="empty-state-text" style="font-size: 1.2em; color: #666; margin-bottom: 20px;">暂无用户数据</div>
        <button onclick="createUser()" class="btn-primary">创建第一个用户</button>
      </div>
    `;
    return;
  }

  container.innerHTML = `
    <div class="users-header" style="margin-bottom: 20px;">
      <div class="users-stats" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin-bottom: 20px;">
        <div class="stat-card" style="background: white; padding: 15px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); text-align: center;">
          <div class="stat-number" style="font-size: 2em; font-weight: bold; color: #3498db;">${
            users.length
          }</div>
          <div class="stat-label" style="color: #666;">总用户数</div>
        </div>
        <div class="stat-card" style="background: white; padding: 15px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); text-align: center;">
          <div class="stat-number" style="font-size: 2em; font-weight: bold; color: #2ecc71;">${
            users.filter((u) => u.status === "active").length
          }</div>
          <div class="stat-label" style="color: #666;">活跃用户</div>
        </div>
        <div class="stat-card" style="background: white; padding: 15px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); text-align: center;">
          <div class="stat-number" style="font-size: 2em; font-weight: bold; color: #9b59b6;">${
            users.filter((u) => u.role === "project_manager").length
          }</div>
          <div class="stat-label" style="color: #666;">项目经理</div>
        </div>
        <div class="stat-card" style="background: white; padding: 15px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); text-align: center;">
          <div class="stat-number" style="font-size: 2em; font-weight: bold; color: #e74c3c;">${
            users.filter((u) => u.role === "admin").length
          }</div>
          <div class="stat-label" style="color: #666;">管理员</div>
        </div>
      </div>
      
      <div class="users-filters" style="display: flex; gap: 15px; align-items: center;">
        <select id="role-filter" onchange="filterUsers()" style="padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
          <option value="">所有角色</option>
          <option value="admin">系统管理员</option>
          <option value="project_manager">项目经理</option>
          <option value="team_member">团队成员</option>
          <option value="reviewer">评审员</option>
        </select>
        <select id="department-filter" onchange="filterUsers()" style="padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
          <option value="">所有部门</option>
          <option value="产品研发部">产品研发部</option>
          <option value="市场部">市场部</option>
          <option value="技术部">技术部</option>
          <option value="硬件部">硬件部</option>
          <option value="软件部">软件部</option>
          <option value="质量部">质量部</option>
          <option value="IT部">IT部</option>
        </select>
        <input type="text" id="search-users" placeholder="搜索用户..." onkeyup="searchUsers()" style="padding: 8px; border: 1px solid #ddd; border-radius: 4px; flex: 1;">
      </div>
    </div>

    <div class="users-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(350px, 1fr)); gap: 20px;">
      ${users
        .map(
          (user) => `
        <div class="user-card" style="background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);" data-role="${
          user.role
        }" data-department="${user.department}">
          <div class="user-header" style="display: flex; align-items: center; margin-bottom: 15px;">
            <div class="user-avatar" style="width: 50px; height: 50px; border-radius: 50%; background: #3498db; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; margin-right: 15px;">
              ${user.name.charAt(0)}
            </div>
            <div class="user-info">
              <h4 style="margin: 0; color: #333;">${user.name}</h4>
              <p style="margin: 5px 0 0 0; color: #666; font-size: 0.9em;">${getRoleText(
                user.role
              )}</p>
            </div>
            <div class="user-status" style="margin-left: auto;">
              <span class="status-badge ${
                user.status
              }" style="padding: 4px 8px; border-radius: 12px; font-size: 0.8em; background: ${
            user.status === "active" ? "#2ecc71" : "#95a5a6"
          }; color: white;">
                ${user.status === "active" ? "活跃" : "非活跃"}
              </span>
            </div>
          </div>
          
          <div class="user-details" style="margin-bottom: 15px;">
            <div class="detail-row" style="display: flex; justify-content: space-between; margin-bottom: 8px;">
              <span style="color: #666;">邮箱:</span>
              <span style="color: #333;">${user.email}</span>
            </div>
            <div class="detail-row" style="display: flex; justify-content: space-between; margin-bottom: 8px;">
              <span style="color: #666;">部门:</span>
              <span style="color: #333;">${user.department}</span>
            </div>
            <div class="detail-row" style="display: flex; justify-content: space-between; margin-bottom: 8px;">
              <span style="color: #666;">职能:</span>
              <span style="color: #333;">${user.function}</span>
            </div>
            <div class="detail-row" style="display: flex; justify-content: space-between; margin-bottom: 8px;">
              <span style="color: #666;">电话:</span>
              <span style="color: #333;">${user.phone}</span>
            </div>
          </div>

          <div class="user-workload" style="margin-bottom: 15px;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
              <span style="color: #666;">工作负载:</span>
              <span style="color: #333;">${user.workload}%</span>
            </div>
            <div class="progress-bar" style="background: #f0f0f0; height: 8px; border-radius: 4px; overflow: hidden;">
              <div class="progress-fill" style="background: ${
                user.workload > 80
                  ? "#e74c3c"
                  : user.workload > 60
                  ? "#f39c12"
                  : "#2ecc71"
              }; height: 100%; width: ${
            user.workload
          }%; transition: width 0.3s ease;"></div>
            </div>
          </div>

          <div class="user-tasks" style="display: flex; justify-content: space-between; margin-bottom: 15px;">
            <div style="text-align: center;">
              <div style="font-weight: bold; color: #3498db;">${
                user.completedTasks
              }</div>
              <div style="font-size: 0.8em; color: #666;">已完成</div>
            </div>
            <div style="text-align: center;">
              <div style="font-weight: bold; color: #f39c12;">${
                user.ongoingTasks
              }</div>
              <div style="font-size: 0.8em; color: #666;">进行中</div>
            </div>
            <div style="text-align: center;">
              <div style="font-weight: bold; color: #9b59b6;">${
                user.projects ? user.projects.length : 0
              }</div>
              <div style="font-size: 0.8em; color: #666;">参与项目</div>
            </div>
          </div>

          <div class="user-skills" style="margin-bottom: 15px;">
            <div style="margin-bottom: 5px; color: #666; font-size: 0.9em;">技能标签:</div>
            <div class="skills-list" style="display: flex; flex-wrap: wrap; gap: 5px;">
              ${user.skills
                .map(
                  (skill) => `
                <span class="skill-tag" style="background: #ecf0f1; color: #2c3e50; padding: 2px 8px; border-radius: 12px; font-size: 0.8em;">${skill}</span>
              `
                )
                .join("")}
            </div>
          </div>

          <div class="user-actions" style="display: flex; gap: 10px;">
            <button onclick="viewUserDetails('${
              user.id
            }')" class="btn-small" style="padding: 6px 12px; border: 1px solid #3498db; color: #3498db; background: white; border-radius: 4px; cursor: pointer;">详情</button>
            <button onclick="editUser('${
              user.id
            }')" class="btn-small" style="padding: 6px 12px; border: 1px solid #2ecc71; color: #2ecc71; background: white; border-radius: 4px; cursor: pointer;">编辑</button>
            <button onclick="assignTaskToUser('${
              user.id
            }')" class="btn-small" style="padding: 6px 12px; border: 1px solid #f39c12; color: #f39c12; background: white; border-radius: 4px; cursor: pointer;">分配任务</button>
          </div>
        </div>
      `
        )
        .join("")}
    </div>
  `;

  console.log("用户列表渲染完成");
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

// 筛选用户
function filterUsers() {
  const roleFilter = document.getElementById("role-filter").value;
  const departmentFilter = document.getElementById("department-filter").value;
  const searchTerm = document
    .getElementById("search-users")
    .value.toLowerCase();

  const userCards = document.querySelectorAll(".user-card");

  userCards.forEach((card) => {
    const role = card.getAttribute("data-role");
    const department = card.getAttribute("data-department");
    const userName = card.querySelector("h4").textContent.toLowerCase();

    const matchRole = !roleFilter || role === roleFilter;
    const matchDepartment =
      !departmentFilter || department === departmentFilter;
    const matchSearch = !searchTerm || userName.includes(searchTerm);

    if (matchRole && matchDepartment && matchSearch) {
      card.style.display = "block";
    } else {
      card.style.display = "none";
    }
  });
}

// 搜索用户
function searchUsers() {
  filterUsers();
}

// 用户操作函数
function viewUserDetails(userId) {
  const user = users.find((u) => u.id === userId);
  if (!user) return;

  alert(
    `用户详情:\n姓名: ${user.name}\n邮箱: ${user.email}\n部门: ${user.department}\n职能: ${user.function}`
  );
}

function editUser(userId) {
  alert(`编辑用户功能开发中... 用户ID: ${userId}`);
}

function assignTaskToUser(userId) {
  alert(`分配任务功能开发中... 用户ID: ${userId}`);
}

function createUser() {
  alert("创建用户功能开发中...");
}

// 重写原始的renderUsersList函数
function renderUsersList() {
  renderUsersListFixed();
}

// 如果页面已经加载，立即执行修复
if (
  document.readyState === "complete" ||
  document.readyState === "interactive"
) {
  console.log("页面已加载，应用用户管理修复");
  if (currentPage === "users") {
    setTimeout(renderUsersListFixed, 100);
  }
}
