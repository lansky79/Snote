// 修复系统设置页面显示问题

// 简化的系统设置页面渲染函数
function renderSettingsFixed() {
  const container = document.getElementById("settings-content");
  if (!container) {
    console.error("找不到settings-content容器");
    return;
  }

  console.log("开始渲染系统设置页面");

  container.innerHTML = `
    <div class="settings-container">
      <div class="settings-tabs" style="display: flex; border-bottom: 2px solid #eee; margin-bottom: 30px;">
        <button class="tab-btn active" onclick="showSettingsTab('system')" style="padding: 12px 24px; border: none; background: none; cursor: pointer; border-bottom: 2px solid #3498db;">系统配置</button>
        <button class="tab-btn" onclick="showSettingsTab('users')" style="padding: 12px 24px; border: none; background: none; cursor: pointer;">用户权限</button>
        <button class="tab-btn" onclick="showSettingsTab('workflow')" style="padding: 12px 24px; border: none; background: none; cursor: pointer;">工作流程</button>
        <button class="tab-btn" onclick="showSettingsTab('integration')" style="padding: 12px 24px; border: none; background: none; cursor: pointer;">系统集成</button>
      </div>

      <!-- 系统配置 -->
      <div id="settings-system" class="settings-tab-content active">
        <div class="settings-section" style="background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); margin-bottom: 20px;">
          <h3 style="margin-top: 0; color: #333;">基本信息</h3>
          <div class="settings-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px;">
            <div class="setting-item">
              <label style="display: block; margin-bottom: 5px; color: #666;">系统名称</label>
              <input type="text" value="IPD项目协作系统" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
            </div>
            <div class="setting-item">
              <label style="display: block; margin-bottom: 5px; color: #666;">系统版本</label>
              <input type="text" value="1.0.0" readonly style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; background: #f9f9f9;">
            </div>
            <div class="setting-item">
              <label style="display: block; margin-bottom: 5px; color: #666;">公司名称</label>
              <input type="text" value="华为技术有限公司" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
            </div>
            <div class="setting-item">
              <label style="display: block; margin-bottom: 5px; color: #666;">时区设置</label>
              <select style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
                <option value="Asia/Shanghai" selected>Asia/Shanghai (UTC+8)</option>
                <option value="UTC">UTC (UTC+0)</option>
                <option value="America/New_York">America/New_York (UTC-5)</option>
              </select>
            </div>
          </div>
        </div>

        <div class="settings-section" style="background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); margin-bottom: 20px;">
          <h3 style="margin-top: 0; color: #333;">文件上传设置</h3>
          <div class="settings-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px;">
            <div class="setting-item">
              <label style="display: block; margin-bottom: 5px; color: #666;">最大文件大小</label>
              <input type="text" value="50MB" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
            </div>
            <div class="setting-item">
              <label style="display: block; margin-bottom: 5px; color: #666;">允许的文件类型</label>
              <textarea rows="3" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">.pdf, .doc, .docx, .xls, .xlsx, .ppt, .pptx, .jpg, .png, .gif</textarea>
            </div>
          </div>
        </div>

        <div class="settings-section" style="background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <h3 style="margin-top: 0; color: #333;">安全设置</h3>
          <div class="settings-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px;">
            <div class="setting-item">
              <label style="display: block; margin-bottom: 5px; color: #666;">会话超时时间（秒）</label>
              <input type="number" value="3600" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
            </div>
            <div class="setting-item">
              <label style="display: block; margin-bottom: 5px; color: #666;">密码最小长度</label>
              <input type="number" value="8" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
            </div>
            <div class="setting-item">
              <label style="display: block; margin-bottom: 5px; color: #666;">最大登录尝试次数</label>
              <input type="number" value="5" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
            </div>
            <div class="setting-item">
              <label style="display: flex; align-items: center; color: #666;">
                <input type="checkbox" checked style="margin-right: 8px;">
                启用审计日志
              </label>
            </div>
          </div>
        </div>
      </div>

      <!-- 用户权限 -->
      <div id="settings-users" class="settings-tab-content" style="display: none;">
        <div class="settings-section" style="background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); margin-bottom: 20px;">
          <h3 style="margin-top: 0; color: #333;">角色权限配置</h3>
          <div class="roles-list">
            <div class="role-item" style="border: 1px solid #eee; border-radius: 8px; padding: 15px; margin-bottom: 15px;">
              <div class="role-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                <h4 style="margin: 0; color: #333;">系统管理员</h4>
                <span style="background: #e74c3c; color: white; padding: 4px 8px; border-radius: 12px; font-size: 0.8em;">高权限</span>
              </div>
              <p style="color: #666; margin-bottom: 10px;">拥有系统所有权限，可以管理用户、项目和系统设置</p>
              <div class="permissions" style="display: flex; flex-wrap: wrap; gap: 8px;">
                <span style="background: #ecf0f1; padding: 4px 8px; border-radius: 4px; font-size: 0.8em;">系统管理</span>
                <span style="background: #ecf0f1; padding: 4px 8px; border-radius: 4px; font-size: 0.8em;">用户管理</span>
                <span style="background: #ecf0f1; padding: 4px 8px; border-radius: 4px; font-size: 0.8em;">项目管理</span>
                <span style="background: #ecf0f1; padding: 4px 8px; border-radius: 4px; font-size: 0.8em;">DCP管理</span>
              </div>
            </div>
            
            <div class="role-item" style="border: 1px solid #eee; border-radius: 8px; padding: 15px; margin-bottom: 15px;">
              <div class="role-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                <h4 style="margin: 0; color: #333;">项目经理</h4>
                <span style="background: #f39c12; color: white; padding: 4px 8px; border-radius: 12px; font-size: 0.8em;">中权限</span>
              </div>
              <p style="color: #666; margin-bottom: 10px;">负责项目管理和团队协调</p>
              <div class="permissions" style="display: flex; flex-wrap: wrap; gap: 8px;">
                <span style="background: #ecf0f1; padding: 4px 8px; border-radius: 4px; font-size: 0.8em;">项目创建</span>
                <span style="background: #ecf0f1; padding: 4px 8px; border-radius: 4px; font-size: 0.8em;">项目编辑</span>
                <span style="background: #ecf0f1; padding: 4px 8px; border-radius: 4px; font-size: 0.8em;">任务分配</span>
                <span style="background: #ecf0f1; padding: 4px 8px; border-radius: 4px; font-size: 0.8em;">团队管理</span>
              </div>
            </div>
            
            <div class="role-item" style="border: 1px solid #eee; border-radius: 8px; padding: 15px; margin-bottom: 15px;">
              <div class="role-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                <h4 style="margin: 0; color: #333;">团队成员</h4>
                <span style="background: #2ecc71; color: white; padding: 4px 8px; border-radius: 12px; font-size: 0.8em;">基础权限</span>
              </div>
              <p style="color: #666; margin-bottom: 10px;">参与项目开发和任务执行</p>
              <div class="permissions" style="display: flex; flex-wrap: wrap; gap: 8px;">
                <span style="background: #ecf0f1; padding: 4px 8px; border-radius: 4px; font-size: 0.8em;">项目查看</span>
                <span style="background: #ecf0f1; padding: 4px 8px; border-radius: 4px; font-size: 0.8em;">任务更新</span>
                <span style="background: #ecf0f1; padding: 4px 8px; border-radius: 4px; font-size: 0.8em;">交付物上传</span>
              </div>
            </div>
          </div>
        </div>

        <div class="settings-section" style="background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <h3 style="margin-top: 0; color: #333;">部门管理</h3>
          <div class="departments-list">
            ${["产品研发部", "市场部", "技术部", "硬件部", "质量部", "IT部"]
              .map(
                (dept) => `
              <div class="department-item" style="display: flex; justify-content: space-between; align-items: center; padding: 10px; border-bottom: 1px solid #eee;">
                <div>
                  <span style="font-weight: bold;">${dept}</span>
                  <span style="color: #666; margin-left: 10px;">${
                    users.filter((u) => u.department === dept).length
                  } 人</span>
                </div>
                <button onclick="manageDepartment('${dept}')" style="padding: 6px 12px; border: 1px solid #3498db; color: #3498db; background: white; border-radius: 4px; cursor: pointer;">管理</button>
              </div>
            `
              )
              .join("")}
          </div>
        </div>
      </div>

      <!-- 工作流程 -->
      <div id="settings-workflow" class="settings-tab-content" style="display: none;">
        <div class="settings-section" style="background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); margin-bottom: 20px;">
          <h3 style="margin-top: 0; color: #333;">IPD流程配置</h3>
          <div class="workflow-settings">
            <div class="setting-item" style="margin-bottom: 20px;">
              <label style="display: flex; align-items: center; color: #666;">
                <input type="checkbox" checked style="margin-right: 8px;">
                启用DCP评审必须通过才能进入下一阶段
              </label>
            </div>
            <div class="setting-item" style="margin-bottom: 20px;">
              <label style="display: flex; align-items: center; color: #666;">
                <input type="checkbox" style="margin-right: 8px;">
                允许并行阶段执行
              </label>
            </div>
            <div class="setting-item" style="margin-bottom: 20px;">
              <label style="display: block; margin-bottom: 5px; color: #666;">评审截止天数</label>
              <input type="number" value="7" style="width: 100px; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
            </div>
          </div>
        </div>

        <div class="settings-section" style="background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <h3 style="margin-top: 0; color: #333;">阶段配置</h3>
          <div class="stages-config">
            ${[
              "概念阶段",
              "计划阶段",
              "开发阶段",
              "验证阶段",
              "发布阶段",
              "生命周期阶段",
            ]
              .map(
                (stage, index) => `
              <div class="stage-config-item" style="border: 1px solid #eee; border-radius: 8px; padding: 15px; margin-bottom: 15px;">
                <h4 style="margin: 0 0 10px 0; color: #333;">${stage}</h4>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 15px;">
                  <div>
                    <label style="display: block; margin-bottom: 5px; color: #666; font-size: 0.9em;">最小持续天数</label>
                    <input type="number" value="${
                      [7, 5, 30, 10, 3, 90][index]
                    }" style="width: 100%; padding: 6px; border: 1px solid #ddd; border-radius: 4px;">
                  </div>
                  <div>
                    <label style="display: block; margin-bottom: 5px; color: #666; font-size: 0.9em;">最大持续天数</label>
                    <input type="number" value="${
                      [30, 20, 180, 30, 15, 365][index]
                    }" style="width: 100%; padding: 6px; border: 1px solid #ddd; border-radius: 4px;">
                  </div>
                  <div>
                    <label style="display: flex; align-items: center; color: #666; font-size: 0.9em;">
                      <input type="checkbox" ${
                        index < 5 ? "checked" : ""
                      } style="margin-right: 8px;">
                      必需阶段
                    </label>
                  </div>
                </div>
              </div>
            `
              )
              .join("")}
          </div>
        </div>
      </div>

      <!-- 系统集成 -->
      <div id="settings-integration" class="settings-tab-content" style="display: none;">
        <div class="settings-section" style="background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); margin-bottom: 20px;">
          <h3 style="margin-top: 0; color: #333;">邮件服务配置</h3>
          <div class="settings-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px;">
            <div class="setting-item">
              <label style="display: block; margin-bottom: 5px; color: #666;">SMTP服务器</label>
              <input type="text" value="smtp.company.com" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
            </div>
            <div class="setting-item">
              <label style="display: block; margin-bottom: 5px; color: #666;">SMTP端口</label>
              <input type="number" value="587" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
            </div>
            <div class="setting-item">
              <label style="display: block; margin-bottom: 5px; color: #666;">发送邮箱</label>
              <input type="email" value="system@company.com" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
            </div>
            <div class="setting-item">
              <label style="display: flex; align-items: center; color: #666;">
                <input type="checkbox" checked style="margin-right: 8px;">
                启用SSL加密
              </label>
            </div>
          </div>
        </div>

        <div class="settings-section" style="background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <h3 style="margin-top: 0; color: #333;">外部系统集成</h3>
          <div class="integrations-list">
            <div class="integration-item" style="display: flex; justify-content: space-between; align-items: center; padding: 15px; border: 1px solid #eee; border-radius: 8px; margin-bottom: 15px;">
              <div>
                <h4 style="margin: 0; color: #333;">企业邮箱</h4>
                <p style="margin: 5px 0 0 0; color: #666; font-size: 0.9em;">用于发送系统通知和提醒</p>
              </div>
              <div>
                <span style="background: #2ecc71; color: white; padding: 4px 8px; border-radius: 12px; font-size: 0.8em; margin-right: 10px;">已启用</span>
                <button style="padding: 6px 12px; border: 1px solid #3498db; color: #3498db; background: white; border-radius: 4px; cursor: pointer;">配置</button>
              </div>
            </div>
            
            <div class="integration-item" style="display: flex; justify-content: space-between; align-items: center; padding: 15px; border: 1px solid #eee; border-radius: 8px; margin-bottom: 15px;">
              <div>
                <h4 style="margin: 0; color: #333;">文档管理系统</h4>
                <p style="margin: 5px 0 0 0; color: #666; font-size: 0.9em;">集成外部文档管理平台</p>
              </div>
              <div>
                <span style="background: #95a5a6; color: white; padding: 4px 8px; border-radius: 12px; font-size: 0.8em; margin-right: 10px;">未启用</span>
                <button style="padding: 6px 12px; border: 1px solid #3498db; color: #3498db; background: white; border-radius: 4px; cursor: pointer;">配置</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="settings-actions" style="margin-top: 30px; text-align: center;">
        <button onclick="saveSettings()" style="padding: 12px 24px; background: #3498db; color: white; border: none; border-radius: 4px; cursor: pointer; margin-right: 10px;">保存设置</button>
        <button onclick="resetSettings()" style="padding: 12px 24px; background: #95a5a6; color: white; border: none; border-radius: 4px; cursor: pointer;">重置为默认</button>
      </div>
    </div>
  `;

  console.log("系统设置页面渲染完成");
}

// 切换设置标签页
function showSettingsTab(tabName) {
  // 隐藏所有标签内容
  const tabs = document.querySelectorAll(".settings-tab-content");
  tabs.forEach((tab) => (tab.style.display = "none"));

  // 移除所有按钮的active状态
  const buttons = document.querySelectorAll(".tab-btn");
  buttons.forEach((btn) => {
    btn.classList.remove("active");
    btn.style.borderBottom = "none";
  });

  // 显示目标标签内容
  const targetTab = document.getElementById(`settings-${tabName}`);
  if (targetTab) {
    targetTab.style.display = "block";
  }

  // 激活对应按钮
  event.target.classList.add("active");
  event.target.style.borderBottom = "2px solid #3498db";
}

// 设置操作函数
function saveSettings() {
  alert("设置保存成功！");
}

function resetSettings() {
  if (confirm("确定要重置所有设置为默认值吗？")) {
    alert("设置已重置为默认值");
    renderSettingsFixed();
  }
}

function manageDepartment(deptName) {
  alert(`管理部门功能开发中... 部门: ${deptName}`);
}

// 重写原始的renderSettings函数
function renderSettings() {
  renderSettingsFixed();
}

// 如果页面已经加载，立即执行修复
if (
  document.readyState === "complete" ||
  document.readyState === "interactive"
) {
  console.log("页面已加载，应用系统设置修复");
  if (currentPage === "settings") {
    setTimeout(renderSettingsFixed, 100);
  }
}
