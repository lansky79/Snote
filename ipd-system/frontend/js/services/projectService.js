// 项目服务 - 处理项目相关的业务逻辑
class ProjectService {
  constructor(apiService) {
    this.api = apiService;
  }

  // 获取项目统计信息
  getProjectStats(projects) {
    const stats = {
      total: projects.length,
      notStarted: 0,
      inProgress: 0,
      completed: 0,
      blocked: 0,
    };

    projects.forEach((project) => {
      switch (project.status) {
        case "not_started":
          stats.notStarted++;
          break;
        case "in_progress":
          stats.inProgress++;
          break;
        case "completed":
          stats.completed++;
          break;
        case "blocked":
          stats.blocked++;
          break;
      }
    });

    return stats;
  }

  // 获取项目阶段统计
  getStageStats(projects) {
    const stageStats = {
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
        stageStats.hasOwnProperty(project.currentStage)
      ) {
        stageStats[project.currentStage]++;
      }
    });

    return stageStats;
  }

  // 计算项目整体进度
  calculateProjectProgress(project) {
    if (!project.stages) return 0;

    const stages = Object.values(project.stages);
    const totalProgress = stages.reduce(
      (sum, stage) => sum + (stage.progress || 0),
      0
    );
    return Math.round(totalProgress / stages.length);
  }

  // 获取项目团队成员
  getProjectTeam(project, users) {
    if (!project || !users) return [];

    return users.filter(
      (user) => user.projects && user.projects.includes(project.id)
    );
  }

  // 获取项目任务
  getProjectTasks(project, tasks) {
    if (!project || !tasks) return [];

    return tasks.filter((task) => task.projectId === project.id);
  }

  // 获取项目交付物
  getProjectDeliverables(project, deliverables) {
    if (!project || !deliverables) return [];

    return deliverables.filter(
      (deliverable) => deliverable.projectId === project.id
    );
  }

  // 获取项目DCP评审
  getProjectDCPReviews(project, dcpReviews) {
    if (!project || !dcpReviews) return [];

    return dcpReviews.filter((review) => review.projectId === project.id);
  }

  // 验证项目数据
  validateProjectData(projectData) {
    const errors = [];

    if (!projectData.name || projectData.name.trim() === "") {
      errors.push("项目名称不能为空");
    }

    if (!projectData.description || projectData.description.trim() === "") {
      errors.push("项目描述不能为空");
    }

    if (projectData.name && projectData.name.length > 100) {
      errors.push("项目名称不能超过100个字符");
    }

    if (projectData.description && projectData.description.length > 500) {
      errors.push("项目描述不能超过500个字符");
    }

    return errors;
  }

  // 格式化项目数据用于显示
  formatProjectForDisplay(project) {
    return {
      ...project,
      formattedCreatedAt: this.formatDate(project.createdAt),
      formattedUpdatedAt: this.formatDate(project.updatedAt),
      overallProgress: this.calculateProjectProgress(project),
      statusText: this.getStatusText(project.status),
      currentStageText: this.getStageText(project.currentStage),
    };
  }

  // 格式化日期
  formatDate(dateString) {
    if (!dateString) return "未设置";
    const date = new Date(dateString);
    return (
      date.toLocaleDateString("zh-CN") +
      " " +
      date.toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" })
    );
  }

  // 获取状态文本
  getStatusText(status) {
    const statusMap = {
      not_started: "未开始",
      in_progress: "进行中",
      completed: "已完成",
      blocked: "已阻塞",
    };
    return statusMap[status] || status;
  }

  // 获取阶段文本
  getStageText(stage) {
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
}

// 全局项目服务实例
const projectService = new ProjectService(api);
