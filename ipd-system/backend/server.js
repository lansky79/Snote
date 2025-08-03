const express = require("express");
const cors = require("cors");
const path = require("path");
const { exec } = require("child_process");
const { promisify } = require("util");
const DataService = require("./services/dataService");

const execAsync = promisify(exec);

// 日志工具
const logger = {
  info: (message, ...args) => {
    console.log(`[${new Date().toISOString()}] [INFO] ${message}`, ...args);
  },
  error: (message, ...args) => {
    console.error(`[${new Date().toISOString()}] [ERROR] ${message}`, ...args);
  },
  warn: (message, ...args) => {
    console.warn(`[${new Date().toISOString()}] [WARN] ${message}`, ...args);
  },
  debug: (message, ...args) => {
    if (process.env.NODE_ENV === "development") {
      console.log(`[${new Date().toISOString()}] [DEBUG] ${message}`, ...args);
    }
  },
};

// 端口检测和进程管理工具
const portUtils = {
  // 检测端口是否被占用
  async checkPort(port) {
    try {
      const command =
        process.platform === "win32"
          ? `netstat -ano | findstr :${port}`
          : `lsof -i :${port}`;

      const { stdout } = await execAsync(command);
      return stdout.trim() !== "";
    } catch (error) {
      // 如果命令执行失败或没有找到占用的端口，返回false
      return false;
    }
  },

  // 获取占用端口的进程ID
  async getProcessOnPort(port) {
    try {
      if (process.platform === "win32") {
        const { stdout } = await execAsync(`netstat -ano | findstr :${port}`);
        const lines = stdout.trim().split("\n");
        const pids = [];

        for (const line of lines) {
          const parts = line.trim().split(/\s+/);
          if (parts.length >= 5) {
            const pid = parts[parts.length - 1];
            if (pid && !isNaN(pid) && !pids.includes(pid)) {
              pids.push(pid);
            }
          }
        }
        return pids;
      } else {
        const { stdout } = await execAsync(`lsof -ti :${port}`);
        return stdout
          .trim()
          .split("\n")
          .filter((pid) => pid);
      }
    } catch (error) {
      return [];
    }
  },

  // 杀死占用端口的进程
  async killProcessOnPort(port) {
    try {
      const pids = await this.getProcessOnPort(port);
      if (pids.length === 0) {
        return { success: true, message: `端口 ${port} 未被占用` };
      }

      logger.info(`发现端口 ${port} 被以下进程占用: ${pids.join(", ")}`);

      for (const pid of pids) {
        try {
          // 检查是否是Node.js进程
          const isNodeProcess = await this.isNodeProcess(pid);
          if (isNodeProcess) {
            logger.info(`正在终止Node.js进程 ${pid}...`);

            if (process.platform === "win32") {
              await execAsync(`taskkill /F /PID ${pid}`);
            } else {
              await execAsync(`kill -9 ${pid}`);
            }

            logger.info(`✅ 成功终止进程 ${pid}`);
          } else {
            logger.warn(`跳过非Node.js进程 ${pid}`);
          }
        } catch (error) {
          logger.warn(`终止进程 ${pid} 失败: ${error.message}`);
        }
      }

      // 等待一下让进程完全终止
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // 再次检查端口是否已释放
      const stillOccupied = await this.checkPort(port);
      if (stillOccupied) {
        return { success: false, message: `端口 ${port} 仍被占用，请手动处理` };
      }

      return { success: true, message: `端口 ${port} 已释放` };
    } catch (error) {
      return {
        success: false,
        message: `清理端口 ${port} 失败: ${error.message}`,
      };
    }
  },

  // 检查是否是Node.js进程
  async isNodeProcess(pid) {
    try {
      if (process.platform === "win32") {
        const { stdout } = await execAsync(
          `tasklist /FI "PID eq ${pid}" /FO CSV`
        );
        return stdout.toLowerCase().includes("node.exe");
      } else {
        const { stdout } = await execAsync(`ps -p ${pid} -o comm=`);
        return stdout.toLowerCase().includes("node");
      }
    } catch (error) {
      return false;
    }
  },

  // 寻找下一个可用端口
  async findAvailablePort(startPort, maxAttempts = 10) {
    for (let i = 0; i < maxAttempts; i++) {
      const port = startPort + i;
      const isOccupied = await this.checkPort(port);
      if (!isOccupied) {
        return port;
      }
    }
    throw new Error(
      `无法找到可用端口，已尝试 ${startPort} 到 ${startPort + maxAttempts - 1}`
    );
  },
};

const app = express();
const PORT = process.env.PORT || 3004;

// 中间件
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "../frontend")));

// 请求日志中间件
app.use((req, res, next) => {
  const start = Date.now();

  // 记录请求开始
  logger.debug(`${req.method} ${req.url} - 开始处理`);

  // 监听响应结束
  res.on("finish", () => {
    const duration = Date.now() - start;
    const statusColor =
      res.statusCode >= 400 ? "🔴" : res.statusCode >= 300 ? "🟡" : "🟢";
    logger.info(
      `${statusColor} ${req.method} ${req.url} - ${res.statusCode} - ${duration}ms`
    );
  });

  next();
});

// 数据服务实例
const dataService = new DataService();

// 系统信息
const systemInfo = {
  name: "IPD项目协作系统",
  version: "1.0.0",
  startTime: new Date().toISOString(),
  nodeVersion: process.version,
  platform: process.platform,
  arch: process.arch,
};

// 健康检查端点
app.get("/api/health", (req, res) => {
  const uptime = process.uptime();
  const memoryUsage = process.memoryUsage();

  res.json({
    success: true,
    data: {
      status: "healthy",
      timestamp: new Date().toISOString(),
      uptime: `${Math.floor(uptime / 60)}分${Math.floor(uptime % 60)}秒`,
      system: systemInfo,
      memory: {
        used: `${Math.round(memoryUsage.heapUsed / 1024 / 1024)}MB`,
        total: `${Math.round(memoryUsage.heapTotal / 1024 / 1024)}MB`,
        external: `${Math.round(memoryUsage.external / 1024 / 1024)}MB`,
      },
    },
  });
});

// 系统信息端点
app.get("/api/info", (req, res) => {
  res.json({
    success: true,
    data: {
      ...systemInfo,
      endpoints: {
        health: "/api/health",
        projects: "/api/projects",
        users: "/api/users",
        dcp: "/api/dcp/reviews",
        deliverables: "/api/deliverables",
        tasks: "/api/tasks",
      },
    },
  });
});

// 数据验证中间件
function validateProjectData(req, res, next) {
  const { name, description } = req.body;
  const errors = [];

  if (!name || typeof name !== "string" || name.trim() === "") {
    errors.push("项目名称不能为空");
  }
  if (name && name.length > 100) {
    errors.push("项目名称不能超过100个字符");
  }
  if (
    !description ||
    typeof description !== "string" ||
    description.trim() === ""
  ) {
    errors.push("项目描述不能为空");
  }
  if (description && description.length > 500) {
    errors.push("项目描述不能超过500个字符");
  }

  if (errors.length > 0) {
    return res.status(400).json({ success: false, error: errors.join(", ") });
  }

  next();
}

function validateUserData(req, res, next) {
  const { name, email, role, department, function: userFunction } = req.body;
  const errors = [];

  if (!name || typeof name !== "string" || name.trim() === "") {
    errors.push("用户姓名不能为空");
  }
  if (!email || typeof email !== "string" || email.trim() === "") {
    errors.push("邮箱地址不能为空");
  }
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.push("邮箱地址格式不正确");
  }
  if (
    !role ||
    !["admin", "project_manager", "team_member", "reviewer"].includes(role)
  ) {
    errors.push("用户角色无效");
  }
  if (
    !department ||
    typeof department !== "string" ||
    department.trim() === ""
  ) {
    errors.push("所属部门不能为空");
  }
  if (
    !userFunction ||
    typeof userFunction !== "string" ||
    userFunction.trim() === ""
  ) {
    errors.push("职能角色不能为空");
  }

  if (errors.length > 0) {
    return res.status(400).json({ success: false, error: errors.join(", ") });
  }

  next();
}

function validateDCPReviewData(req, res, next) {
  const { projectId, stage, title, reviewers, deadline } = req.body;
  const errors = [];

  if (!projectId || typeof projectId !== "string") {
    errors.push("项目ID不能为空");
  }
  if (
    !stage ||
    !["concept", "plan", "develop", "verify", "release", "lifecycle"].includes(
      stage
    )
  ) {
    errors.push("阶段参数无效");
  }
  if (!title || typeof title !== "string" || title.trim() === "") {
    errors.push("评审标题不能为空");
  }
  if (!reviewers || !Array.isArray(reviewers) || reviewers.length === 0) {
    errors.push("评审员列表不能为空");
  }
  if (!deadline || isNaN(new Date(deadline).getTime())) {
    errors.push("截止时间格式无效");
  }

  if (errors.length > 0) {
    return res.status(400).json({ success: false, error: errors.join(", ") });
  }

  next();
}

// 项目管理API路由
app.get("/api/projects", async (req, res) => {
  try {
    const projects = await dataService.getAllProjects();
    res.json({ success: true, data: projects });
  } catch (error) {
    console.error("获取项目列表失败:", error);
    res.status(500).json({ success: false, error: "获取项目列表失败" });
  }
});

app.get("/api/projects/:id", async (req, res) => {
  try {
    const project = await dataService.getProjectById(req.params.id);
    if (!project) {
      return res.status(404).json({ success: false, error: "项目不存在" });
    }
    res.json({ success: true, data: project });
  } catch (error) {
    console.error("获取项目详情失败:", error);
    res.status(500).json({ success: false, error: "获取项目详情失败" });
  }
});

app.post("/api/projects", validateProjectData, async (req, res) => {
  try {
    const newProject = await dataService.createProject(req.body);
    if (!newProject) {
      return res.status(500).json({ success: false, error: "创建项目失败" });
    }
    res.json({ success: true, data: newProject });
  } catch (error) {
    console.error("创建项目失败:", error);
    res.status(500).json({ success: false, error: "创建项目失败" });
  }
});

app.put("/api/projects/:id", validateProjectData, async (req, res) => {
  try {
    const updatedProject = await dataService.updateProject(
      req.params.id,
      req.body
    );
    if (!updatedProject) {
      return res.status(404).json({ success: false, error: "项目不存在" });
    }
    res.json({ success: true, data: updatedProject });
  } catch (error) {
    console.error("更新项目失败:", error);
    res.status(500).json({ success: false, error: "更新项目失败" });
  }
});

app.delete("/api/projects/:id", async (req, res) => {
  try {
    const success = await dataService.deleteProject(req.params.id);
    if (!success) {
      return res.status(404).json({ success: false, error: "项目不存在" });
    }
    res.json({ success: true, message: "项目删除成功" });
  } catch (error) {
    console.error("删除项目失败:", error);
    res.status(500).json({ success: false, error: "删除项目失败" });
  }
});

app.put("/api/projects/:id/stages/:stage", async (req, res) => {
  try {
    const updatedProject = await dataService.updateProjectStage(
      req.params.id,
      req.params.stage,
      req.body
    );
    if (!updatedProject) {
      return res
        .status(404)
        .json({ success: false, error: "项目或阶段不存在" });
    }
    res.json({ success: true, data: updatedProject });
  } catch (error) {
    console.error("更新项目阶段失败:", error);
    res.status(500).json({ success: false, error: "更新项目阶段失败" });
  }
});

// 用户管理API路由
app.get("/api/users", async (req, res) => {
  try {
    const users = await dataService.getAllUsers();
    res.json({ success: true, data: users });
  } catch (error) {
    console.error("获取用户列表失败:", error);
    res.status(500).json({ success: false, error: "获取用户列表失败" });
  }
});

app.get("/api/users/:id", async (req, res) => {
  try {
    const user = await dataService.getUserById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, error: "用户不存在" });
    }
    res.json({ success: true, data: user });
  } catch (error) {
    console.error("获取用户详情失败:", error);
    res.status(500).json({ success: false, error: "获取用户详情失败" });
  }
});

app.post("/api/users", validateUserData, async (req, res) => {
  try {
    const newUser = await dataService.createUser(req.body);
    if (!newUser) {
      return res.status(500).json({ success: false, error: "创建用户失败" });
    }
    res.json({ success: true, data: newUser });
  } catch (error) {
    console.error("创建用户失败:", error);
    res.status(500).json({ success: false, error: "创建用户失败" });
  }
});

app.put("/api/users/:id", validateUserData, async (req, res) => {
  try {
    const updatedUser = await dataService.updateUser(req.params.id, req.body);
    if (!updatedUser) {
      return res.status(404).json({ success: false, error: "用户不存在" });
    }
    res.json({ success: true, data: updatedUser });
  } catch (error) {
    console.error("更新用户失败:", error);
    res.status(500).json({ success: false, error: "更新用户失败" });
  }
});

app.delete("/api/users/:id", async (req, res) => {
  try {
    const success = await dataService.deleteUser(req.params.id);
    if (!success) {
      return res.status(404).json({ success: false, error: "用户不存在" });
    }
    res.json({ success: true, message: "用户删除成功" });
  } catch (error) {
    console.error("删除用户失败:", error);
    res.status(500).json({ success: false, error: "删除用户失败" });
  }
});

// DCP评审API路由
app.get("/api/dcp/reviews", async (req, res) => {
  try {
    const reviews = await dataService.getAllDCPReviews();
    res.json({ success: true, data: reviews });
  } catch (error) {
    console.error("获取DCP评审列表失败:", error);
    res.status(500).json({ success: false, error: "获取DCP评审列表失败" });
  }
});

app.post("/api/dcp/reviews", validateDCPReviewData, async (req, res) => {
  try {
    const newReview = await dataService.createDCPReview(req.body);
    if (!newReview) {
      return res.status(500).json({ success: false, error: "创建DCP评审失败" });
    }
    res.json({ success: true, data: newReview });
  } catch (error) {
    console.error("创建DCP评审失败:", error);
    res.status(500).json({ success: false, error: "创建DCP评审失败" });
  }
});

app.put("/api/dcp/reviews/:id", async (req, res) => {
  try {
    const updatedReview = await dataService.updateDCPReview(
      req.params.id,
      req.body
    );
    if (!updatedReview) {
      return res.status(404).json({ success: false, error: "DCP评审不存在" });
    }
    res.json({ success: true, data: updatedReview });
  } catch (error) {
    console.error("更新DCP评审失败:", error);
    res.status(500).json({ success: false, error: "更新DCP评审失败" });
  }
});

app.post("/api/dcp/reviews/:id/comments", async (req, res) => {
  try {
    const updatedReview = await dataService.addDCPComment(
      req.params.id,
      req.body
    );
    if (!updatedReview) {
      return res.status(404).json({ success: false, error: "DCP评审不存在" });
    }
    res.json({ success: true, data: updatedReview });
  } catch (error) {
    console.error("添加DCP评审意见失败:", error);
    res.status(500).json({ success: false, error: "添加DCP评审意见失败" });
  }
});

// 交付物管理API路由
app.get("/api/deliverables", async (req, res) => {
  try {
    const deliverables = await dataService.getAllDeliverables();
    res.json({ success: true, data: deliverables });
  } catch (error) {
    console.error("获取交付物列表失败:", error);
    res.status(500).json({ success: false, error: "获取交付物列表失败" });
  }
});

app.get("/api/deliverables/:id", async (req, res) => {
  try {
    const deliverable = await dataService.getDeliverableById(req.params.id);
    if (!deliverable) {
      return res.status(404).json({ success: false, error: "交付物不存在" });
    }
    res.json({ success: true, data: deliverable });
  } catch (error) {
    console.error("获取交付物详情失败:", error);
    res.status(500).json({ success: false, error: "获取交付物详情失败" });
  }
});

app.post("/api/deliverables", async (req, res) => {
  try {
    const newDeliverable = await dataService.createDeliverable(req.body);
    res.json({ success: true, data: newDeliverable });
  } catch (error) {
    console.error("创建交付物失败:", error);
    res.status(500).json({ success: false, error: "创建交付物失败" });
  }
});

app.put("/api/deliverables/:id", async (req, res) => {
  try {
    const updatedDeliverable = await dataService.updateDeliverable(
      req.params.id,
      req.body
    );
    if (!updatedDeliverable) {
      return res.status(404).json({ success: false, error: "交付物不存在" });
    }
    res.json({ success: true, data: updatedDeliverable });
  } catch (error) {
    console.error("更新交付物失败:", error);
    res.status(500).json({ success: false, error: "更新交付物失败" });
  }
});

app.delete("/api/deliverables/:id", async (req, res) => {
  try {
    const success = await dataService.deleteDeliverable(req.params.id);
    if (!success) {
      return res.status(404).json({ success: false, error: "交付物不存在" });
    }
    res.json({ success: true, message: "交付物删除成功" });
  } catch (error) {
    console.error("删除交付物失败:", error);
    res.status(500).json({ success: false, error: "删除交付物失败" });
  }
});

app.get("/api/deliverables/:id/versions", async (req, res) => {
  try {
    const versions = await dataService.getDeliverableVersions(req.params.id);
    res.json({ success: true, data: versions });
  } catch (error) {
    console.error("获取交付物版本历史失败:", error);
    res.status(500).json({ success: false, error: "获取交付物版本历史失败" });
  }
});

app.post("/api/deliverables/:id/approve", async (req, res) => {
  try {
    const updatedDeliverable = await dataService.approveDeliverable(
      req.params.id,
      req.body
    );
    if (!updatedDeliverable) {
      return res.status(404).json({ success: false, error: "交付物不存在" });
    }
    res.json({ success: true, data: updatedDeliverable });
  } catch (error) {
    console.error("审批交付物失败:", error);
    res.status(500).json({ success: false, error: "审批交付物失败" });
  }
});

// 任务管理API路由
app.get("/api/tasks", async (req, res) => {
  try {
    const tasks = await dataService.getAllTasks();
    res.json({ success: true, data: tasks });
  } catch (error) {
    console.error("获取任务列表失败:", error);
    res.status(500).json({ success: false, error: "获取任务列表失败" });
  }
});

app.post("/api/tasks", async (req, res) => {
  try {
    const newTask = await dataService.createTask(req.body);
    res.json({ success: true, data: newTask });
  } catch (error) {
    console.error("创建任务失败:", error);
    res.status(500).json({ success: false, error: "创建任务失败" });
  }
});

app.put("/api/tasks/:id", async (req, res) => {
  try {
    const updatedTask = await dataService.updateTask(req.params.id, req.body);
    if (!updatedTask) {
      return res.status(404).json({ success: false, error: "任务不存在" });
    }
    res.json({ success: true, data: updatedTask });
  } catch (error) {
    console.error("更新任务失败:", error);
    res.status(500).json({ success: false, error: "更新任务失败" });
  }
});

// 错误处理中间件
app.use((err, req, res, next) => {
  logger.error(`服务器错误 - ${req.method} ${req.url}:`, err.message);
  logger.debug("错误堆栈:", err.stack);

  // 根据错误类型返回不同的状态码
  let statusCode = 500;
  let message = "服务器内部错误";

  if (err.name === "ValidationError") {
    statusCode = 400;
    message = "数据验证失败";
  } else if (err.name === "UnauthorizedError") {
    statusCode = 401;
    message = "未授权访问";
  } else if (err.name === "NotFoundError") {
    statusCode = 404;
    message = "资源不存在";
  }

  res.status(statusCode).json({
    success: false,
    error: message,
    ...(process.env.NODE_ENV === "development" && { details: err.message }),
  });
});

// 404处理
app.use((req, res) => {
  logger.warn(`404 - 接口不存在: ${req.method} ${req.url}`);
  res.status(404).json({
    success: false,
    error: "接口不存在",
    path: req.url,
    method: req.method,
  });
});

// 启动服务器函数
async function startServer() {
  let actualPort = PORT;

  try {
    logger.info("🔍 检查端口占用情况...");

    // 检查目标端口是否被占用
    const isPortOccupied = await portUtils.checkPort(PORT);

    if (isPortOccupied) {
      logger.warn(`⚠️  端口 ${PORT} 已被占用`);

      // 尝试清理占用端口的进程
      const cleanResult = await portUtils.killProcessOnPort(PORT);

      if (cleanResult.success) {
        logger.info(`✅ ${cleanResult.message}`);
        actualPort = PORT;
      } else {
        logger.warn(`❌ ${cleanResult.message}`);
        logger.info("🔍 寻找可用端口...");

        // 寻找下一个可用端口
        actualPort = await portUtils.findAvailablePort(PORT);
        logger.info(`✅ 找到可用端口: ${actualPort}`);
      }
    } else {
      logger.info(`✅ 端口 ${PORT} 可用`);
    }

    // 启动服务器
    const server = app.listen(actualPort, () => {
      logger.info("=".repeat(60));
      logger.info("🚀 IPD项目协作系统后端服务已启动");
      logger.info("=".repeat(60));
      logger.info(`📍 服务器地址: http://localhost:${actualPort}`);
      logger.info(`🌐 前端页面: http://localhost:${actualPort}/index.html`);
      logger.info(`🔗 API接口: http://localhost:${actualPort}/api`);
      logger.info(`📁 数据目录: ${path.join(__dirname, "data")}`);
      logger.info(`⚙️  环境模式: ${process.env.NODE_ENV || "development"}`);

      if (actualPort !== PORT) {
        logger.warn(
          `⚠️  注意: 使用备用端口 ${actualPort} (原端口 ${PORT} 被占用)`
        );
      }

      logger.info("=".repeat(60));
      logger.info("💡 按 Ctrl+C 停止服务器");
      logger.info("📖 查看 README.md 了解更多信息");

      // 开发模式下自动打开浏览器
      if (
        process.env.NODE_ENV === "development" ||
        process.env.AUTO_OPEN === "true"
      ) {
        setTimeout(() => {
          const url = `http://localhost:${actualPort}/index.html`;
          logger.info(`🌐 正在打开浏览器: ${url}`);

          const command =
            process.platform === "win32"
              ? `start ${url}`
              : process.platform === "darwin"
              ? `open ${url}`
              : `xdg-open ${url}`;

          exec(command, (error) => {
            if (error) {
              logger.warn(`无法自动打开浏览器: ${error.message}`);
              logger.info(`请手动访问: ${url}`);
            }
          });
        }, 1000);
      }
    });

    // 保存服务器实例以便后续使用
    global.serverInstance = server;
    global.actualPort = actualPort;
  } catch (error) {
    logger.error("❌ 服务器启动失败:", error.message);
    process.exit(1);
  }
}

// 启动服务器
startServer();

// 优雅关闭
process.on("SIGINT", () => {
  logger.info("\n🛑 收到停止信号，正在关闭服务器...");
  logger.info("👋 IPD项目协作系统已停止");
  process.exit(0);
});

process.on("SIGTERM", () => {
  logger.info("\n🛑 收到终止信号，正在关闭服务器...");
  logger.info("👋 IPD项目协作系统已停止");
  process.exit(0);
});

// 未捕获异常处理
process.on("uncaughtException", (error) => {
  logger.error("未捕获的异常:", error);
  process.exit(1);
});

process.on("unhandledRejection", (reason, promise) => {
  logger.error("未处理的Promise拒绝:", reason);
  logger.error("Promise:", promise);
});
