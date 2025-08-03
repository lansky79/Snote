class ApiService {
  constructor() {
    this.baseURL = "http://localhost:3004/api";
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      if (!result.success) {
        throw new Error(result.error || "请求失败");
      }
      return result.data;
    } catch (error) {
      console.error("API请求失败:", error);
      this.showError(error.message || "网络请求失败，请检查服务器连接");
      throw error;
    }
  }

  showError(message) {
    // 简单的错误提示
    const errorDiv = document.createElement("div");
    errorDiv.className = "error-message";
    errorDiv.textContent = message;
    document.body.appendChild(errorDiv);

    setTimeout(() => {
      if (document.body.contains(errorDiv)) {
        document.body.removeChild(errorDiv);
      }
    }, 3000);
  }

  showSuccess(message) {
    // 成功提示
    const successDiv = document.createElement("div");
    successDiv.className = "success-message";
    successDiv.textContent = message;
    document.body.appendChild(successDiv);

    setTimeout(() => {
      if (document.body.contains(successDiv)) {
        document.body.removeChild(successDiv);
      }
    }, 3000);
  }

  // 项目相关API
  async getProjects() {
    return this.request("/projects");
  }

  async getProject(id) {
    return this.request(`/projects/${id}`);
  }

  async createProject(projectData) {
    return this.request("/projects", {
      method: "POST",
      body: JSON.stringify(projectData),
    });
  }

  async updateProject(id, updates) {
    return this.request(`/projects/${id}`, {
      method: "PUT",
      body: JSON.stringify(updates),
    });
  }

  async deleteProject(id) {
    return this.request(`/projects/${id}`, {
      method: "DELETE",
    });
  }

  async updateProjectStage(projectId, stage, stageData) {
    return this.request(`/projects/${projectId}/stages/${stage}`, {
      method: "PUT",
      body: JSON.stringify(stageData),
    });
  }

  // 用户相关API
  async getUsers() {
    return this.request("/users");
  }

  async getUser(id) {
    return this.request(`/users/${id}`);
  }

  async createUser(userData) {
    return this.request("/users", {
      method: "POST",
      body: JSON.stringify(userData),
    });
  }

  async updateUser(id, updates) {
    return this.request(`/users/${id}`, {
      method: "PUT",
      body: JSON.stringify(updates),
    });
  }

  async deleteUser(id) {
    return this.request(`/users/${id}`, {
      method: "DELETE",
    });
  }

  // DCP评审相关API
  async getDCPReviews() {
    return this.request("/dcp/reviews");
  }

  async createDCPReview(reviewData) {
    return this.request("/dcp/reviews", {
      method: "POST",
      body: JSON.stringify(reviewData),
    });
  }

  async updateDCPReview(id, updates) {
    return this.request(`/dcp/reviews/${id}`, {
      method: "PUT",
      body: JSON.stringify(updates),
    });
  }

  async addDCPComment(reviewId, commentData) {
    return this.request(`/dcp/reviews/${reviewId}/comments`, {
      method: "POST",
      body: JSON.stringify(commentData),
    });
  }

  // 交付物相关API
  async getDeliverables() {
    return this.request("/deliverables");
  }

  async getDeliverable(id) {
    return this.request(`/deliverables/${id}`);
  }

  async createDeliverable(deliverableData) {
    return this.request("/deliverables", {
      method: "POST",
      body: JSON.stringify(deliverableData),
    });
  }

  async updateDeliverable(id, updates) {
    return this.request(`/deliverables/${id}`, {
      method: "PUT",
      body: JSON.stringify(updates),
    });
  }

  async deleteDeliverable(id) {
    return this.request(`/deliverables/${id}`, {
      method: "DELETE",
    });
  }

  async getDeliverableVersions(id) {
    return this.request(`/deliverables/${id}/versions`);
  }

  async approveDeliverable(id, approvalData) {
    return this.request(`/deliverables/${id}/approve`, {
      method: "POST",
      body: JSON.stringify(approvalData),
    });
  }

  // 任务相关API
  async getTasks() {
    return this.request("/tasks");
  }

  async createTask(taskData) {
    return this.request("/tasks", {
      method: "POST",
      body: JSON.stringify(taskData),
    });
  }

  async updateTask(id, updates) {
    return this.request(`/tasks/${id}`, {
      method: "PUT",
      body: JSON.stringify(updates),
    });
  }
}

// 全局API实例
const api = new ApiService();
