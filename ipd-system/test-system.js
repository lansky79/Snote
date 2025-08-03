#!/usr/bin/env node

/**
 * IPD项目协作系统 - 功能测试脚本
 * 用于验证系统的基本功能和API接口
 */

const http = require("http");

const BASE_URL = "http://localhost:3004";
const API_BASE = `${BASE_URL}/api`;

// 测试结果统计
let testResults = {
  total: 0,
  passed: 0,
  failed: 0,
  errors: [],
};

// 日志工具
const logger = {
  info: (message) => console.log(`[INFO] ${message}`),
  success: (message) => console.log(`[✅ PASS] ${message}`),
  error: (message) => console.log(`[❌ FAIL] ${message}`),
  warn: (message) => console.log(`[⚠️ WARN] ${message}`),
};

// HTTP请求工具
function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const req = http.request(url, options, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        try {
          const result = {
            statusCode: res.statusCode,
            headers: res.headers,
            data: res.headers["content-type"]?.includes("application/json")
              ? JSON.parse(data)
              : data,
          };
          resolve(result);
        } catch (error) {
          reject(error);
        }
      });
    });

    req.on("error", reject);

    if (options.body) {
      req.write(options.body);
    }

    req.end();
  });
}

// 测试用例
async function runTest(name, testFn) {
  testResults.total++;
  try {
    logger.info(`运行测试: ${name}`);
    await testFn();
    testResults.passed++;
    logger.success(`${name} - 通过`);
  } catch (error) {
    testResults.failed++;
    testResults.errors.push({ test: name, error: error.message });
    logger.error(`${name} - 失败: ${error.message}`);
  }
}

// 测试服务器连接
async function testServerConnection() {
  const response = await makeRequest(`${API_BASE}/health`);
  if (response.statusCode !== 200) {
    throw new Error(`服务器响应状态码: ${response.statusCode}`);
  }
  if (!response.data.success) {
    throw new Error("健康检查失败");
  }
}

// 测试系统信息接口
async function testSystemInfo() {
  const response = await makeRequest(`${API_BASE}/info`);
  if (response.statusCode !== 200) {
    throw new Error(`状态码: ${response.statusCode}`);
  }
  if (!response.data.success || !response.data.data.name) {
    throw new Error("系统信息格式不正确");
  }
}

// 测试项目管理API
async function testProjectsAPI() {
  // 获取项目列表
  const response = await makeRequest(`${API_BASE}/projects`);
  if (response.statusCode !== 200) {
    throw new Error(`获取项目列表失败: ${response.statusCode}`);
  }
  if (!response.data.success || !Array.isArray(response.data.data)) {
    throw new Error("项目列表格式不正确");
  }
}

// 测试用户管理API
async function testUsersAPI() {
  const response = await makeRequest(`${API_BASE}/users`);
  if (response.statusCode !== 200) {
    throw new Error(`获取用户列表失败: ${response.statusCode}`);
  }
  if (!response.data.success || !Array.isArray(response.data.data)) {
    throw new Error("用户列表格式不正确");
  }
}

// 测试DCP评审API
async function testDCPAPI() {
  const response = await makeRequest(`${API_BASE}/dcp/reviews`);
  if (response.statusCode !== 200) {
    throw new Error(`获取DCP评审列表失败: ${response.statusCode}`);
  }
  if (!response.data.success || !Array.isArray(response.data.data)) {
    throw new Error("DCP评审列表格式不正确");
  }
}

// 测试交付物管理API
async function testDeliverablesAPI() {
  const response = await makeRequest(`${API_BASE}/deliverables`);
  if (response.statusCode !== 200) {
    throw new Error(`获取交付物列表失败: ${response.statusCode}`);
  }
  if (!response.data.success || !Array.isArray(response.data.data)) {
    throw new Error("交付物列表格式不正确");
  }
}

// 测试任务管理API
async function testTasksAPI() {
  const response = await makeRequest(`${API_BASE}/tasks`);
  if (response.statusCode !== 200) {
    throw new Error(`获取任务列表失败: ${response.statusCode}`);
  }
  if (!response.data.success || !Array.isArray(response.data.data)) {
    throw new Error("任务列表格式不正确");
  }
}

// 测试静态文件服务
async function testStaticFiles() {
  const response = await makeRequest(`${BASE_URL}/index.html`);
  if (response.statusCode !== 200) {
    throw new Error(`静态文件服务失败: ${response.statusCode}`);
  }
  if (!response.data.includes("IPD项目协作系统")) {
    throw new Error("主页内容不正确");
  }
}

// 测试404处理
async function test404Handling() {
  const response = await makeRequest(`${API_BASE}/nonexistent`);
  if (response.statusCode !== 404) {
    throw new Error(`404处理不正确，状态码: ${response.statusCode}`);
  }
}

// 主测试函数
async function runAllTests() {
  logger.info("=".repeat(60));
  logger.info("🚀 IPD项目协作系统 - 功能测试开始");
  logger.info("=".repeat(60));

  // 等待服务器启动
  logger.info("等待服务器启动...");
  await new Promise((resolve) => setTimeout(resolve, 2000));

  // 运行所有测试
  await runTest("服务器连接测试", testServerConnection);
  await runTest("系统信息接口测试", testSystemInfo);
  await runTest("项目管理API测试", testProjectsAPI);
  await runTest("用户管理API测试", testUsersAPI);
  await runTest("DCP评审API测试", testDCPAPI);
  await runTest("交付物管理API测试", testDeliverablesAPI);
  await runTest("任务管理API测试", testTasksAPI);
  await runTest("静态文件服务测试", testStaticFiles);
  await runTest("404处理测试", test404Handling);

  // 输出测试结果
  logger.info("=".repeat(60));
  logger.info("📊 测试结果统计");
  logger.info("=".repeat(60));
  logger.info(`总测试数: ${testResults.total}`);
  logger.success(`通过: ${testResults.passed}`);
  if (testResults.failed > 0) {
    logger.error(`失败: ${testResults.failed}`);
    logger.info("\n失败详情:");
    testResults.errors.forEach((error) => {
      logger.error(`- ${error.test}: ${error.error}`);
    });
  }

  const successRate = Math.round(
    (testResults.passed / testResults.total) * 100
  );
  logger.info(`\n成功率: ${successRate}%`);

  if (successRate === 100) {
    logger.success("🎉 所有测试通过！系统功能正常");
  } else if (successRate >= 80) {
    logger.warn("⚠️ 大部分测试通过，但有部分功能需要检查");
  } else {
    logger.error("❌ 多个测试失败，请检查系统配置");
  }

  logger.info("=".repeat(60));

  // 退出进程
  process.exit(testResults.failed > 0 ? 1 : 0);
}

// 错误处理
process.on("uncaughtException", (error) => {
  logger.error(`未捕获的异常: ${error.message}`);
  process.exit(1);
});

process.on("unhandledRejection", (reason) => {
  logger.error(`未处理的Promise拒绝: ${reason}`);
  process.exit(1);
});

// 运行测试
if (require.main === module) {
  runAllTests().catch((error) => {
    logger.error(`测试运行失败: ${error.message}`);
    process.exit(1);
  });
}

module.exports = { runAllTests };
