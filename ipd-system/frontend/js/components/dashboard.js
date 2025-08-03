// 仪表板组件 - 处理项目数据可视化和统计分析

console.log("仪表板组件已加载");

// 仪表板数据处理工具函数
const DashboardUtils = {
  // 计算时间范围内的数据
  filterDataByTimeRange(data, timeRange, dateField = "createdAt") {
    if (timeRange === "all") return data;

    const now = new Date();
    let startDate;

    switch (timeRange) {
      case "month":
        startDate = new Date(
          now.getFullYear(),
          now.getMonth() - 1,
          now.getDate()
        );
        break;
      case "quarter":
        startDate = new Date(
          now.getFullYear(),
          now.getMonth() - 3,
          now.getDate()
        );
        break;
      case "year":
        startDate = new Date(
          now.getFullYear() - 1,
          now.getMonth(),
          now.getDate()
        );
        break;
      default:
        return data;
    }

    return data.filter((item) => {
      const itemDate = new Date(item[dateField]);
      return itemDate >= startDate;
    });
  },

  // 计算百分比
  calculatePercentage(value, total) {
    return total > 0 ? Math.round((value / total) * 100) : 0;
  },

  // 格式化数字
  formatNumber(num) {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M";
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K";
    }
    return num.toString();
  },

  // 生成颜色
  generateColor(index) {
    const colors = [
      "#3498db",
      "#e74c3c",
      "#2ecc71",
      "#f39c12",
      "#9b59b6",
      "#1abc9c",
      "#34495e",
      "#e67e22",
    ];
    return colors[index % colors.length];
  },

  // 计算趋势
  calculateTrend(currentValue, previousValue) {
    if (previousValue === 0) return currentValue > 0 ? "up" : "stable";
    const change = ((currentValue - previousValue) / previousValue) * 100;
    if (Math.abs(change) < 5) return "stable";
    return change > 0 ? "up" : "down";
  },

  // 获取趋势图标
  getTrendIcon(trend) {
    switch (trend) {
      case "up":
        return "📈";
      case "down":
        return "📉";
      default:
        return "➡️";
    }
  },
};

// 图表渲染工具
const ChartRenderer = {
  // 渲染简单条形图
  renderBarChart(data, options = {}) {
    const { maxValue, height = 200, showValues = true } = options;
    const max = maxValue || Math.max(...data.map((d) => d.value));

    return `
      <div class="simple-bar-chart" style="height: ${height}px;">
        ${data
          .map((item) => {
            const percentage = max > 0 ? (item.value / max) * 100 : 0;
            return `
            <div class="bar-item">
              <div class="bar-container">
                <div class="bar-fill" style="height: ${percentage}%; background-color: ${
              item.color || "#3498db"
            }"></div>
                ${
                  showValues ? `<div class="bar-value">${item.value}</div>` : ""
                }
              </div>
              <div class="bar-label">${item.label}</div>
            </div>
          `;
          })
          .join("")}
      </div>
    `;
  },

  // 渲染饼图（使用CSS实现简单版本）
  renderPieChart(data, options = {}) {
    const total = data.reduce((sum, item) => sum + item.value, 0);
    if (total === 0) return '<div class="empty-chart">暂无数据</div>';

    return `
      <div class="simple-pie-chart">
        <div class="pie-legend">
          ${data
            .map((item, index) => {
              const percentage = Math.round((item.value / total) * 100);
              const color = item.color || DashboardUtils.generateColor(index);
              return `
              <div class="legend-item">
                <div class="legend-color" style="background-color: ${color}"></div>
                <span class="legend-label">${item.label}</span>
                <span class="legend-value">${item.value} (${percentage}%)</span>
              </div>
            `;
            })
            .join("")}
        </div>
      </div>
    `;
  },

  // 渲染线性图表
  renderLineChart(data, options = {}) {
    const { width = 300, height = 150 } = options;
    const max = Math.max(...data.map((d) => d.value));
    const min = Math.min(...data.map((d) => d.value));
    const range = max - min || 1;

    const points = data
      .map((item, index) => {
        const x = (index / (data.length - 1)) * width;
        const y = height - ((item.value - min) / range) * height;
        return `${x},${y}`;
      })
      .join(" ");

    return `
      <div class="simple-line-chart">
        <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
          <polyline points="${points}" fill="none" stroke="#3498db" stroke-width="2"/>
          ${data
            .map((item, index) => {
              const x = (index / (data.length - 1)) * width;
              const y = height - ((item.value - min) / range) * height;
              return `<circle cx="${x}" cy="${y}" r="3" fill="#3498db"/>`;
            })
            .join("")}
        </svg>
        <div class="chart-labels">
          ${data
            .map((item) => `<span class="chart-label">${item.label}</span>`)
            .join("")}
        </div>
      </div>
    `;
  },
};

// 数据导出工具
const DataExporter = {
  // 导出为CSV
  exportToCSV(data, filename = "dashboard_data.csv") {
    const headers = Object.keys(data[0] || {});
    const csvContent = [
      headers.join(","),
      ...data.map((row) =>
        headers.map((header) => `"${row[header] || ""}"`).join(",")
      ),
    ].join("\n");

    this.downloadFile(csvContent, filename, "text/csv");
  },

  // 导出为JSON
  exportToJSON(data, filename = "dashboard_data.json") {
    const jsonContent = JSON.stringify(data, null, 2);
    this.downloadFile(jsonContent, filename, "application/json");
  },

  // 下载文件
  downloadFile(content, filename, mimeType) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  },
};

// 实时数据更新
const DashboardUpdater = {
  updateInterval: null,

  // 开始自动更新
  startAutoUpdate(intervalMs = 30000) {
    this.stopAutoUpdate();
    this.updateInterval = setInterval(() => {
      if (currentPage === "dashboard") {
        console.log("自动更新仪表板数据...");
        updateDashboard();
      }
    }, intervalMs);
  },

  // 停止自动更新
  stopAutoUpdate() {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
    }
  },
};

// 页面卸载时清理
window.addEventListener("beforeunload", () => {
  DashboardUpdater.stopAutoUpdate();
});

// 当切换到仪表板页面时开始自动更新
document.addEventListener("DOMContentLoaded", () => {
  // 监听页面切换
  const originalShowPage = window.showPage;
  window.showPage = function (pageName) {
    if (pageName === "dashboard") {
      DashboardUpdater.startAutoUpdate();
    } else {
      DashboardUpdater.stopAutoUpdate();
    }
    return originalShowPage.call(this, pageName);
  };
});
