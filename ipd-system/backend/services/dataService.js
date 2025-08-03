const fs = require("fs").promises;
const path = require("path");

class DataService {
  constructor() {
    this.dataPath = path.join(__dirname, "../data");
    this.initializeDataFiles();
  }

  async initializeDataFiles() {
    try {
      await fs.mkdir(this.dataPath, { recursive: true });
      console.log("数据目录初始化完成");
    } catch (error) {
      console.error("数据目录初始化失败:", error);
    }
  }

  async readJsonFile(filename) {
    try {
      const filePath = path.join(this.dataPath, filename);
      const data = await fs.readFile(filePath, "utf8");
      return JSON.parse(data);
    } catch (error) {
      if (error.code === "ENOENT") {
        console.log(`文件 ${filename} 不存在，返回默认数据`);
        return this.getDefaultData(filename);
      }
      console.error(`读取文件 ${filename} 失败:`, error);
      return null;
    }
  }

  async writeJsonFile(filename, data) {
    try {
      const filePath = path.join(this.dataPath, filename);
      await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf8");
      return true;
    } catch (error) {
      console.error(`写入文件 ${filename} 失败:`, error);
      return false;
    }
  }

  getDefaultData(filename) {
    switch (filename) {
      case "projects.json":
        return {
          projects: [
            {
              id: "proj_001",
              name: "智能手机产品开发",
              description:
                "新一代智能手机产品研发项目，集成最新的AI技术和5G通信能力",
              status: "in_progress",
              currentStage: "develop",
              createdAt: "2024-01-15T08:00:00Z",
              updatedAt: "2024-02-01T10:30:00Z",
              teamLeader: "user_001",
              stages: {
                concept: {
                  name: "概念阶段",
                  status: "completed",
                  progress: 100,
                  startDate: "2024-01-15",
                  endDate: "2024-01-30",
                  tasks: [
                    {
                      id: "task_001",
                      name: "市场需求分析",
                      status: "completed",
                      assignee: "user_002",
                    },
                    {
                      id: "task_002",
                      name: "技术可行性评估",
                      status: "completed",
                      assignee: "user_003",
                    },
                  ],
                },
                plan: {
                  name: "计划阶段",
                  status: "completed",
                  progress: 100,
                  startDate: "2024-02-01",
                  endDate: "2024-02-15",
                  tasks: [
                    {
                      id: "task_003",
                      name: "项目计划制定",
                      status: "completed",
                      assignee: "user_001",
                    },
                  ],
                },
                develop: {
                  name: "开发阶段",
                  status: "in_progress",
                  progress: 65,
                  startDate: "2024-02-16",
                  endDate: null,
                  tasks: [
                    {
                      id: "task_004",
                      name: "硬件设计开发",
                      status: "in_progress",
                      assignee: "user_004",
                    },
                    {
                      id: "task_005",
                      name: "软件系统开发",
                      status: "in_progress",
                      assignee: "user_005",
                    },
                  ],
                },
                verify: {
                  name: "验证阶段",
                  status: "not_started",
                  progress: 0,
                  startDate: null,
                  endDate: null,
                  tasks: [],
                },
                release: {
                  name: "发布阶段",
                  status: "not_started",
                  progress: 0,
                  startDate: null,
                  endDate: null,
                  tasks: [],
                },
                lifecycle: {
                  name: "生命周期阶段",
                  status: "not_started",
                  progress: 0,
                  startDate: null,
                  endDate: null,
                  tasks: [],
                },
              },
            },
            {
              id: "proj_002",
              name: "企业管理软件系统",
              description: "面向中小企业的一体化管理软件解决方案",
              status: "not_started",
              currentStage: "concept",
              createdAt: "2024-02-10T09:00:00Z",
              updatedAt: "2024-02-10T09:00:00Z",
              teamLeader: "user_006",
              stages: {
                concept: {
                  name: "概念阶段",
                  status: "in_progress",
                  progress: 30,
                  startDate: "2024-02-10",
                  endDate: null,
                  tasks: [
                    {
                      id: "task_006",
                      name: "客户需求调研",
                      status: "in_progress",
                      assignee: "user_007",
                    },
                  ],
                },
                plan: {
                  name: "计划阶段",
                  status: "not_started",
                  progress: 0,
                  startDate: null,
                  endDate: null,
                  tasks: [],
                },
                develop: {
                  name: "开发阶段",
                  status: "not_started",
                  progress: 0,
                  startDate: null,
                  endDate: null,
                  tasks: [],
                },
                verify: {
                  name: "验证阶段",
                  status: "not_started",
                  progress: 0,
                  startDate: null,
                  endDate: null,
                  tasks: [],
                },
                release: {
                  name: "发布阶段",
                  status: "not_started",
                  progress: 0,
                  startDate: null,
                  endDate: null,
                  tasks: [],
                },
                lifecycle: {
                  name: "生命周期阶段",
                  status: "not_started",
                  progress: 0,
                  startDate: null,
                  endDate: null,
                  tasks: [],
                },
              },
            },
          ],
        };
      case "users.json":
        return {
          users: [
            {
              id: "user_001",
              name: "张明",
              email: "zhangming@company.com",
              role: "project_manager",
              department: "产品研发部",
              function: "项目管理",
              avatar: "/images/avatars/user_001.jpg",
              projects: ["proj_001"],
              createdAt: "2024-01-01T08:00:00Z",
              updatedAt: "2024-01-15T10:30:00Z",
            },
            {
              id: "user_002",
              name: "李华",
              email: "lihua@company.com",
              role: "team_member",
              department: "市场部",
              function: "市场分析",
              avatar: "/images/avatars/user_002.jpg",
              projects: ["proj_001"],
              createdAt: "2024-01-01T08:00:00Z",
              updatedAt: "2024-01-15T10:30:00Z",
            },
            {
              id: "user_003",
              name: "王强",
              email: "wangqiang@company.com",
              role: "team_member",
              department: "技术部",
              function: "技术架构",
              avatar: "/images/avatars/user_003.jpg",
              projects: ["proj_001"],
              createdAt: "2024-01-01T08:00:00Z",
              updatedAt: "2024-01-15T10:30:00Z",
            },
            {
              id: "user_004",
              name: "赵敏",
              email: "zhaomin@company.com",
              role: "team_member",
              department: "硬件部",
              function: "硬件设计",
              avatar: "/images/avatars/user_004.jpg",
              projects: ["proj_001"],
              createdAt: "2024-01-01T08:00:00Z",
              updatedAt: "2024-01-15T10:30:00Z",
            },
            {
              id: "user_005",
              name: "刘洋",
              email: "liuyang@company.com",
              role: "team_member",
              department: "软件部",
              function: "软件开发",
              avatar: "/images/avatars/user_005.jpg",
              projects: ["proj_001"],
              createdAt: "2024-01-01T08:00:00Z",
              updatedAt: "2024-01-15T10:30:00Z",
            },
            {
              id: "user_006",
              name: "陈静",
              email: "chenjing@company.com",
              role: "project_manager",
              department: "产品研发部",
              function: "项目管理",
              avatar: "/images/avatars/user_006.jpg",
              projects: ["proj_002"],
              createdAt: "2024-02-01T08:00:00Z",
              updatedAt: "2024-02-10T09:00:00Z",
            },
            {
              id: "user_007",
              name: "孙磊",
              email: "sunlei@company.com",
              role: "team_member",
              department: "市场部",
              function: "需求分析",
              avatar: "/images/avatars/user_007.jpg",
              projects: ["proj_002"],
              createdAt: "2024-02-01T08:00:00Z",
              updatedAt: "2024-02-10T09:00:00Z",
            },
          ],
        };
      case "dcp_reviews.json":
        return {
          reviews: [
            {
              id: "dcp_001",
              projectId: "proj_001",
              stage: "concept",
              title: "概念阶段DCP评审",
              status: "completed",
              result: "pass",
              reviewers: ["user_001", "user_002", "user_003"],
              deadline: "2024-01-30T18:00:00Z",
              createdAt: "2024-01-25T08:00:00Z",
              completedAt: "2024-01-29T16:30:00Z",
              comments: [
                {
                  id: "comment_001",
                  reviewerId: "user_001",
                  content: "市场需求分析充分，技术方案可行，建议通过",
                  decision: "approve",
                  createdAt: "2024-01-28T10:00:00Z",
                },
                {
                  id: "comment_002",
                  reviewerId: "user_002",
                  content: "市场前景良好，竞争分析到位，同意进入下一阶段",
                  decision: "approve",
                  createdAt: "2024-01-28T14:30:00Z",
                },
                {
                  id: "comment_003",
                  reviewerId: "user_003",
                  content: "技术架构设计合理，风险评估充分，支持通过",
                  decision: "approve",
                  createdAt: "2024-01-29T09:15:00Z",
                },
              ],
            },
            {
              id: "dcp_002",
              projectId: "proj_001",
              stage: "plan",
              title: "计划阶段DCP评审",
              status: "completed",
              result: "pass",
              reviewers: ["user_001", "user_003", "user_004"],
              deadline: "2024-02-15T18:00:00Z",
              createdAt: "2024-02-10T08:00:00Z",
              completedAt: "2024-02-14T17:00:00Z",
              comments: [
                {
                  id: "comment_004",
                  reviewerId: "user_001",
                  content: "项目计划详细，里程碑设置合理，资源配置充足",
                  decision: "approve",
                  createdAt: "2024-02-12T11:00:00Z",
                },
                {
                  id: "comment_005",
                  reviewerId: "user_003",
                  content: "技术实施方案可行，开发计划安排合理",
                  decision: "approve",
                  createdAt: "2024-02-13T15:20:00Z",
                },
                {
                  id: "comment_006",
                  reviewerId: "user_004",
                  content: "硬件开发计划周期合理，供应链风险已考虑",
                  decision: "approve",
                  createdAt: "2024-02-14T10:45:00Z",
                },
              ],
            },
            {
              id: "dcp_003",
              projectId: "proj_001",
              stage: "develop",
              title: "开发阶段DCP评审",
              status: "in_review",
              result: null,
              reviewers: ["user_001", "user_003", "user_004", "user_005"],
              deadline: "2024-03-15T18:00:00Z",
              createdAt: "2024-03-01T08:00:00Z",
              completedAt: null,
              comments: [
                {
                  id: "comment_007",
                  reviewerId: "user_003",
                  content: "当前开发进度符合预期，代码质量良好",
                  decision: "approve",
                  createdAt: "2024-03-05T14:30:00Z",
                },
              ],
            },
          ],
        };
      case "deliverables.json":
        return {
          deliverables: [
            {
              id: "deliv_001",
              projectId: "proj_001",
              stage: "concept",
              name: "市场需求分析报告",
              type: "document",
              description:
                "详细的市场需求调研和分析报告，包含目标市场分析、竞争对手研究、用户画像定义等内容",
              fileName: "market_analysis_report.pdf",
              fileSize: "2.5MB",
              version: "1.0",
              uploadedBy: "user_002",
              uploadedAt: "2024-01-25T10:30:00Z",
              updatedAt: "2024-01-25T10:30:00Z",
              downloadCount: 15,
              tags: ["市场分析", "需求调研", "竞争分析"],
              approvalStatus: "approved",
              approvedBy: "user_001",
              approvedAt: "2024-01-26T09:00:00Z",
              category: "需求文档",
              priority: "high",
              relatedTasks: ["task_001"],
              comments: [
                {
                  id: "comment_deliv_001",
                  userId: "user_001",
                  content: "分析很全面，建议补充一下海外市场的情况",
                  createdAt: "2024-01-26T08:30:00Z",
                },
              ],
            },
            {
              id: "deliv_002",
              projectId: "proj_001",
              stage: "concept",
              name: "技术可行性评估报告",
              type: "document",
              description:
                "技术方案可行性分析和风险评估，包含技术选型、架构设计、风险识别等",
              fileName: "tech_feasibility_report.pdf",
              fileSize: "1.8MB",
              version: "1.0",
              uploadedBy: "user_003",
              uploadedAt: "2024-01-28T16:45:00Z",
              updatedAt: "2024-01-28T16:45:00Z",
              downloadCount: 12,
              tags: ["技术评估", "可行性分析", "风险评估"],
              approvalStatus: "approved",
              approvedBy: "user_001",
              approvedAt: "2024-01-29T10:00:00Z",
              category: "技术文档",
              priority: "high",
              relatedTasks: ["task_002"],
              comments: [],
            },
            {
              id: "deliv_003",
              projectId: "proj_001",
              stage: "plan",
              name: "项目实施计划",
              type: "document",
              description:
                "详细的项目实施计划和时间安排，包含里程碑定义、资源配置、风险管控等",
              fileName: "project_implementation_plan.docx",
              fileSize: "1.2MB",
              version: "2.0",
              uploadedBy: "user_001",
              uploadedAt: "2024-02-12T09:15:00Z",
              updatedAt: "2024-02-14T11:20:00Z",
              downloadCount: 8,
              tags: ["项目计划", "里程碑", "资源配置"],
              approvalStatus: "approved",
              approvedBy: "user_006",
              approvedAt: "2024-02-14T14:00:00Z",
              category: "管理文档",
              priority: "high",
              relatedTasks: ["task_003"],
              comments: [
                {
                  id: "comment_deliv_002",
                  userId: "user_003",
                  content: "时间安排比较紧张，建议适当调整开发阶段的时间",
                  createdAt: "2024-02-13T15:30:00Z",
                },
              ],
            },
            {
              id: "deliv_004",
              projectId: "proj_001",
              stage: "develop",
              name: "系统架构设计文档",
              type: "design",
              description:
                "系统整体架构设计和技术选型，包含模块划分、接口定义、数据流设计等",
              fileName: "system_architecture_design.pdf",
              fileSize: "3.2MB",
              version: "1.0",
              uploadedBy: "user_003",
              uploadedAt: "2024-02-20T14:30:00Z",
              updatedAt: "2024-02-20T14:30:00Z",
              downloadCount: 20,
              tags: ["系统架构", "技术选型", "接口设计"],
              approvalStatus: "pending",
              approvedBy: null,
              approvedAt: null,
              category: "设计文档",
              priority: "high",
              relatedTasks: ["task_004", "task_005"],
              comments: [
                {
                  id: "comment_deliv_003",
                  userId: "user_005",
                  content: "架构设计合理，建议增加缓存层的设计",
                  createdAt: "2024-02-21T09:00:00Z",
                },
              ],
            },
            {
              id: "deliv_005",
              projectId: "proj_001",
              stage: "develop",
              name: "硬件原型设计图",
              type: "design",
              description:
                "硬件产品的详细设计图纸和规格说明，包含电路设计、结构设计、材料清单等",
              fileName: "hardware_prototype_design.dwg",
              fileSize: "5.7MB",
              version: "1.1",
              uploadedBy: "user_004",
              uploadedAt: "2024-02-25T11:00:00Z",
              updatedAt: "2024-03-02T15:30:00Z",
              downloadCount: 6,
              tags: ["硬件设计", "原型设计", "电路图"],
              approvalStatus: "revision_required",
              approvedBy: "user_001",
              approvedAt: null,
              category: "设计文档",
              priority: "medium",
              relatedTasks: ["task_004"],
              comments: [
                {
                  id: "comment_deliv_004",
                  userId: "user_001",
                  content: "设计整体不错，但需要优化散热设计",
                  createdAt: "2024-03-01T14:00:00Z",
                },
              ],
            },
            {
              id: "deliv_006",
              projectId: "proj_002",
              stage: "concept",
              name: "客户需求调研报告",
              type: "document",
              description:
                "中小企业管理软件需求调研报告，包含用户访谈、问卷调查、需求分析等",
              fileName: "customer_requirements_survey.pdf",
              fileSize: "1.9MB",
              version: "1.0",
              uploadedBy: "user_007",
              uploadedAt: "2024-02-20T16:00:00Z",
              updatedAt: "2024-02-20T16:00:00Z",
              downloadCount: 3,
              tags: ["需求调研", "用户访谈", "问卷调查"],
              approvalStatus: "pending",
              approvedBy: null,
              approvedAt: null,
              category: "需求文档",
              priority: "high",
              relatedTasks: ["task_006"],
              comments: [],
            },
            {
              id: "deliv_007",
              projectId: "proj_001",
              stage: "develop",
              name: "用户界面设计稿",
              type: "design",
              description:
                "产品用户界面设计稿，包含主要功能页面的视觉设计和交互流程",
              fileName: "ui_design_mockups.fig",
              fileSize: "12.3MB",
              version: "2.1",
              uploadedBy: "user_005",
              uploadedAt: "2024-03-05T10:15:00Z",
              updatedAt: "2024-03-08T14:20:00Z",
              downloadCount: 18,
              tags: ["UI设计", "交互设计", "视觉设计"],
              approvalStatus: "approved",
              approvedBy: "user_001",
              approvedAt: "2024-03-08T16:00:00Z",
              category: "设计文档",
              priority: "medium",
              relatedTasks: ["task_005"],
              comments: [
                {
                  id: "comment_deliv_005",
                  userId: "user_002",
                  content: "设计风格很好，符合目标用户的审美偏好",
                  createdAt: "2024-03-07T11:30:00Z",
                },
              ],
            },
            {
              id: "deliv_008",
              projectId: "proj_001",
              stage: "develop",
              name: "测试用例文档",
              type: "test",
              description:
                "系统功能测试用例文档，包含单元测试、集成测试、系统测试用例",
              fileName: "test_cases_document.xlsx",
              fileSize: "890KB",
              version: "1.0",
              uploadedBy: "user_003",
              uploadedAt: "2024-03-10T09:30:00Z",
              updatedAt: "2024-03-10T09:30:00Z",
              downloadCount: 5,
              tags: ["测试用例", "功能测试", "质量保证"],
              approvalStatus: "approved",
              approvedBy: "user_001",
              approvedAt: "2024-03-10T15:00:00Z",
              category: "测试文档",
              priority: "medium",
              relatedTasks: ["task_004", "task_005"],
              comments: [],
            },
          ],
        };
      case "tasks.json":
        return {
          tasks: [
            {
              id: "task_001",
              projectId: "proj_001",
              stage: "concept",
              name: "市场需求分析",
              description: "进行详细的市场调研和需求分析",
              status: "completed",
              priority: "high",
              assignee: "user_002",
              estimatedHours: 40,
              actualHours: 38,
              startDate: "2024-01-15",
              endDate: "2024-01-22",
              completedAt: "2024-01-22T17:30:00Z",
              createdAt: "2024-01-15T08:00:00Z",
              updatedAt: "2024-01-22T17:30:00Z",
            },
            {
              id: "task_002",
              projectId: "proj_001",
              stage: "concept",
              name: "技术可行性评估",
              description: "评估技术方案的可行性和风险",
              status: "completed",
              priority: "high",
              assignee: "user_003",
              estimatedHours: 32,
              actualHours: 35,
              startDate: "2024-01-18",
              endDate: "2024-01-28",
              completedAt: "2024-01-28T16:45:00Z",
              createdAt: "2024-01-18T09:00:00Z",
              updatedAt: "2024-01-28T16:45:00Z",
            },
            {
              id: "task_003",
              projectId: "proj_001",
              stage: "plan",
              name: "项目计划制定",
              description: "制定详细的项目实施计划",
              status: "completed",
              priority: "high",
              assignee: "user_001",
              estimatedHours: 24,
              actualHours: 26,
              startDate: "2024-02-01",
              endDate: "2024-02-12",
              completedAt: "2024-02-12T18:00:00Z",
              createdAt: "2024-02-01T08:00:00Z",
              updatedAt: "2024-02-12T18:00:00Z",
            },
            {
              id: "task_004",
              projectId: "proj_001",
              stage: "develop",
              name: "硬件设计开发",
              description: "进行硬件产品的详细设计和原型开发",
              status: "in_progress",
              priority: "high",
              assignee: "user_004",
              estimatedHours: 120,
              actualHours: 78,
              startDate: "2024-02-16",
              endDate: "2024-04-15",
              completedAt: null,
              createdAt: "2024-02-16T08:00:00Z",
              updatedAt: "2024-03-05T14:20:00Z",
            },
            {
              id: "task_005",
              projectId: "proj_001",
              stage: "develop",
              name: "软件系统开发",
              description: "开发产品的软件系统和用户界面",
              status: "in_progress",
              priority: "high",
              assignee: "user_005",
              estimatedHours: 160,
              actualHours: 95,
              startDate: "2024-02-20",
              endDate: "2024-05-20",
              completedAt: null,
              createdAt: "2024-02-20T08:00:00Z",
              updatedAt: "2024-03-08T16:45:00Z",
            },
            {
              id: "task_006",
              projectId: "proj_002",
              stage: "concept",
              name: "客户需求调研",
              description: "深入了解目标客户的具体需求和痛点",
              status: "in_progress",
              priority: "medium",
              assignee: "user_007",
              estimatedHours: 50,
              actualHours: 15,
              startDate: "2024-02-10",
              endDate: "2024-03-10",
              completedAt: null,
              createdAt: "2024-02-10T09:00:00Z",
              updatedAt: "2024-02-25T11:30:00Z",
            },
          ],
        };
      default:
        return {};
    }
  }

  // 项目相关操作
  async getAllProjects() {
    const data = await this.readJsonFile("projects.json");
    return data ? data.projects : [];
  }

  async getProjectById(projectId) {
    const projects = await this.getAllProjects();
    return projects.find((p) => p.id === projectId);
  }

  async createProject(projectData) {
    try {
      const data = await this.readJsonFile("projects.json");
      if (!data) {
        console.error("无法读取项目数据文件");
        return null;
      }

      // 检查项目名称是否已存在
      const existingProject = data.projects.find(
        (p) => p.name === projectData.name
      );
      if (existingProject) {
        console.error("项目名称已存在:", projectData.name);
        return null;
      }

      const newProject = {
        id: `proj_${Date.now()}`,
        name: projectData.name.trim(),
        description: projectData.description.trim(),
        status: "not_started",
        currentStage: "concept",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        teamLeader: projectData.teamLeader || null,
        stages: {
          concept: {
            name: "概念阶段",
            status: "not_started",
            progress: 0,
            startDate: null,
            endDate: null,
            tasks: [],
          },
          plan: {
            name: "计划阶段",
            status: "not_started",
            progress: 0,
            startDate: null,
            endDate: null,
            tasks: [],
          },
          develop: {
            name: "开发阶段",
            status: "not_started",
            progress: 0,
            startDate: null,
            endDate: null,
            tasks: [],
          },
          verify: {
            name: "验证阶段",
            status: "not_started",
            progress: 0,
            startDate: null,
            endDate: null,
            tasks: [],
          },
          release: {
            name: "发布阶段",
            status: "not_started",
            progress: 0,
            startDate: null,
            endDate: null,
            tasks: [],
          },
          lifecycle: {
            name: "生命周期阶段",
            status: "not_started",
            progress: 0,
            startDate: null,
            endDate: null,
            tasks: [],
          },
        },
      };

      data.projects.push(newProject);
      const success = await this.writeJsonFile("projects.json", data);

      if (success) {
        console.log("项目创建成功:", newProject.id, newProject.name);
        return newProject;
      } else {
        console.error("项目数据保存失败");
        return null;
      }
    } catch (error) {
      console.error("创建项目时发生错误:", error);
      return null;
    }
  }

  async updateProject(projectId, updates) {
    const data = await this.readJsonFile("projects.json");
    if (!data) return null;

    const projectIndex = data.projects.findIndex((p) => p.id === projectId);
    if (projectIndex === -1) return null;

    data.projects[projectIndex] = {
      ...data.projects[projectIndex],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    const success = await this.writeJsonFile("projects.json", data);
    return success ? data.projects[projectIndex] : null;
  }

  async deleteProject(projectId) {
    const data = await this.readJsonFile("projects.json");
    if (!data) return false;

    const originalLength = data.projects.length;
    data.projects = data.projects.filter((p) => p.id !== projectId);

    if (data.projects.length === originalLength) return false;

    return await this.writeJsonFile("projects.json", data);
  }

  async updateProjectStage(projectId, stage, stageData) {
    const data = await this.readJsonFile("projects.json");
    if (!data) return null;

    const projectIndex = data.projects.findIndex((p) => p.id === projectId);
    if (projectIndex === -1) return null;

    const project = data.projects[projectIndex];
    if (!project.stages[stage]) return null;

    project.stages[stage] = {
      ...project.stages[stage],
      ...stageData,
      updatedAt: new Date().toISOString(),
    };
    project.updatedAt = new Date().toISOString();

    const success = await this.writeJsonFile("projects.json", data);
    return success ? project : null;
  }

  // 用户相关操作
  async getAllUsers() {
    const data = await this.readJsonFile("users.json");
    return data ? data.users : [];
  }

  async getUserById(userId) {
    const users = await this.getAllUsers();
    return users.find((u) => u.id === userId);
  }

  async createUser(userData) {
    const data = await this.readJsonFile("users.json");
    if (!data) return null;

    const newUser = {
      id: `user_${Date.now()}`,
      ...userData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    data.users.push(newUser);
    const success = await this.writeJsonFile("users.json", data);
    return success ? newUser : null;
  }

  async updateUser(userId, updates) {
    const data = await this.readJsonFile("users.json");
    if (!data) return null;

    const userIndex = data.users.findIndex((u) => u.id === userId);
    if (userIndex === -1) return null;

    data.users[userIndex] = {
      ...data.users[userIndex],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    const success = await this.writeJsonFile("users.json", data);
    return success ? data.users[userIndex] : null;
  }

  async deleteUser(userId) {
    const data = await this.readJsonFile("users.json");
    if (!data) return false;

    const originalLength = data.users.length;
    data.users = data.users.filter((u) => u.id !== userId);

    if (data.users.length === originalLength) return false;

    return await this.writeJsonFile("users.json", data);
  }

  // DCP评审相关操作
  async getAllDCPReviews() {
    const data = await this.readJsonFile("dcp_reviews.json");
    return data ? data.reviews : [];
  }

  async createDCPReview(reviewData) {
    const data = await this.readJsonFile("dcp_reviews.json");
    if (!data) return null;

    const newReview = {
      id: `dcp_${Date.now()}`,
      ...reviewData,
      status: "pending",
      result: null,
      comments: [],
      createdAt: new Date().toISOString(),
      completedAt: null,
    };

    data.reviews.push(newReview);
    const success = await this.writeJsonFile("dcp_reviews.json", data);
    return success ? newReview : null;
  }

  async updateDCPReview(reviewId, updates) {
    const data = await this.readJsonFile("dcp_reviews.json");
    if (!data) return null;

    const reviewIndex = data.reviews.findIndex((r) => r.id === reviewId);
    if (reviewIndex === -1) return null;

    data.reviews[reviewIndex] = {
      ...data.reviews[reviewIndex],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    const success = await this.writeJsonFile("dcp_reviews.json", data);
    return success ? data.reviews[reviewIndex] : null;
  }

  async addDCPComment(reviewId, commentData) {
    const data = await this.readJsonFile("dcp_reviews.json");
    if (!data) return null;

    const reviewIndex = data.reviews.findIndex((r) => r.id === reviewId);
    if (reviewIndex === -1) return null;

    const newComment = {
      id: `comment_${Date.now()}`,
      ...commentData,
      createdAt: new Date().toISOString(),
    };

    data.reviews[reviewIndex].comments.push(newComment);
    data.reviews[reviewIndex].updatedAt = new Date().toISOString();

    const success = await this.writeJsonFile("dcp_reviews.json", data);
    return success ? data.reviews[reviewIndex] : null;
  }

  // 交付物相关操作
  async getAllDeliverables() {
    const data = await this.readJsonFile("deliverables.json");
    return data ? data.deliverables : [];
  }

  async getDeliverableById(deliverableId) {
    const deliverables = await this.getAllDeliverables();
    return deliverables.find((d) => d.id === deliverableId);
  }

  async createDeliverable(deliverableData) {
    const data = await this.readJsonFile("deliverables.json");
    if (!data) return null;

    const newDeliverable = {
      id: `deliv_${Date.now()}`,
      ...deliverableData,
      version: "1.0",
      downloadCount: 0,
      approvalStatus: "pending",
      approvedBy: null,
      approvedAt: null,
      uploadedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      comments: [],
    };

    data.deliverables.push(newDeliverable);
    const success = await this.writeJsonFile("deliverables.json", data);
    return success ? newDeliverable : null;
  }

  async updateDeliverable(deliverableId, updates) {
    const data = await this.readJsonFile("deliverables.json");
    if (!data) return null;

    const deliverableIndex = data.deliverables.findIndex(
      (d) => d.id === deliverableId
    );
    if (deliverableIndex === -1) return null;

    // 如果是新版本上传，增加版本号
    if (
      updates.fileName &&
      updates.fileName !== data.deliverables[deliverableIndex].fileName
    ) {
      const currentVersion = parseFloat(
        data.deliverables[deliverableIndex].version
      );
      updates.version = (currentVersion + 0.1).toFixed(1);
    }

    data.deliverables[deliverableIndex] = {
      ...data.deliverables[deliverableIndex],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    const success = await this.writeJsonFile("deliverables.json", data);
    return success ? data.deliverables[deliverableIndex] : null;
  }

  async deleteDeliverable(deliverableId) {
    const data = await this.readJsonFile("deliverables.json");
    if (!data) return false;

    const originalLength = data.deliverables.length;
    data.deliverables = data.deliverables.filter((d) => d.id !== deliverableId);

    if (data.deliverables.length === originalLength) return false;

    return await this.writeJsonFile("deliverables.json", data);
  }

  async getDeliverableVersions(deliverableId) {
    // 这里简化处理，实际应该有版本历史表
    const deliverable = await this.getDeliverableById(deliverableId);
    if (!deliverable) return [];

    // 模拟版本历史数据
    return [
      {
        version: deliverable.version,
        fileName: deliverable.fileName,
        fileSize: deliverable.fileSize,
        uploadedBy: deliverable.uploadedBy,
        uploadedAt: deliverable.uploadedAt,
        changes: "当前版本",
      },
    ];
  }

  async approveDeliverable(deliverableId, approvalData) {
    const data = await this.readJsonFile("deliverables.json");
    if (!data) return null;

    const deliverableIndex = data.deliverables.findIndex(
      (d) => d.id === deliverableId
    );
    if (deliverableIndex === -1) return null;

    data.deliverables[deliverableIndex] = {
      ...data.deliverables[deliverableIndex],
      approvalStatus: approvalData.status, // approved, rejected, revision_required
      approvedBy: approvalData.approvedBy,
      approvedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // 如果有审批意见，添加到评论中
    if (approvalData.comment) {
      const newComment = {
        id: `comment_deliv_${Date.now()}`,
        userId: approvalData.approvedBy,
        content: approvalData.comment,
        createdAt: new Date().toISOString(),
      };
      data.deliverables[deliverableIndex].comments.push(newComment);
    }

    const success = await this.writeJsonFile("deliverables.json", data);
    return success ? data.deliverables[deliverableIndex] : null;
  }

  // 任务相关操作
  async getAllTasks() {
    const data = await this.readJsonFile("tasks.json");
    return data ? data.tasks : [];
  }

  async createTask(taskData) {
    const data = await this.readJsonFile("tasks.json");
    if (!data) return null;

    const newTask = {
      id: `task_${Date.now()}`,
      ...taskData,
      status: "not_started",
      actualHours: 0,
      completedAt: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    data.tasks.push(newTask);
    const success = await this.writeJsonFile("tasks.json", data);
    return success ? newTask : null;
  }

  async updateTask(taskId, updates) {
    const data = await this.readJsonFile("tasks.json");
    if (!data) return null;

    const taskIndex = data.tasks.findIndex((t) => t.id === taskId);
    if (taskIndex === -1) return null;

    data.tasks[taskIndex] = {
      ...data.tasks[taskIndex],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    // 如果任务状态变为完成，设置完成时间
    if (updates.status === "completed" && !data.tasks[taskIndex].completedAt) {
      data.tasks[taskIndex].completedAt = new Date().toISOString();
    }

    const success = await this.writeJsonFile("tasks.json", data);
    return success ? data.tasks[taskIndex] : null;
  }
}

module.exports = DataService;
