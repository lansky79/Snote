// 调试脚本 - 检查数据加载情况

console.log("=== IPD系统调试信息 ===");

// 检查全局变量
setTimeout(() => {
  console.log("当前页面:", currentPage);
  console.log("项目数据:", projects ? projects.length : "未加载");
  console.log("用户数据:", users ? users.length : "未加载");
  console.log("DCP评审数据:", dcpReviews ? dcpReviews.length : "未加载");
  console.log("交付物数据:", deliverables ? deliverables.length : "未加载");
  console.log("任务数据:", tasks ? tasks.length : "未加载");

  // 检查API服务
  console.log("API服务:", typeof api);

  // 检查页面容器
  const containers = [
    "projects-list",
    "dashboard-charts",
    "team-board",
    "dcp-reviews",
    "deliverables-list",
    "users-list",
    "settings-content",
  ];

  containers.forEach((id) => {
    const element = document.getElementById(id);
    console.log(`容器 ${id}:`, element ? "存在" : "不存在");
  });

  // 强制重新渲染当前页面
  console.log("强制重新渲染当前页面...");
  if (typeof showPage === "function") {
    showPage(currentPage);
  }
}, 2000);

// 监听页面切换
const originalShowPage = window.showPage;
if (originalShowPage) {
  window.showPage = function (pageName) {
    console.log("切换到页面:", pageName);
    return originalShowPage.call(this, pageName);
  };
}

// 添加错误监听
window.addEventListener("error", function (e) {
  console.error("JavaScript错误:", e.error);
  console.error("错误位置:", e.filename, "行号:", e.lineno);
});

console.log("=== 调试脚本加载完成 ===");
