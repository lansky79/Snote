// 项目阶段组件 - 处理六阶段流程管理

console.log("项目阶段组件已加载");

// 渲染项目阶段管理页面
function renderProjectStages() {
  const container = document.getElementById("stages-container");
  if (!container) return;

  if (!currentProject) {
    container.innerHTML = `
      <div class="empty-state" style="text-align: center; padding: 40px;">
        <div class="empty-state-icon" style="font-size: 3em; margin-bottom: 20px;">🔄</div>
        <div class="empty-state-text" style="font-size: 1.2em; color: #666; margin-bottom: 20px;">请先选择一个项目</div>
        <button onclick="goBack()" class="btn-primary">返回项目列表</button>
      </div>
    `;
    return;
  }

  const stages = [
    { key: "concept", name: "概念阶段", icon: "💡" },
    { key: "plan", name: "计划阶段", icon: "📋" },
    { key: "develop", name: "开发阶段", icon: "⚙️" },
    { key: "verify", name: "验证阶段", icon: "🔍" },
    { key: "release", name: "发布阶段", icon: "🚀" },
    { key: "lifecycle", name: "生命周期阶段", icon: "🔄" },
  ];

  container.innerHTML = `
    <div class="stages-header" style="margin-bottom: 30px;">
      <h2 style="margin: 0; color: #333;">${
        currentProject.name
      } - 六阶段流程</h2>
      <p style="color: #666; margin: 10px 0 0 0;">当前阶段: ${getStageText(
        currentProject.currentStage
      )}</p>
    </div>

    <div class="stages-flow" style="display: flex; justify-content: space-between; margin-bottom: 40px; overflow-x: auto;">
      ${stages
        .map((stage, index) => {
          const stageData = currentProject.stages[stage.key] || {};
          const isActive = currentProject.currentStage === stage.key;
          const isCompleted = stageData.status === "completed";
          const isInProgress = stageData.status === "in_progress";

          return `
          <div class="stage-item" style="flex: 1; min-width: 150px; text-align: center; position: relative;">
            ${
              index > 0
                ? '<div class="stage-connector" style="position: absolute; left: -50%; top: 50px; width: 100%; height: 2px; background: #ddd; z-index: 1;"></div>'
                : ""
            }
            <div class="stage-circle" style="
              width: 80px; 
              height: 80px; 
              border-radius: 50%; 
              margin: 0 auto 15px; 
              display: flex; 
              align-items: center; 
              justify-content: center; 
              font-size: 2em;
              position: relative;
              z-index: 2;
              background: ${
                isCompleted ? "#2ecc71" : isInProgress ? "#3498db" : "#ecf0f1"
              };
              color: ${isCompleted || isInProgress ? "white" : "#666"};
              border: 3px solid ${isActive ? "#f39c12" : "transparent"};
            ">
              ${stage.icon}
            </div>
            <h4 style="margin: 0 0 10px 0; color: #333;">${stage.name}</h4>
            <div class="stage-progress" style="margin-bottom: 10px;">
              <div style="background: #f0f0f0; height: 8px; border-radius: 4px; overflow: hidden;">
                <div style="background: #3498db; height: 100%; width: ${
                  stageData.progress || 0
                }%; transition: width 0.3s ease;"></div>
              </div>
              <span style="font-size: 0.9em; color: #666;">${
                stageData.progress || 0
              }%</span>
            </div>
            <div class="stage-status" style="font-size: 0.8em; color: #666;">
              ${getStatusText(stageData.status || "not_started")}
            </div>
            <button onclick="viewStageDetails('${stage.key}')" style="
              margin-top: 10px; 
              padding: 6px 12px; 
              border: 1px solid #3498db; 
              color: #3498db; 
              background: white; 
              border-radius: 4px; 
              cursor: pointer;
              font-size: 0.8em;
            ">查看详情</button>
          </div>
        `;
        })
        .join("")}
    </div>

    <div class="stages-details" style="background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
      <h3 style="margin-top: 0; color: #333;">当前阶段详情</h3>
      ${renderCurrentStageDetails()}
    </div>
  `;
}

// 渲染当前阶段详情
function renderCurrentStageDetails() {
  if (!currentProject || !currentProject.currentStage) {
    return '<p style="color: #666;">暂无阶段信息</p>';
  }

  const currentStageData =
    currentProject.stages[currentProject.currentStage] || {};
  const stageTasks = currentStageData.tasks || [];

  return `
    <div class="current-stage-info">
      <div class="stage-info-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 20px;">
        <div class="info-item">
          <label style="color: #666; font-size: 0.9em;">阶段名称</label>
          <div style="font-weight: bold; color: #333;">${
            currentStageData.name || "未知阶段"
          }</div>
        </div>
        <div class="info-item">
          <label style="color: #666; font-size: 0.9em;">状态</label>
          <div style="font-weight: bold; color: #333;">${getStatusText(
            currentStageData.status || "not_started"
          )}</div>
        </div>
        <div class="info-item">
          <label style="color: #666; font-size: 0.9em;">进度</label>
          <div style="font-weight: bold; color: #333;">${
            currentStageData.progress || 0
          }%</div>
        </div>
        <div class="info-item">
          <label style="color: #666; font-size: 0.9em;">开始时间</label>
          <div style="font-weight: bold; color: #333;">${
            currentStageData.startDate || "未设置"
          }</div>
        </div>
      </div>

      ${
        stageTasks.length > 0
          ? `
        <div class="stage-tasks">
          <h4 style="color: #333; margin-bottom: 15px;">阶段任务</h4>
          <div class="tasks-list">
            ${stageTasks
              .map(
                (task) => `
              <div class="task-item" style="display: flex; align-items: center; padding: 10px; border: 1px solid #eee; border-radius: 4px; margin-bottom: 10px;">
                <div class="task-status" style="width: 20px; height: 20px; border-radius: 50%; background: ${
                  task.status === "completed"
                    ? "#2ecc71"
                    : task.status === "in_progress"
                    ? "#3498db"
                    : "#95a5a6"
                }; margin-right: 15px;"></div>
                <div class="task-info" style="flex: 1;">
                  <div style="font-weight: bold; color: #333;">${
                    task.name
                  }</div>
                  <div style="color: #666; font-size: 0.9em;">负责人: ${getUserName(
                    task.assignee
                  )}</div>
                </div>
                <div class="task-progress" style="width: 100px; text-align: right;">
                  <span style="color: #666; font-size: 0.9em;">${
                    task.progress || 0
                  }%</span>
                </div>
              </div>
            `
              )
              .join("")}
          </div>
        </div>
      `
          : '<p style="color: #666;">当前阶段暂无任务</p>'
      }
    </div>
  `;
}

// 查看阶段详情
function viewStageDetails(stageKey) {
  if (!currentProject || !currentProject.stages[stageKey]) {
    alert("阶段信息不存在");
    return;
  }

  const stage = currentProject.stages[stageKey];
  const modalContent = `
    <h3>${stage.name} - 详细信息</h3>
    <div class="stage-detail-content">
      <div class="detail-grid" style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; margin-bottom: 20px;">
        <div class="detail-item">
          <strong>状态:</strong> ${getStatusText(stage.status || "not_started")}
        </div>
        <div class="detail-item">
          <strong>进度:</strong> ${stage.progress || 0}%
        </div>
        <div class="detail-item">
          <strong>开始时间:</strong> ${stage.startDate || "未设置"}
        </div>
        <div class="detail-item">
          <strong>结束时间:</strong> ${stage.endDate || "未设置"}
        </div>
      </div>
      
      ${
        stage.tasks && stage.tasks.length > 0
          ? `
        <h4>阶段任务</h4>
        <div class="tasks-detail">
          ${stage.tasks
            .map(
              (task) => `
            <div style="padding: 10px; border: 1px solid #eee; border-radius: 4px; margin-bottom: 10px;">
              <div style="font-weight: bold;">${task.name}</div>
              <div style="color: #666; margin-top: 5px;">
                状态: ${getStatusText(task.status)} | 
                负责人: ${getUserName(task.assignee)} |
                进度: ${task.progress || 0}%
              </div>
            </div>
          `
            )
            .join("")}
        </div>
      `
          : "<p>当前阶段暂无任务</p>"
      }
    </div>
  `;

  showModal(modalContent);
}

// 获取用户姓名
function getUserName(userId) {
  if (!userId || !users) return "未分配";
  const user = users.find((u) => u.id === userId);
  return user ? user.name : "未知用户";
}
