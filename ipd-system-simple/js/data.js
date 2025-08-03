// IPD项目协作系统 - 数据加载器

var IPD_DATA = {
  projects: [],
  users: [],
  dcpReviews: [],
  deliverables: [],
};

// 数据加载状态
var DATA_LOADED = false;

// 异步加载JSON数据
function loadData(callback) {
  if (DATA_LOADED) {
    if (callback) callback();
    return;
  }

  var loadCount = 0;
  var totalFiles = 4;

  function checkComplete() {
    loadCount++;
    if (loadCount === totalFiles) {
      DATA_LOADED = true;
      console.log("所有数据加载完成");
      if (callback) callback();
    }
  }

  // 加载项目数据
  fetch("data/projects.json")
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      IPD_DATA.projects = data;
      console.log("项目数据加载完成:", data.length, "个项目");
      checkComplete();
    })
    .catch(function (error) {
      console.error("加载项目数据失败:", error);
      checkComplete();
    });

  // 加载用户数据
  fetch("data/users.json")
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      IPD_DATA.users = data;
      console.log("用户数据加载完成:", data.length, "个用户");
      checkComplete();
    })
    .catch(function (error) {
      console.error("加载用户数据失败:", error);
      checkComplete();
    });

  // 加载DCP评审数据
  fetch("data/dcp-reviews.json")
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      IPD_DATA.dcpReviews = data;
      console.log("DCP评审数据加载完成:", data.length, "个评审");
      checkComplete();
    })
    .catch(function (error) {
      console.error("加载DCP评审数据失败:", error);
      checkComplete();
    });

  // 加载交付物数据
  fetch("data/deliverables.json")
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      IPD_DATA.deliverables = data;
      console.log("交付物数据加载完成:", data.length, "个交付物");
      checkComplete();
    })
    .catch(function (error) {
      console.error("加载交付物数据失败:", error);
      checkComplete();
    });
}

// 获取用户信息
function getUserById(userId) {
  return IPD_DATA.users.find(function (user) {
    return user.id === userId;
  });
}

// 获取项目信息
function getProjectById(projectId) {
  return IPD_DATA.projects.find(function (project) {
    return project.id === projectId;
  });
}
