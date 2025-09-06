<template>
  <div class="sidebar">
    <div class="sidebar-header">
      <h3 class="label-large">AI 助手</h3>
    </div>

    <div class="sidebar-scroll">
      <div class="chat-messages">
        <!-- 聊天消息列表 -->
        <template v-for="(message, index) in messages" :key="index">
          <ChatMessageComponent :message="message" />
        </template>

        <!-- 加载状态 -->
        <div v-if="isLoading" class="loading-state">
          <svg
            class="spinner"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M21 12a9 9 0 1 1-6.219-8.56" />
          </svg>
          <p class="label-small">AI正在思考...</p>
        </div>

        <!-- 错误状态 -->
        <div v-if="hasError" class="error-state" @click="handleReload">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="alert-triangle"
          >
            <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3" />
            <path d="M12 9v4" />
            <path d="M12 17h.01" />
          </svg>
          <p class="label-small">加载失败，点击重试</p>
        </div>
      </div>
    </div>

    <div class="sidebar-footer">
      <label class="label-large">发送消息给AI</label>
      <textarea
        v-model="userMessage"
        class="textarea"
        placeholder="输入提示或问题..."
        @keydown.enter.exact.prevent="sendMessage"
      ></textarea>
      <div class="button-group">
        <button class="button" :disabled="!userMessage.trim() || isLoading" @click="sendMessage">
          发送
        </button>
        <button class="button destructive" :disabled="messages.length === 0" @click="clearMessages">
          清空
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, inject, watch } from "vue";
import { ElMessage } from "element-plus";
import ChatMessageComponent from "./ChatMessageComponents.vue";

// 从上下文获取AI代理
const { provider } = inject("AiAgentContext");

// 状态管理
const messages = ref([]);
const userMessage = ref("");
const isLoading = ref(false);
const hasError = ref(false);

// 监听AI代理的消息
watch(
  () => provider?.messages,
  (newMessages) => {
    if (newMessages) {
      messages.value = [...newMessages];
      isLoading.value = false;
      hasError.value = false;
    }
  },
  { immediate: true }
);

// 发送消息
const sendMessage = async () => {
  if (!userMessage.value.trim()) return;
  if (!provider) {
    ElMessage.error("AI服务未初始化");
    return;
  }

  const messageText = userMessage.value.trim();

  // 添加用户消息
  messages.value.push({
    type: "user",
    text: messageText,
  });

  // 清空输入框
  userMessage.value = "";

  try {
    isLoading.value = true;
    hasError.value = false;

    // 调用AI处理消息
    await provider.process({
      prompt: messageText,
      type: "chat",
    });
  } catch (error) {
    console.error("发送消息失败:", error);
    isLoading.value = false;
    hasError.value = true;
    ElMessage.error("发送消息失败，请重试");
  }
};

// 重新加载
const handleReload = async () => {
  if (!provider) return;

  try {
    isLoading.value = true;
    hasError.value = false;
    await provider.retryLast();
  } catch (error) {
    console.error("重试失败:", error);
    isLoading.value = false;
    hasError.value = true;
  }
};

// 清空消息
const clearMessages = () => {
  if (provider) {
    provider.clearMessages();
  }
  messages.value = [];
  userMessage.value = "";
  ElMessage.success("已清空聊天记录");
};
</script>

<style scoped lang="scss">
.sidebar {
  border-left: 1px solid #e5e7eb;
  flex-grow: 0;
  flex-shrink: 0;
  width: 33%;
  max-width: 30rem;
  min-width: 17.5rem;
  position: sticky;
  top: 0;
  display: flex;
  flex-direction: column;
  height: 100vh;

  @media (max-width: 700px) {
    border-bottom: 1px solid #e5e7eb;
    border-left: unset;
    width: 100%;
    max-width: unset;
    height: auto;
    position: unset;
  }
}

.sidebar-header {
  flex: 0 0 fit-content;
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  border-bottom: 1px solid #e5e7eb;
  padding: 0.59rem 1rem;
}

.sidebar-footer {
  flex: 0 0 auto;
  border-top: 1px solid #e5e7eb;
  padding: 1rem;

  .textarea {
    width: 100%;
    min-height: 100px;
    max-height: 160px;
    resize: vertical;
    margin-bottom: 0.5rem;
    padding: 0.5rem;
    border: 1px solid #e5e7eb;
    border-radius: 4px;
    font-size: 14px;
    line-height: 1.5;

    &:focus {
      outline: none;
      border-color: #409eff;
    }
  }

  .label-large {
    margin-bottom: 0.625rem;
    display: block;
    font-weight: 500;
  }

  .button-group {
    display: flex;
    gap: 0.5rem;
  }

  .button {
    padding: 0.5rem 1rem;
    border-radius: 4px;
    border: none;
    cursor: pointer;
    font-size: 14px;
    transition: all 0.2s ease;

    &:hover {
      opacity: 0.9;
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }

  .destructive {
    background-color: #fff1f0;
    color: #cf1322;

    &:hover {
      background-color: #ffe8e6;
    }
  }
}

.sidebar-scroll {
  flex: 1 1 100%;
  min-height: 0;
  overflow-y: auto;
  padding: 1rem;
}

.chat-messages {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.loading-state {
  display: flex;
  align-items: center;
  padding: 0.5rem;

  .spinner {
    height: 1rem;
    width: 1rem;
    color: #8c8c8c;
    animation: spin 1s linear infinite;
  }

  .label-small {
    margin: 0;
    margin-left: 0.5rem;
    color: #8c8c8c;
    font-size: 12px;
  }
}

.error-state {
  display: flex;
  width: fit-content;
  align-items: center;
  padding: 0.5rem;
  cursor: pointer;

  .alert-triangle {
    height: 1rem;
    width: 1rem;
    color: #cf1322;
  }

  .label-small {
    margin: 0;
    margin-left: 0.5rem;
    color: #cf1322;
    font-size: 12px;
    text-decoration: underline;
  }
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
