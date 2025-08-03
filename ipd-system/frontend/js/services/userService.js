// 用户服务 - 处理用户相关的业务逻辑
class UserService {
  constructor(apiService) {
    this.api = apiService;
  }

  // 获取用户统计信息
  getUserStats(users) {
    const stats = {
      total: users.length,
      admin: 0,
      project_manager: 0,
      team_member: 0,
      reviewer: 0,
    };

    users.forEach((user) => {
      if (stats.hasOwnProperty(user.role)) {
        stats[user.role]++;
      }
    });

    return stats;
  }

  // 按部门分组用户
  getUsersByDepartment(users) {
    const departments = {};

    users.forEach((user) => {
      const dept = user.department || "未分配";
      if (!departments[dept]) {
        departments[dept] = [];
      }
      departments[dept].push(user);
    });

    return departments;
  }

  // 按职能分组用户
  getUsersByFunction(users) {
    const functions = {};

    users.forEach((user) => {
      const func = user.function || "未分配";
      if (!functions[func]) {
        functions[func] = [];
      }
      functions[func].push(user);
    });

    return functions;
  }

  // 获取用户参与的项目
  getUserProjects(user, projects) {
    if (!user || !user.projects || !projects) return [];

    return projects.filter((project) => user.projects.includes(project.id));
  }

  // 获取用户的任务
  getUserTasks(user, tasks) {
    if (!user || !tasks) return [];

    return tasks.filter((task) => task.assignee === user.id);
  }

  // 验证用户数据
  validateUserData(userData) {
    const errors = [];

    if (!userData.name || userData.name.trim() === "") {
      errors.push("用户姓名不能为空");
    }

    if (!userData.email || userData.email.trim() === "") {
      errors.push("邮箱地址不能为空");
    }

    if (userData.email && !this.isValidEmail(userData.email)) {
      errors.push("邮箱地址格式不正确");
    }

    if (!userData.role) {
      errors.push("用户角色不能为空");
    }

    if (!userData.department || userData.department.trim() === "") {
      errors.push("所属部门不能为空");
    }

    if (!userData.function || userData.function.trim() === "") {
      errors.push("职能角色不能为空");
    }

    return errors;
  }

  // 验证邮箱格式
  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // 格式化用户数据用于显示
  formatUserForDisplay(user) {
    return {
      ...user,
      formattedCreatedAt: this.formatDate(user.createdAt),
      formattedUpdatedAt: this.formatDate(user.updatedAt),
      roleText: this.getRoleText(user.role),
      avatarInitials: this.getAvatarInitials(user.name),
    };
  }

  // 获取用户头像首字母
  getAvatarInitials(name) {
    if (!name) return "?";
    const names = name.trim().split(" ");
    if (names.length >= 2) {
      return names[0].charAt(0) + names[1].charAt(0);
    }
    return name.charAt(0);
  }

  // 获取角色文本
  getRoleText(role) {
    const roleMap = {
      admin: "系统管理员",
      project_manager: "项目经理",
      team_member: "团队成员",
      reviewer: "评审员",
    };
    return roleMap[role] || role;
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

  // 检查用户权限
  hasPermission(user, permission) {
    if (!user || !user.role) return false;

    const permissions = {
      admin: ["all"],
      project_manager: ["project_manage", "team_manage", "dcp_review"],
      team_member: ["task_manage", "deliverable_upload"],
      reviewer: ["dcp_review"],
    };

    const userPermissions = permissions[user.role] || [];
    return (
      userPermissions.includes("all") || userPermissions.includes(permission)
    );
  }

  // 获取当前用户（模拟）
  getCurrentUser(users) {
    // 在实际应用中，这里应该从认证系统获取当前用户
    // 这里返回第一个项目经理作为演示
    return users.find((user) => user.role === "project_manager") || users[0];
  }
}

// 全局用户服务实例
const userService = new UserService(api);
