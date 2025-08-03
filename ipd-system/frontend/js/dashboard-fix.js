// 修复仪表盘显示问题的临时脚本

// 简化的仪表盘渲染函数
function renderDashboardFixed() {
  const container = document.getElementById("dashboard-charts");
  if (!container) {
    console.error("找不到dashboard-charts容器");
    return;
  }

  console.log("开始渲染仪表盘，数据状态:", {
    projects: projects.length,
    users: users.length,
    dcpReviews: dcpReviews.length,
    deliverables: deliverables.length,
    tasks: tasks.length,
  });

  // 计算基本统计数据
  const totalProjects = projects.length;
  const activeProjects = projects.filter(
    (p) => p.status === "in_progress"
  ).length;
  const completedProjects = projects.filter(
    (p) => p.status === "completed"
  ).length;
  const totalUsers = users.length;
  const totalTasks = tasks.length;
  const totalDeliverables = deliverables.length;
  const totalDCPReviews = dcpReviews.length;

  container.innerHTML = `
    <div class="dashboard-header">
      <h2>项目仪表盘</h2>
      <p>数据更新时间: ${new Date().toLocaleString()}</p>
    </div>

    <div class="dashboard-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; margin-top: 20px;">
      <!-- 项目概览 -->
      <div class="dashboard-card" style="background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
        <div class="card-header" style="margin-bottom: 15px;">
          <h3 style="margin: 0; color: #333;">项目概览</h3>
        </div>
        <div class="card-content">
          <div class="stats-grid" style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px;">
            <div class="stat-item" style="text-align: center;">
              <div class="stat-number" style="font-size: 2em; font-weight: bold; color: #3498db;">${totalProjects}</div>
              <div class="stat-label" style="color: #666;">总项目数</div>
            </div>
            <div class="stat-item" style="text-align: center;">
              <div class="stat-number" style="font-size: 2em; font-weight: bold; color: #2ecc71;">${activeProjects}</div>
              <div class="stat-label" style="color: #666;">进行中</div>
            </div>
            <div class="stat-item" style="text-align: center;">
              <div class="stat-number" style="font-size: 2em; font-weight: bold; color: #27ae60;">${completedProjects}</div>
              <div class="stat-label" style="color: #666;">已完成</div>
            </div>
            <div class="stat-item" style="text-align: center;">
              <div class="stat-number" style="font-size: 2em; font-weight: bold; color: #f39c12;">${
                totalProjects - activeProjects - completedProjects
              }</div>
              <div class="stat-label" style="color: #666;">其他状态</div>
            </div>
          </div>
        </div>
      </div>

      <!-- 团队统计 -->
      <div class="dashboard-card" style="background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
        <div class="card-header" style="margin-bottom: 15px;">
          <h3 style="margin: 0; color: #333;">团队统计</h3>
        </div>
        <div class="card-content">
          <div class="stats-grid" style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px;">
            <div class="stat-item" style="text-align: center;">
              <div class="stat-number" style="font-size: 2em; font-weight: bold; color: #9b59b6;">${totalUsers}</div>
              <div class="stat-label" style="color: #666;">团队成员</div>
            </div>
            <div class="stat-item" style="text-align: center;">
              <div class="stat-number" style="font-size: 2em; font-weight: bold; color: #e74c3c;">${totalTasks}</div>
              <div class="stat-label" style="color: #666;">总任务数</div>
            </div>
            <div class="stat-item" style="text-align: center;">
              <div class="stat-number" style="font-size: 2em; font-weight: bold; color: #1abc9c;">${
                users.filter((u) => u.role === "project_manager").length
              }</div>
              <div class="stat-label" style="color: #666;">项目经理</div>
            </div>
            <div class="stat-item" style="text-align: center;">
              <div class="stat-number" style="font-size: 2em; font-weight: bold; color: #34495e;">${Math.round(
                users.reduce((sum, u) => sum + u.workload, 0) / users.length
              )}%</div>
              <div class="stat-label" style="color: #666;">平均负载</div>
            </div>
          </div>
        </div>
      </div>

      <!-- 交付物统计 -->
      <div class="dashboard-card" style="background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
        <div class="card-header" style="margin-bottom: 15px;">
          <h3 style="margin: 0; color: #333;">交付物统计</h3>
        </div>
        <div class="card-content">
          <div class="stats-grid" style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px;">
            <div class="stat-item" style="text-align: center;">
              <div class="stat-number" style="font-size: 2em; font-weight: bold; color: #f39c12;">${totalDeliverables}</div>
              <div class="stat-label" style="color: #666;">总交付物</div>
            </div>
            <div class="stat-item" style="text-align: center;">
              <div class="stat-number" style="font-size: 2em; font-weight: bold; color: #27ae60;">${
                deliverables.filter((d) => d.approvalStatus === "approved")
                  .length
              }</div>
              <div class="stat-label" style="color: #666;">已审批</div>
            </div>
            <div class="stat-item" style="text-align: center;">
              <div class="stat-number" style="font-size: 2em; font-weight: bold; color: #e67e22;">${
                deliverables.filter((d) => d.approvalStatus === "pending")
                  .length
              }</div>
              <div class="stat-label" style="color: #666;">待审批</div>
            </div>
            <div class="stat-item" style="text-align: center;">
              <div class="stat-number" style="font-size: 2em; font-weight: bold; color: #8e44ad;">${
                deliverables.filter((d) => d.type === "document").length
              }</div>
              <div class="stat-label" style="color: #666;">文档类型</div>
            </div>
          </div>
        </div>
      </div>

      <!-- DCP评审统计 -->
      <div class="dashboard-card" style="background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
        <div class="card-header" style="margin-bottom: 15px;">
          <h3 style="margin: 0; color: #333;">DCP评审统计</h3>
        </div>
        <div class="card-content">
          <div class="stats-grid" style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px;">
            <div class="stat-item" style="text-align: center;">
              <div class="stat-number" style="font-size: 2em; font-weight: bold; color: #3498db;">${totalDCPReviews}</div>
              <div class="stat-label" style="color: #666;">总评审数</div>
            </div>
            <div class="stat-item" style="text-align: center;">
              <div class="stat-number" style="font-size: 2em; font-weight: bold; color: #2ecc71;">${
                dcpReviews.filter((r) => r.status === "completed").length
              }</div>
              <div class="stat-label" style="color: #666;">已完成</div>
            </div>
            <div class="stat-item" style="text-align: center;">
              <div class="stat-number" style="font-size: 2em; font-weight: bold; color: #f39c12;">${
                dcpReviews.filter(
                  (r) => r.status === "pending" || r.status === "in_review"
                ).length
              }</div>
              <div class="stat-label" style="color: #666;">待处理</div>
            </div>
            <div class="stat-item" style="text-align: center;">
              <div class="stat-number" style="font-size: 2em; font-weight: bold; color: #27ae60;">${
                Math.round(
                  (dcpReviews.filter((r) => r.result === "pass").length /
                    dcpReviews.filter((r) => r.status === "completed").length) *
                    100
                ) || 0
              }%</div>
              <div class="stat-label" style="color: #666;">通过率</div>
            </div>
          </div>
        </div>
      </div>

      <!-- 项目列表 -->
      <div class="dashboard-card" style="background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); grid-column: 1 / -1;">
        <div class="card-header" style="margin-bottom: 15px;">
          <h3 style="margin: 0; color: #333;">项目进度概览</h3>
        </div>
        <div class="card-content">
          <div class="projects-list">
            ${projects
              .map(
                (project) => `
              <div class="project-item" style="display: flex; align-items: center; padding: 10px; border-bottom: 1px solid #eee; margin-bottom: 10px;">
                <div class="project-info" style="flex: 1;">
                  <div class="project-name" style="font-weight: bold; margin-bottom: 5px;">${
                    project.name
                  }</div>
                  <div class="project-stage" style="color: #666; font-size: 0.9em;">${getStageText(
                    project.currentStage
                  )} - ${getStatusText(project.status)}</div>
                </div>
                <div class="project-progress" style="width: 200px; margin-left: 20px;">
                  <div class="progress-bar" style="background: #f0f0f0; height: 20px; border-radius: 10px; overflow: hidden;">
                    <div class="progress-fill" style="background: #3498db; height: 100%; width: ${calculateOverallProgress(
                      project
                    )}%; transition: width 0.3s ease;"></div>
                  </div>
                  <div class="progress-text" style="text-align: center; margin-top: 5px; font-size: 0.9em;">${calculateOverallProgress(
                    project
                  )}%</div>
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

  console.log("仪表盘渲染完成");
}

// 重写原始的renderDashboard函数
function renderDashboard() {
  renderDashboardFixed();
}

// 如果页面已经加载，立即执行修复
if (
  document.readyState === "complete" ||
  document.readyState === "interactive"
) {
  console.log("页面已加载，应用仪表盘修复");
  if (currentPage === "dashboard") {
    setTimeout(renderDashboardFixed, 100);
  }
}
