// DCP评审组件 - 处理决策评审点管理

let dcpReviews = [];

// 渲染DCP评审页面
async function renderDCPReviews() {
  const container = document.getElementById("dcp-reviews");
  if (!container) return;

  try {
    // 获取DCP评审数据
    const response = await api.getDCPReviews();
    dcpReviews = response.reviews || [];
  } catch (error) {
    console.error("获取DCP评审数据失败:", error);
    dcpReviews = getDefaultDCPReviews();
  }

  container.innerHTML = `
    <div class="dcp-overview">
      <div class="dcp-stats">
        <div class="stat-card">
          <h3>总评审数</h3>
          <div class="stat-number">${dcpReviews.length}</div>
          <div class="stat-label">所有评审</div>
        </div>
        <div class="stat-card">
          <h3>待评审</h3>
          <div class="stat-number">${
            dcpReviews.filter(
              (r) => r.status === "pending" || r.status === "in_review"
            ).length
          }</div>
          <div class="stat-label">需要处理</div>
        </div>
        <div class="stat-card">
          <h3>已完成</h3>
          <div class="stat-number">${
            dcpReviews.filter((r) => r.status === "completed").length
          }</div>
          <div class="stat-label">评审完成</div>
        </div>
        <div class="stat-card">
          <h3>通过率</h3>
          <div class="stat-number">${calculatePassRate()}%</div>
          <div class="stat-label">评审通过</div>
        </div>
      </div>
    </div>

    <div class="dcp-tabs">
      <button class="tab-btn active" onclick="showDCPTab('all')">所有评审</button>
      <button class="tab-btn" onclick="showDCPTab('pending')">待处理</button>
      <button class="tab-btn" onclick="showDCPTab('in_review')">评审中</button>
      <button class="tab-btn" onclick="showDCPTab('completed')">已完成</button>
      <button class="tab-btn" onclick="showDCPTab('analytics')">统计分析</button>
    </div>

    <div class="dcp-actions">
      <button class="btn-primary" onclick="createDCPReview()">创建评审</button>
      <button class="btn-secondary" onclick="exportDCPData()">导出数据</button>
      <div class="dcp-filters">
        <select onchange="filterDCPByProject(this.value)">
          <option value="">所有项目</option>
          ${projects
            .map((p) => `<option value="${p.id}">${p.name}</option>`)
            .join("")}
        </select>
        <select onchange="filterDCPByStage(this.value)">
          <option value="">所有阶段</option>
          <option value="concept">概念阶段</option>
          <option value="plan">计划阶段</option>
          <option value="develop">开发阶段</option>
          <option value="verify">验证阶段</option>
          <option value="release">发布阶段</option>
          <option value="lifecycle">生命周期阶段</option>
        </select>
      </div>
    </div>

    <div id="dcp-all" class="dcp-tab-content active">
      <div class="dcp-list">
        ${renderDCPList(dcpReviews)}
      </div>
    </div>

    <div id="dcp-pending" class="dcp-tab-content">
      <div class="dcp-list">
        ${renderDCPList(dcpReviews.filter((r) => r.status === "pending"))}
      </div>
    </div>

    <div id="dcp-in_review" class="dcp-tab-content">
      <div class="dcp-list">
        ${renderDCPList(dcpReviews.filter((r) => r.status === "in_review"))}
      </div>
    </div>

    <div id="dcp-completed" class="dcp-tab-content">
      <div class="dcp-list">
        ${renderDCPList(dcpReviews.filter((r) => r.status === "completed"))}
      </div>
    </div>

    <div id="dcp-analytics" class="dcp-tab-content">
      <div class="dcp-analytics">
        ${renderDCPAnalytics()}
      </div>
    </div>
  `;
}

// 渲染DCP评审列表
function renderDCPList(reviews) {
  if (reviews.length === 0) {
    return '<div class="empty-state">暂无评审数据</div>';
  }

  return reviews
    .map((review) => {
      const project = projects.find((p) => p.id === review.projectId);
      const statusClass = getStatusClass(review.status);
      const resultClass = getResultClass(review.result);

      return `
      <div class="dcp-card">
        <div class="dcp-header">
          <div class="dcp-title">
            <h4>${review.title}</h4>
            <span class="dcp-id">#${review.id}</span>
          </div>
          <div class="dcp-status">
            <span class="status-badge ${statusClass}">${getStatusText(
        review.status
      )}</span>
            ${
              review.result
                ? `<span class="result-badge ${resultClass}">${getResultText(
                    review.result
                  )}</span>`
                : ""
            }
          </div>
        </div>
        
        <div class="dcp-info">
          <div class="dcp-project">
            <strong>项目:</strong> ${project ? project.name : "未知项目"}
          </div>
          <div class="dcp-stage">
            <strong>阶段:</strong> ${getStageText(review.stage)}
          </div>
          <div class="dcp-priority">
            <strong>优先级:</strong> 
            <span class="priority-badge ${review.priority}">${getPriorityText(
        review.priority
      )}</span>
          </div>
          <div class="dcp-risk">
            <strong>风险等级:</strong> 
            <span class="risk-badge ${review.riskLevel}">${getRiskText(
        review.riskLevel
      )}</span>
          </div>
        </div>

        <div class="dcp-timeline">
          <div class="timeline-item">
            <strong>创建时间:</strong> ${formatDate(review.createdAt)}
          </div>
          <div class="timeline-item">
            <strong>截止时间:</strong> ${formatDate(review.deadline)}
            ${
              isOverdue(review.deadline, review.status)
                ? '<span class="overdue-badge">已逾期</span>'
                : ""
            }
          </div>
          ${
            review.completedAt
              ? `
            <div class="timeline-item">
              <strong>完成时间:</strong> ${formatDate(review.completedAt)}
            </div>
          `
              : ""
          }
        </div>

        <div class="dcp-reviewers">
          <strong>评审员:</strong>
          <div class="reviewers-list">
            ${review.reviewers
              .map((reviewerId) => {
                const reviewer = users.find((u) => u.id === reviewerId);
                const hasCommented = review.comments.some(
                  (c) => c.reviewerId === reviewerId
                );
                return reviewer
                  ? `
                <div class="reviewer-item ${
                  hasCommented ? "commented" : "pending"
                }">
                  <img src="${reviewer.avatar}" alt="${
                      reviewer.name
                    }" onerror="this.src='/images/default-avatar.png'">
                  <span>${reviewer.name}</span>
                  ${
                    hasCommented
                      ? '<i class="icon-check"></i>'
                      : '<i class="icon-clock"></i>'
                  }
                </div>
              `
                  : "";
              })
              .join("")}
          </div>
        </div>

        <div class="dcp-progress">
          <div class="progress-info">
            <span>评审进度: ${review.comments.length}/${
        review.reviewers.length
      }</span>
            <span>${Math.round(
              (review.comments.length / review.reviewers.length) * 100
            )}%</span>
          </div>
          <div class="progress-bar">
            <div class="progress-fill" style="width: ${
              (review.comments.length / review.reviewers.length) * 100
            }%"></div>
          </div>
        </div>

        ${
          review.comments.length > 0
            ? `
          <div class="dcp-comments-preview">
            <strong>最新评审意见:</strong>
            <div class="comment-preview">
              ${review.comments
                .slice(-1)
                .map((comment) => {
                  const commenter = users.find(
                    (u) => u.id === comment.reviewerId
                  );
                  return `
                  <div class="comment-item">
                    <div class="comment-author">
                      <img src="${commenter?.avatar}" alt="${
                    commenter?.name
                  }" onerror="this.src='/images/default-avatar.png'">
                      <span>${commenter?.name}</span>
                      <span class="comment-decision ${
                        comment.decision
                      }">${getDecisionText(comment.decision)}</span>
                    </div>
                    <div class="comment-content">${comment.content}</div>
                    <div class="comment-time">${formatDate(
                      comment.createdAt
                    )}</div>
                  </div>
                `;
                })
                .join("")}
            </div>
          </div>
        `
            : ""
        }

        <div class="dcp-actions">
          <button class="btn-small" onclick="viewDCPDetails('${
            review.id
          }')">查看详情</button>
          ${
            review.status !== "completed" &&
            review.reviewers.includes(getCurrentUserId())
              ? `<button class="btn-small primary" onclick="submitReview('${review.id}')">提交评审</button>`
              : ""
          }
          ${
            review.status === "pending"
              ? `<button class="btn-small" onclick="editDCPReview('${review.id}')">编辑</button>`
              : ""
          }
          <button class="btn-small" onclick="exportDCPReview('${
            review.id
          }')">导出</button>
        </div>
      </div>
    `;
    })
    .join("");
}

// 渲染DCP统计分析
function renderDCPAnalytics() {
  const completedReviews = dcpReviews.filter((r) => r.status === "completed");
  const passedReviews = completedReviews.filter((r) => r.result === "pass");
  const avgReviewTime = calculateAverageReviewTime();

  return `
    <div class="analytics-grid">
      <div class="analytics-card">
        <h4>评审统计</h4>
        <div class="analytics-stats">
          <div class="stat-row">
            <span>总评审数:</span>
            <span>${dcpReviews.length}</span>
          </div>
          <div class="stat-row">
            <span>已完成:</span>
            <span>${completedReviews.length}</span>
          </div>
          <div class="stat-row">
            <span>通过数:</span>
            <span>${passedReviews.length}</span>
          </div>
          <div class="stat-row">
            <span>通过率:</span>
            <span>${calculatePassRate()}%</span>
          </div>
          <div class="stat-row">
            <span>平均评审时间:</span>
            <span>${avgReviewTime}天</span>
          </div>
        </div>
      </div>

      <div class="analytics-card">
        <h4>阶段分布</h4>
        <div class="stage-distribution">
          ${renderStageDistribution()}
        </div>
      </div>

      <div class="analytics-card">
        <h4>评审员工作量</h4>
        <div class="reviewer-workload">
          ${renderReviewerWorkload()}
        </div>
      </div>

      <div class="analytics-card">
        <h4>风险等级分布</h4>
        <div class="risk-distribution">
          ${renderRiskDistribution()}
        </div>
      </div>
    </div>

    <div class="analytics-charts">
      <div class="chart-card">
        <h4>月度评审趋势</h4>
        <div class="trend-chart">
          ${renderMonthlyTrend()}
        </div>
      </div>
    </div>
  `;
}

// 渲染阶段分布
function renderStageDistribution() {
  const stages = [
    "concept",
    "plan",
    "develop",
    "verify",
    "release",
    "lifecycle",
  ];
  const stageNames = {
    concept: "概念阶段",
    plan: "计划阶段",
    develop: "开发阶段",
    verify: "验证阶段",
    release: "发布阶段",
    lifecycle: "生命周期阶段",
  };

  return stages
    .map((stage) => {
      const count = dcpReviews.filter((r) => r.stage === stage).length;
      const percentage =
        dcpReviews.length > 0
          ? Math.round((count / dcpReviews.length) * 100)
          : 0;

      return `
      <div class="distribution-item">
        <div class="distribution-label">${stageNames[stage]}</div>
        <div class="distribution-bar">
          <div class="distribution-fill" style="width: ${percentage}%"></div>
        </div>
        <div class="distribution-value">${count} (${percentage}%)</div>
      </div>
    `;
    })
    .join("");
}

// 渲染评审员工作量
function renderReviewerWorkload() {
  const reviewerStats = {};

  dcpReviews.forEach((review) => {
    review.reviewers.forEach((reviewerId) => {
      if (!reviewerStats[reviewerId]) {
        reviewerStats[reviewerId] = { total: 0, completed: 0 };
      }
      reviewerStats[reviewerId].total++;
      if (review.comments.some((c) => c.reviewerId === reviewerId)) {
        reviewerStats[reviewerId].completed++;
      }
    });
  });

  return Object.entries(reviewerStats)
    .map(([reviewerId, stats]) => {
      const reviewer = users.find((u) => u.id === reviewerId);
      const completionRate =
        stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;

      return reviewer
        ? `
      <div class="workload-item">
        <div class="workload-reviewer">
          <img src="${reviewer.avatar}" alt="${reviewer.name}" onerror="this.src='/images/default-avatar.png'">
          <span>${reviewer.name}</span>
        </div>
        <div class="workload-stats">
          <span>总数: ${stats.total}</span>
          <span>完成: ${stats.completed}</span>
          <span>完成率: ${completionRate}%</span>
        </div>
        <div class="workload-bar">
          <div class="workload-fill" style="width: ${completionRate}%"></div>
        </div>
      </div>
    `
        : "";
    })
    .join("");
}

// 渲染风险等级分布
function renderRiskDistribution() {
  const risks = ["low", "medium", "high"];
  const riskNames = { low: "低风险", medium: "中风险", high: "高风险" };
  const riskColors = { low: "#52c41a", medium: "#faad14", high: "#ff4d4f" };

  return risks
    .map((risk) => {
      const count = dcpReviews.filter((r) => r.riskLevel === risk).length;
      const percentage =
        dcpReviews.length > 0
          ? Math.round((count / dcpReviews.length) * 100)
          : 0;

      return `
      <div class="risk-item">
        <div class="risk-label">
          <span class="risk-color" style="background-color: ${riskColors[risk]}"></span>
          ${riskNames[risk]}
        </div>
        <div class="risk-value">${count} (${percentage}%)</div>
      </div>
    `;
    })
    .join("");
}

// 渲染月度趋势
function renderMonthlyTrend() {
  // 简化的趋势图表示
  const months = ["2024-01", "2024-02", "2024-03"];
  const monthlyData = months.map((month) => {
    const count = dcpReviews.filter((r) =>
      r.createdAt.startsWith(month)
    ).length;
    return { month, count };
  });

  const maxCount = Math.max(...monthlyData.map((d) => d.count), 1);

  return `
    <div class="trend-bars">
      ${monthlyData
        .map(
          (data) => `
        <div class="trend-bar-item">
          <div class="trend-bar" style="height: ${
            (data.count / maxCount) * 100
          }%"></div>
          <div class="trend-label">${data.month}</div>
          <div class="trend-value">${data.count}</div>
        </div>
      `
        )
        .join("")}
    </div>
  `;
}

// 切换DCP标签页
function showDCPTab(tabName) {
  // 隐藏所有标签内容
  const tabs = document.querySelectorAll(".dcp-tab-content");
  tabs.forEach((tab) => tab.classList.remove("active"));

  // 移除所有按钮的active状态
  const buttons = document.querySelectorAll(".tab-btn");
  buttons.forEach((btn) => btn.classList.remove("active"));

  // 显示目标标签内容
  const targetTab = document.getElementById(`dcp-${tabName}`);
  if (targetTab) {
    targetTab.classList.add("active");
  }

  // 激活对应按钮
  event.target.classList.add("active");
}

// 工具函数
function getDefaultDCPReviews() {
  return [
    {
      id: "dcp_001",
      projectId: "proj_001",
      stage: "concept",
      title: "概念阶段DCP评审",
      status: "completed",
      result: "pass",
      reviewers: ["user_001", "user_002", "user_003", "user_009"],
      deadline: "2024-01-30T18:00:00Z",
      createdAt: "2024-01-25T08:00:00Z",
      completedAt: "2024-01-29T16:30:00Z",
      priority: "high",
      riskLevel: "low",
      comments: [
        {
          id: "comment_001",
          reviewerId: "user_001",
          content: "市场需求分析充分，技术方案可行，建议通过",
          decision: "approve",
          createdAt: "2024-01-28T10:00:00Z",
        },
      ],
    },
  ];
}

function calculatePassRate() {
  const completedReviews = dcpReviews.filter((r) => r.status === "completed");
  if (completedReviews.length === 0) return 0;

  const passedReviews = completedReviews.filter((r) => r.result === "pass");
  return Math.round((passedReviews.length / completedReviews.length) * 100);
}

function calculateAverageReviewTime() {
  const completedReviews = dcpReviews.filter(
    (r) => r.status === "completed" && r.completedAt
  );
  if (completedReviews.length === 0) return 0;

  const totalDays = completedReviews.reduce((sum, review) => {
    const created = new Date(review.createdAt);
    const completed = new Date(review.completedAt);
    const days = Math.ceil((completed - created) / (1000 * 60 * 60 * 24));
    return sum + days;
  }, 0);

  return Math.round(totalDays / completedReviews.length);
}

function getStatusClass(status) {
  const classMap = {
    pending: "pending",
    in_review: "in-progress",
    completed: "completed",
  };
  return classMap[status] || "pending";
}

function getResultClass(result) {
  const classMap = {
    pass: "success",
    fail: "danger",
    conditional_pass: "warning",
  };
  return classMap[result] || "";
}

function getStatusText(status) {
  const statusMap = {
    pending: "待开始",
    in_review: "评审中",
    completed: "已完成",
  };
  return statusMap[status] || status;
}

function getResultText(result) {
  const resultMap = {
    pass: "通过",
    fail: "不通过",
    conditional_pass: "有条件通过",
  };
  return resultMap[result] || result;
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

function getPriorityText(priority) {
  const priorityMap = {
    low: "低",
    medium: "中",
    high: "高",
  };
  return priorityMap[priority] || priority;
}

function getRiskText(risk) {
  const riskMap = {
    low: "低风险",
    medium: "中风险",
    high: "高风险",
  };
  return riskMap[risk] || risk;
}

function getDecisionText(decision) {
  const decisionMap = {
    approve: "同意",
    reject: "拒绝",
    conditional_approve: "有条件同意",
  };
  return decisionMap[decision] || decision;
}

function formatDate(dateString) {
  const date = new Date(dateString);
  return (
    date.toLocaleDateString("zh-CN") +
    " " +
    date.toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" })
  );
}

function isOverdue(deadline, status) {
  if (status === "completed") return false;
  return new Date(deadline) < new Date();
}

function getCurrentUserId() {
  // 模拟当前用户ID，实际应该从登录状态获取
  return "user_001";
}

// DCP操作函数
function viewDCPDetails(reviewId) {
  const review = dcpReviews.find((r) => r.id === reviewId);
  if (!review) return;

  const project = projects.find((p) => p.id === review.projectId);

  const modalContent = `
    <h3>DCP评审详情 - ${review.title}</h3>
    <div class="dcp-detail-content">
      <div class="dcp-detail-basic">
        <div class="detail-row">
          <strong>评审ID:</strong> ${review.id}
        </div>
        <div class="detail-row">
          <strong>项目:</strong> ${project ? project.name : "未知项目"}
        </div>
        <div class="detail-row">
          <strong>阶段:</strong> ${getStageText(review.stage)}
        </div>
        <div class="detail-row">
          <strong>状态:</strong> <span class="status-badge ${getStatusClass(
            review.status
          )}">${getStatusText(review.status)}</span>
        </div>
        ${
          review.result
            ? `
          <div class="detail-row">
            <strong>结果:</strong> <span class="result-badge ${getResultClass(
              review.result
            )}">${getResultText(review.result)}</span>
          </div>
        `
            : ""
        }
        <div class="detail-row">
          <strong>优先级:</strong> <span class="priority-badge ${
            review.priority
          }">${getPriorityText(review.priority)}</span>
        </div>
        <div class="detail-row">
          <strong>风险等级:</strong> <span class="risk-badge ${
            review.riskLevel
          }">${getRiskText(review.riskLevel)}</span>
        </div>
        <div class="detail-row">
          <strong>创建时间:</strong> ${formatDate(review.createdAt)}
        </div>
        <div class="detail-row">
          <strong>截止时间:</strong> ${formatDate(review.deadline)}
        </div>
        ${
          review.completedAt
            ? `
          <div class="detail-row">
            <strong>完成时间:</strong> ${formatDate(review.completedAt)}
          </div>
        `
            : ""
        }
      </div>

      <div class="dcp-detail-reviewers">
        <h4>评审员</h4>
        <div class="reviewers-detail">
          ${review.reviewers
            .map((reviewerId) => {
              const reviewer = users.find((u) => u.id === reviewerId);
              const comment = review.comments.find(
                (c) => c.reviewerId === reviewerId
              );
              return reviewer
                ? `
              <div class="reviewer-detail-item">
                <div class="reviewer-info">
                  <img src="${reviewer.avatar}" alt="${
                    reviewer.name
                  }" onerror="this.src='/images/default-avatar.png'">
                  <div>
                    <div class="reviewer-name">${reviewer.name}</div>
                    <div class="reviewer-role">${reviewer.department} - ${
                    reviewer.function
                  }</div>
                  </div>
                </div>
                <div class="reviewer-status">
                  ${
                    comment
                      ? `
                    <span class="decision-badge ${
                      comment.decision
                    }">${getDecisionText(comment.decision)}</span>
                    <div class="comment-time">${formatDate(
                      comment.createdAt
                    )}</div>
                  `
                      : '<span class="pending-badge">待评审</span>'
                  }
                </div>
              </div>
            `
                : "";
            })
            .join("")}
        </div>
      </div>

      <div class="dcp-detail-comments">
        <h4>评审意见</h4>
        <div class="comments-list">
          ${
            review.comments.length > 0
              ? review.comments
                  .map((comment) => {
                    const commenter = users.find(
                      (u) => u.id === comment.reviewerId
                    );
                    return `
              <div class="comment-detail-item">
                <div class="comment-header">
                  <div class="commenter-info">
                    <img src="${commenter?.avatar}" alt="${
                      commenter?.name
                    }" onerror="this.src='/images/default-avatar.png'">
                    <span>${commenter?.name}</span>
                  </div>
                  <div class="comment-meta">
                    <span class="comment-decision ${
                      comment.decision
                    }">${getDecisionText(comment.decision)}</span>
                    <span class="comment-time">${formatDate(
                      comment.createdAt
                    )}</span>
                  </div>
                </div>
                <div class="comment-content">${comment.content}</div>
              </div>
            `;
                  })
                  .join("")
              : '<div class="no-comments">暂无评审意见</div>'
          }
        </div>
      </div>
    </div>
  `;

  showModal(modalContent);
}

function submitReview(reviewId) {
  const review = dcpReviews.find((r) => r.id === reviewId);
  if (!review) return;

  const modalContent = `
    <h3>提交评审意见 - ${review.title}</h3>
    <form class="submit-review-form">
      <div class="form-group">
        <label>评审决策:</label>
        <select id="review-decision" required>
          <option value="">请选择决策</option>
          <option value="approve">同意通过</option>
          <option value="conditional_approve">有条件通过</option>
          <option value="reject">不通过</option>
        </select>
      </div>
      <div class="form-group">
        <label>评审意见:</label>
        <textarea id="review-comment" rows="5" required placeholder="请输入详细的评审意见..."></textarea>
      </div>
      <div class="form-group">
        <label>建议改进措施:</label>
        <textarea id="review-suggestions" rows="3" placeholder="如有改进建议，请在此输入..."></textarea>
      </div>
      <div class="form-actions">
        <button type="button" class="btn-primary" onclick="submitReviewComment('${reviewId}')">提交评审</button>
        <button type="button" class="btn-secondary" onclick="closeModal()">取消</button>
      </div>
    </form>
  `;

  showModal(modalContent);
}

function createDCPReview() {
  const modalContent = `
    <h3>创建DCP评审</h3>
    <form class="create-review-form">
      <div class="form-group">
        <label>选择项目:</label>
        <select id="review-project" required>
          <option value="">请选择项目</option>
          ${projects
            .map((p) => `<option value="${p.id}">${p.name}</option>`)
            .join("")}
        </select>
      </div>
      <div class="form-group">
        <label>评审阶段:</label>
        <select id="review-stage" required>
          <option value="">请选择阶段</option>
          <option value="concept">概念阶段</option>
          <option value="plan">计划阶段</option>
          <option value="develop">开发阶段</option>
          <option value="verify">验证阶段</option>
          <option value="release">发布阶段</option>
          <option value="lifecycle">生命周期阶段</option>
        </select>
      </div>
      <div class="form-group">
        <label>评审标题:</label>
        <input type="text" id="review-title" required placeholder="请输入评审标题">
      </div>
      <div class="form-group">
        <label>优先级:</label>
        <select id="review-priority" required>
          <option value="medium" selected>中</option>
          <option value="low">低</option>
          <option value="high">高</option>
        </select>
      </div>
      <div class="form-group">
        <label>风险等级:</label>
        <select id="review-risk" required>
          <option value="low" selected>低风险</option>
          <option value="medium">中风险</option>
          <option value="high">高风险</option>
        </select>
      </div>
      <div class="form-group">
        <label>截止日期:</label>
        <input type="datetime-local" id="review-deadline" required>
      </div>
      <div class="form-group">
        <label>选择评审员:</label>
        <div class="reviewers-selection">
          ${users
            .filter(
              (u) =>
                u.role === "reviewer" ||
                u.role === "project_manager" ||
                u.role === "admin"
            )
            .map(
              (user) => `
            <label class="reviewer-checkbox">
              <input type="checkbox" name="reviewers" value="${user.id}">
              <img src="${user.avatar}" alt="${user.name}" onerror="this.src='/images/default-avatar.png'">
              <span>${user.name} (${user.department})</span>
            </label>
          `
            )
            .join("")}
        </div>
      </div>
      <div class="form-actions">
        <button type="button" class="btn-primary" onclick="submitCreateReview()">创建评审</button>
        <button type="button" class="btn-secondary" onclick="closeModal()">取消</button>
      </div>
    </form>
  `;

  showModal(modalContent);
}

// 提交评审意见
function submitReviewComment(reviewId) {
  const decision = document.getElementById("review-decision").value;
  const comment = document.getElementById("review-comment").value;
  const suggestions = document.getElementById("review-suggestions").value;

  if (!decision || !comment) {
    alert("请填写必填项");
    return;
  }

  // 这里应该调用API提交评审意见
  console.log("提交评审意见:", { reviewId, decision, comment, suggestions });

  alert("评审意见提交成功！");
  closeModal();
  renderDCPReviews(); // 重新渲染页面
}

// 提交创建评审
function submitCreateReview() {
  const projectId = document.getElementById("review-project").value;
  const stage = document.getElementById("review-stage").value;
  const title = document.getElementById("review-title").value;
  const priority = document.getElementById("review-priority").value;
  const risk = document.getElementById("review-risk").value;
  const deadline = document.getElementById("review-deadline").value;

  const selectedReviewers = Array.from(
    document.querySelectorAll('input[name="reviewers"]:checked')
  ).map((checkbox) => checkbox.value);

  if (
    !projectId ||
    !stage ||
    !title ||
    !deadline ||
    selectedReviewers.length === 0
  ) {
    alert("请填写所有必填项并至少选择一个评审员");
    return;
  }

  // 这里应该调用API创建评审
  console.log("创建DCP评审:", {
    projectId,
    stage,
    title,
    priority,
    risk,
    deadline,
    reviewers: selectedReviewers,
  });

  alert("DCP评审创建成功！");
  closeModal();
  renderDCPReviews(); // 重新渲染页面
}

// 过滤函数
function filterDCPByProject(projectId) {
  console.log("按项目过滤DCP:", projectId);
  // 这里应该重新渲染过滤后的列表
}

function filterDCPByStage(stage) {
  console.log("按阶段过滤DCP:", stage);
  // 这里应该重新渲染过滤后的列表
}

// 导出函数
function exportDCPData() {
  const data = {
    exportTime: new Date().toISOString(),
    reviews: dcpReviews,
    summary: {
      total: dcpReviews.length,
      completed: dcpReviews.filter((r) => r.status === "completed").length,
      passRate: calculatePassRate(),
      avgReviewTime: calculateAverageReviewTime(),
    },
  };

  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `dcp_reviews_${new Date().toISOString().split("T")[0]}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function exportDCPReview(reviewId) {
  const review = dcpReviews.find((r) => r.id === reviewId);
  if (!review) return;

  const blob = new Blob([JSON.stringify(review, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `dcp_review_${reviewId}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

console.log("DCP评审组件已加载");
