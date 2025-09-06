<template>
  <header class="app-header">
    <div class="header-content">
      <div class="logo-section">
        <h1 class="logo">
          <span class="logo-icon">🤖</span>
          AI文档助手
        </h1>
        <span class="version">v1.0.0</span>
      </div>

      <div class="header-actions">
        <div class="ai-status" :class="statusClass">
          <span class="status-dot"></span>
          {{ statusText }}
        </div>

        <button
          class="btn-icon"
          :title="darkMode ? '切换亮色模式' : '切换暗色模式'"
          @click="toggleDarkMode"
        >
          <span v-if="darkMode">🌞</span>
          <span v-else>🌙</span>
        </button>

        <button class="btn-icon" title="使用帮助" @click="showHelp">❓</button>

        <div class="user-menu">
          <button class="user-avatar">
            <span>👤</span>
          </button>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";

const darkMode = ref(false);
const aiStatus = ref<"idle" | "loading" | "error">("idle");

const statusClass = computed(() => ({
  "status-idle": aiStatus.value === "idle",
  "status-loading": aiStatus.value === "loading",
  "status-error": aiStatus.value === "error",
}));

const statusText = computed(() => {
  switch (aiStatus.value) {
    case "idle":
      return "就绪";
    case "loading":
      return "处理中...";
    case "error":
      return "错误";
    default:
      return "未知状态";
  }
});

const toggleDarkMode = () => {
  darkMode.value = !darkMode.value;
  // 这里可以添加暗色模式切换的逻辑
  document.documentElement.classList.toggle("dark-mode", darkMode.value);
};

const showHelp = () => {
  // 显示帮助对话框
  alert(
    "AI文档助手使用说明：\n\n1. 在编辑器中输入或编辑内容\n2. 在右侧聊天框输入指令或使用预设命令\n3. AI助手会帮助您修改和优化文档\n4. 您可以审阅和接受/拒绝AI的修改建议"
  );
};
</script>

<style scoped>
.app-header {
  height: 60px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 1000;
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
  padding: 0 20px;
  max-width: 1400px;
  margin: 0 auto;
}

.logo-section {
  display: flex;
  align-items: center;
  gap: 12px;
}

.logo {
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

.logo-icon {
  font-size: 1.8rem;
}

.version {
  font-size: 0.75rem;
  opacity: 0.8;
  background: rgba(255, 255, 255, 0.2);
  padding: 2px 8px;
  border-radius: 12px;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.ai-status {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  font-size: 0.875rem;
  font-weight: 500;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  animation: pulse 2s infinite;
}

.status-idle .status-dot {
  background: #4ade80;
}

.status-loading .status-dot {
  background: #fbbf24;
  animation: pulse 1s infinite;
}

.status-error .status-dot {
  background: #ef4444;
}

.btn-icon {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  border-radius: 8px;
  padding: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 1.1rem;
}

.btn-icon:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: scale(1.05);
}

.user-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.3);
  background: rgba(255, 255, 255, 0.2);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  transition: all 0.2s ease;
}

.user-avatar:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: scale(1.05);
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

@media (max-width: 768px) {
  .header-content {
    padding: 0 16px;
  }

  .logo {
    font-size: 1.2rem;
  }

  .version {
    display: none;
  }

  .ai-status {
    display: none;
  }
}
</style>
