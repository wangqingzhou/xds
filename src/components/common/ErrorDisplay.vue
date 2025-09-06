<template>
  <transition name="error-slide">
    <div v-if="error" class="error-display" :class="type">
      <div class="error-content">
        <div class="error-icon">
          <span v-if="type === 'error'">❌</span>
          <span v-else-if="type === 'warning'">⚠️</span>
          <span v-else>ℹ️</span>
        </div>

        <div class="error-message">
          <h4 v-if="title" class="error-title">{{ title }}</h4>
          <p class="error-text">{{ displayMessage }}</p>
        </div>

        <button v-if="dismissible" class="close-btn" title="关闭" @click="dismiss">&times;</button>
      </div>

      <div v-if="showDetails && errorDetails" class="error-details">
        <button class="toggle-details" @click="toggleDetails">
          {{ detailsVisible ? "隐藏详情" : "显示详情" }}
        </button>

        <transition name="details-expand">
          <div v-if="detailsVisible" class="details-content">
            <pre>{{ formattedDetails }}</pre>
          </div>
        </transition>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";

interface Props {
  error?: unknown;
  title?: string;
  type?: "error" | "warning" | "info";
  dismissible?: boolean;
  autoDismiss?: boolean;
  autoDismissDelay?: number;
  showDetails?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  error: undefined,
  title: "发生错误",
  type: "error",
  dismissible: true,
  autoDismiss: false,
  autoDismissDelay: 5000,
  showDetails: true,
});

const emit = defineEmits<{
  (e: "dismiss"): void;
  (e: "retry"): void;
}>();

const detailsVisible = ref(false);
let dismissTimer: number | null = null;

const displayMessage = computed(() => {
  if (!props.error) return "";

  if (typeof props.error === "string") {
    return props.error;
  }

  if (props.error instanceof Error) {
    return props.error.message;
  }

  if (typeof props.error === "object" && props.error !== null) {
    // 尝试从错误对象中提取消息
    const errorObj = props.error as Record<string, unknown>;
    if (errorObj.message && typeof errorObj.message === "string") {
      return errorObj.message;
    }
    if (errorObj.error && typeof errorObj.error === "string") {
      return errorObj.error;
    }
  }

  return "发生未知错误";
});

const errorDetails = computed(() => {
  if (!props.error) return null;

  if (props.error instanceof Error) {
    return {
      name: props.error.name,
      message: props.error.message,
      stack: props.error.stack,
    };
  }

  if (typeof props.error === "object" && props.error !== null) {
    return props.error;
  }

  return props.error;
});

const formattedDetails = computed(() => {
  if (!errorDetails.value) return "";

  try {
    return JSON.stringify(errorDetails.value, null, 2);
  } catch {
    return String(errorDetails.value);
  }
});

const toggleDetails = () => {
  detailsVisible.value = !detailsVisible.value;
};

const dismiss = () => {
  if (dismissTimer) {
    clearTimeout(dismissTimer);
    dismissTimer = null;
  }
  emit("dismiss");
};

const startAutoDismiss = () => {
  if (props.autoDismiss && props.autoDismissDelay > 0) {
    if (dismissTimer) {
      clearTimeout(dismissTimer);
    }
    dismissTimer = setTimeout(dismiss, props.autoDismissDelay);
  }
};

// 监听错误变化
watch(
  () => props.error,
  (newError) => {
    if (newError) {
      detailsVisible.value = false;
      startAutoDismiss();
    }
  }
);

onMounted(() => {
  if (props.error) {
    startAutoDismiss();
  }
});
</script>

<style scoped>
.error-display {
  border-radius: 8px;
  padding: 12px 16px;
  margin: 8px 0;
  border: 1px solid;
  animation: shake 0.5s ease;
}

.error-display.error {
  background-color: #fef2f2;
  border-color: #fecaca;
  color: #dc2626;
}

.error-display.warning {
  background-color: #fffbeb;
  border-color: #fed7aa;
  color: #ea580c;
}

.error-display.info {
  background-color: #eff6ff;
  border-color: #bfdbfe;
  color: #2563eb;
}

.error-content {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.error-icon {
  font-size: 1.2rem;
  flex-shrink: 0;
  margin-top: 2px;
}

.error-message {
  flex: 1;
  min-width: 0;
}

.error-title {
  margin: 0 0 4px 0;
  font-weight: 600;
  font-size: 0.95rem;
}

.error-text {
  margin: 0;
  font-size: 0.9rem;
  line-height: 1.4;
  word-wrap: break-word;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0.7;
  transition: opacity 0.2s ease;
}

.close-btn:hover {
  opacity: 1;
}

.error-details {
  margin-top: 12px;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  padding-top: 12px;
}

.toggle-details {
  background: none;
  border: none;
  color: inherit;
  cursor: pointer;
  font-size: 0.8rem;
  opacity: 0.7;
  padding: 4px 0;
  transition: opacity 0.2s ease;
}

.toggle-details:hover {
  opacity: 1;
  text-decoration: underline;
}

.details-content {
  margin-top: 8px;
  background: rgba(0, 0, 0, 0.05);
  border-radius: 4px;
  padding: 8px;
  overflow-x: auto;
}

.details-content pre {
  margin: 0;
  font-size: 0.75rem;
  line-height: 1.4;
  white-space: pre-wrap;
  word-wrap: break-word;
}

/* 动画效果 */
.error-slide-enter-active,
.error-slide-leave-active {
  transition: all 0.3s ease;
}

.error-slide-enter-from,
.error-slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.details-expand-enter-active,
.details-expand-leave-active {
  transition: all 0.3s ease;
}

.details-expand-enter-from,
.details-expand-leave-to {
  opacity: 0;
  max-height: 0;
}

.details-expand-enter-to,
.details-expand-leave-from {
  opacity: 1;
  max-height: 200px;
}

@keyframes shake {
  0%,
  100% {
    transform: translateX(0);
  }
  10%,
  30%,
  50%,
  70%,
  90% {
    transform: translateX(-5px);
  }
  20%,
  40%,
  60%,
  80% {
    transform: translateX(5px);
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .error-display {
    padding: 10px 12px;
    margin: 6px 0;
  }

  .error-content {
    gap: 8px;
  }

  .error-icon {
    font-size: 1.1rem;
  }

  .error-title {
    font-size: 0.9rem;
  }

  .error-text {
    font-size: 0.85rem;
  }

  .details-content pre {
    font-size: 0.7rem;
  }
}
</style>
