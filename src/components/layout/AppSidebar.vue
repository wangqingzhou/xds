<template>
  <aside class="app-sidebar" :class="{ 'sidebar-collapsed': isCollapsed }">
    <div class="sidebar-header">
      <h3>文档操作</h3>
      <button
        class="toggle-btn"
        :title="isCollapsed ? '展开侧边栏' : '折叠侧边栏'"
        @click="toggleSidebar"
      >
        {{ isCollapsed ? "→" : "←" }}
      </button>
    </div>

    <div class="sidebar-content">
      <!-- 文档操作 -->
      <div class="sidebar-section">
        <h4 class="section-title">文档</h4>
        <div class="action-buttons">
          <button class="action-btn" title="新建文档" @click="newDocument">
            <span class="btn-icon">📄</span>
            <span class="btn-text">新建</span>
          </button>
          <button class="action-btn" title="保存文档" @click="saveDocument">
            <span class="btn-icon">💾</span>
            <span class="btn-text">保存</span>
          </button>
          <button class="action-btn" title="导出文档" @click="exportDocument">
            <span class="btn-icon">📤</span>
            <span class="btn-text">导出</span>
          </button>
        </div>
      </div>

      <!-- AI模式选择 -->
      <div class="sidebar-section">
        <h4 class="section-title">AI模式</h4>
        <div class="mode-buttons">
          <button
            v-for="mode in aiModes"
            :key="mode.id"
            class="mode-btn"
            :class="{ active: selectedMode === mode.id }"
            :title="mode.description"
            @click="selectMode(mode.id)"
          >
            <span class="mode-icon">{{ mode.icon }}</span>
            <span class="mode-text">{{ mode.name }}</span>
          </button>
        </div>
      </div>

      <!-- 最近操作 -->
      <div class="sidebar-section">
        <h4 class="section-title">最近操作</h4>
        <div class="recent-actions">
          <div
            v-for="(action, index) in recentActions"
            :key="index"
            class="recent-action"
            :title="action.description"
          >
            <span class="action-icon">{{ action.icon }}</span>
            <span class="action-text">{{ action.text }}</span>
            <span class="action-time">{{ action.time }}</span>
          </div>
        </div>
      </div>

      <!-- 统计信息 -->
      <div class="sidebar-section">
        <h4 class="section-title">统计</h4>
        <div class="stats">
          <div class="stat-item">
            <span class="stat-label">字数</span>
            <span class="stat-value">{{ stats.wordCount }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">段落</span>
            <span class="stat-value">{{ stats.paragraphCount }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">AI修改</span>
            <span class="stat-value">{{ stats.aiEdits }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="sidebar-footer">
      <div class="system-info">
        <span>v{{ appVersion }}</span>
        <span>·</span>
        <span>{{ currentTime }}</span>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from "vue";

interface AIMode {
  id: string;
  name: string;
  icon: string;
  description: string;
}

interface RecentAction {
  icon: string;
  text: string;
  time: string;
  description: string;
}

interface Stats {
  wordCount: number;
  paragraphCount: number;
  aiEdits: number;
}

const isCollapsed = ref(false);
const selectedMode = ref("editor");
const currentTime = ref("");
let timeInterval: number;

const appVersion = "1.0.0";

const aiModes = ref<AIMode[]>([
  {
    id: "editor",
    name: "编辑模式",
    icon: "✏️",
    description: "专注于文档编辑和格式化",
  },
  {
    id: "creative",
    name: "创意模式",
    icon: "🎨",
    description: "适合创意写作和内容创作",
  },
  {
    id: "technical",
    name: "技术模式",
    icon: "⚙️",
    description: "专注于技术文档和代码",
  },
  {
    id: "translate",
    name: "翻译模式",
    icon: "🌐",
    description: "多语言翻译和本地化",
  },
]);

const recentActions = ref<RecentAction[]>([
  {
    icon: "📝",
    text: "语法检查",
    time: "2分钟前",
    description: "检查并修正了文档中的语法错误",
  },
  {
    icon: "🎯",
    text: "格式优化",
    time: "5分钟前",
    description: "优化了文档的格式和结构",
  },
  {
    icon: "🔍",
    text: "内容总结",
    time: "10分钟前",
    description: "生成了文档的主要内容摘要",
  },
]);

const stats = ref<Stats>({
  wordCount: 1245,
  paragraphCount: 23,
  aiEdits: 8,
});

const toggleSidebar = () => {
  isCollapsed.value = !isCollapsed.value;
};

const selectMode = (modeId: string) => {
  selectedMode.value = modeId;
  // 这里可以触发AI模式的切换
  console.log(`切换到 ${modeId} 模式`);
};

const newDocument = () => {
  if (confirm("确定要创建新文档吗？当前文档的更改将会丢失。")) {
    console.log("创建新文档");
  }
};

const saveDocument = () => {
  console.log("保存文档");
};

const exportDocument = () => {
  console.log("导出文档");
};

const updateTime = () => {
  const now = new Date();
  currentTime.value = now.toLocaleTimeString("zh-CN", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

onMounted(() => {
  updateTime();
  timeInterval = setInterval(updateTime, 60000);
});

onUnmounted(() => {
  clearInterval(timeInterval);
});
</script>

<style scoped>
.app-sidebar {
  width: 280px;
  height: 100%;
  background: #f8fafc;
  border-right: 1px solid #e2e8f0;
  display: flex;
  flex-direction: column;
  transition: width 0.3s ease;
  overflow: hidden;
}

.sidebar-collapsed {
  width: 60px;
}

.sidebar-header {
  padding: 16px;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: white;
}

.sidebar-header h3 {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: #1e293b;
}

.toggle-btn {
  background: none;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  padding: 4px 8px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.2s ease;
}

.toggle-btn:hover {
  background: #f1f5f9;
}

.sidebar-content {
  flex: 1;
  padding: 16px;
  overflow-y: auto;
}

.sidebar-section {
  margin-bottom: 24px;
}

.section-title {
  font-size: 0.875rem;
  font-weight: 600;
  color: #64748b;
  margin: 0 0 12px 0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.action-buttons {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: left;
}

.action-btn:hover {
  background: #f1f5f9;
  border-color: #cbd5e1;
  transform: translateY(-1px);
}

.btn-icon {
  font-size: 1.2rem;
  width: 24px;
  text-align: center;
}

.btn-text {
  font-size: 0.9rem;
  font-weight: 500;
  color: #1e293b;
}

.mode-buttons {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.mode-btn {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.mode-btn:hover {
  background: #f1f5f9;
  border-color: #cbd5e1;
}

.mode-btn.active {
  background: #eff6ff;
  border-color: #3b82f6;
}

.mode-btn.active .mode-text {
  color: #1d4ed8;
}

.mode-icon {
  font-size: 1.2rem;
  width: 24px;
  text-align: center;
}

.mode-text {
  font-size: 0.9rem;
  font-weight: 500;
  color: #475569;
}

.recent-actions {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.recent-action {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px;
  background: white;
  border: 1px solid #f1f5f9;
  border-radius: 6px;
  font-size: 0.8rem;
}

.action-icon {
  font-size: 1rem;
  width: 20px;
  text-align: center;
}

.action-text {
  flex: 1;
  color: #475569;
  font-weight: 500;
}

.action-time {
  color: #94a3b8;
  font-size: 0.75rem;
}

.stats {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.stat-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px 0;
  border-bottom: 1px solid #f1f5f9;
}

.stat-label {
  font-size: 0.8rem;
  color: #64748b;
}

.stat-value {
  font-size: 0.9rem;
  font-weight: 600;
  color: #1e293b;
}

.sidebar-footer {
  padding: 16px;
  border-top: 1px solid #e2e8f0;
  background: white;
}

.system-info {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 0.75rem;
  color: #94a3b8;
}

/* 折叠状态下的样式 */
.sidebar-collapsed .btn-text,
.sidebar-collapsed .mode-text,
.sidebar-collapsed .action-text,
.sidebar-collapsed .action-time,
.sidebar-collapsed .section-title,
.sidebar-collapsed .stat-label,
.sidebar-collapsed .stat-value,
.sidebar-collapsed .system-info {
  display: none;
}

.sidebar-collapsed .sidebar-header h3 {
  display: none;
}

.sidebar-collapsed .action-btn,
.sidebar-collapsed .mode-btn,
.sidebar-collapsed .recent-action {
  justify-content: center;
  padding: 12px;
}

.sidebar-collapsed .action-btn .btn-icon,
.sidebar-collapsed .mode-btn .mode-icon {
  margin: 0;
  font-size: 1.4rem;
}

@media (max-width: 1024px) {
  .app-sidebar {
    width: 240px;
  }

  .sidebar-collapsed {
    width: 50px;
  }
}

@media (max-width: 768px) {
  .app-sidebar {
    position: fixed;
    left: 0;
    top: 60px;
    height: calc(100vh - 60px);
    z-index: 999;
    transform: translateX(-100%);
    transition: transform 0.3s ease;
  }

  .app-sidebar.sidebar-collapsed {
    transform: translateX(-100%);
  }

  .app-sidebar:not(.sidebar-collapsed) {
    transform: translateX(0);
  }
}
</style>
