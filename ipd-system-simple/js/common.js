// IPD项目协作系统 - 通用功能

// 页面加载完成后执行
document.addEventListener("DOMContentLoaded", function () {
  console.log("IPD系统加载完成");
  highlightCurrentNav();
});

// 高亮当前页面导航
function highlightCurrentNav() {
  var currentPage = window.location.pathname.split("/").pop() || "index.html";
  var navLinks = document.querySelectorAll(".nav-menu a");

  for (var i = 0; i < navLinks.length; i++) {
    var link = navLinks[i];
    var href = link.getAttribute("href");

    if (href === currentPage) {
      link.classList.add("active");
    } else {
      link.classList.remove("active");
    }
  }
}

// 安全渲染函数
function safeRender(renderFunction, containerId) {
  try {
    renderFunction();
  } catch (error) {
    console.error("渲染错误:", error);
    showErrorInContainer(containerId, "页面加载失败，请刷新重试");
  }
}

// 在容器中显示错误信息
function showErrorInContainer(containerId, message) {
  var container = document.getElementById(containerId);
  if (container) {
    container.innerHTML = '<div class="error-message">' + message + "</div>";
  }
}

// 显示成功消息
function showSuccessMessage(message) {
  var messageDiv = document.createElement("div");
  messageDiv.className = "success-message";
  messageDiv.textContent = message;
  document.body.appendChild(messageDiv);

  setTimeout(function () {
    if (messageDiv.parentNode) {
      messageDiv.parentNode.removeChild(messageDiv);
    }
  }, 3000);
}

// 显示错误消息
function showErrorMessage(message) {
  var messageDiv = document.createElement("div");
  messageDiv.className = "error-message";
  messageDiv.textContent = message;
  document.body.appendChild(messageDiv);

  setTimeout(function () {
    if (messageDiv.parentNode) {
      messageDiv.parentNode.removeChild(messageDiv);
    }
  }, 5000);
}

// 获取状态对应的CSS类
function getStatusClass(status) {
  var statusMap = {
    not_started: "status-not-started",
    planning: "status-planning",
    in_progress: "status-in-progress",
    completed: "status-completed",
    blocked: "status-blocked",
  };
  return statusMap[status] || "status-not-started";
}

// 获取状态文本
function getStatusText(status) {
  var statusMap = {
    not_started: "未开始",
    planning: "规划中",
    in_progress: "进行中",
    completed: "已完成",
    blocked: "已阻塞",
  };
  return statusMap[status] || "未知状态";
}

// 获取阶段文本
function getStageText(stage) {
  var stageMap = {
    concept: "概念阶段",
    plan: "计划阶段",
    develop: "开发阶段",
    verify: "验证阶段",
    release: "发布阶段",
    lifecycle: "生命周期阶段",
  };
  return stageMap[stage] || "未知阶段";
}

// 格式化日期
function formatDate(dateString) {
  if (!dateString) return "未设置";
  try {
    var date = new Date(dateString);
    return date.toLocaleDateString("zh-CN");
  } catch (error) {
    return "日期格式错误";
  }
}

// 创建用户头像
function createAvatar(userName) {
  return (
    '<div class="avatar">' + (userName ? userName.charAt(0) : "?") + "</div>"
  );
}

// 创建进度条
function createProgressBar(progress) {
  return (
    '<div class="progress-bar"><div class="progress-fill" style="width: ' +
    progress +
    '%"></div></div>'
  );
}

// 创建状态标签
function createStatusBadge(status) {
  return (
    '<span class="status-badge ' +
    getStatusClass(status) +
    '">' +
    getStatusText(status) +
    "</span>"
  );
}

// 简单的模态框功能
function showModal(title, content) {
  // 创建模态框HTML
  var modalHtml =
    '<div id="simple-modal" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 1000; display: flex; align-items: center; justify-content: center;">';
  modalHtml +=
    '<div style="background: white; border-radius: 8px; padding: 20px; max-width: 600px; width: 90%; max-height: 80%; overflow-y: auto;">';
  modalHtml +=
    '<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; padding-bottom: 10px; border-bottom: 1px solid #e9ecef;">';
  modalHtml += '<h3 style="margin: 0; color: #2c3e50;">' + title + "</h3>";
  modalHtml +=
    '<button onclick="closeModal()" style="background: none; border: none; font-size: 1.5rem; cursor: pointer; color: #999;">&times;</button>';
  modalHtml += "</div>";
  modalHtml += "<div>" + content + "</div>";
  modalHtml += "</div>";
  modalHtml += "</div>";

  // 添加到页面
  document.body.insertAdjacentHTML("beforeend", modalHtml);
}

// 关闭模态框
function closeModal() {
  var modal = document.getElementById("simple-modal");
  if (modal) {
    modal.parentNode.removeChild(modal);
  }
}

// 点击模态框外部关闭
document.addEventListener("click", function (event) {
  var modal = document.getElementById("simple-modal");
  if (modal && event.target === modal) {
    closeModal();
  }
});

// 按ESC键关闭模态框
document.addEventListener("keydown", function (event) {
  if (event.key === "Escape") {
    closeModal();
  }
});

// 通用的确认对话框
function showConfirm(message, callback) {
  if (confirm(message)) {
    callback();
  }
}

// 通用的提示功能
function showAlert(message) {
  alert(message);
}

// 防抖函数
function debounce(func, wait) {
  var timeout;
  return function executedFunction() {
    var context = this;
    var args = arguments;
    var later = function () {
      timeout = null;
      func.apply(context, args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// 节流函数
function throttle(func, limit) {
  var inThrottle;
  return function () {
    var args = arguments;
    var context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(function () {
        inThrottle = false;
      }, limit);
    }
  };
}
