<template>
  <div class="ai-assistant-container">
    <EditorToolbar @command="handleCommand" />

    <div class="content-area">
      <div class="editor-section">
        <EditorContent :editor="editor" class="editor" />
      </div>

      <div class="assistant-section">
        <!-- 空状态提示 -->
        <div v-if="!hasMessages" class="empty-state">
          <div class="empty-icon">🤖</div>
          <h3>欢迎使用AI文档助手</h3>
          <p>输入指令开始与AI交互</p>
        </div>

        <div v-else class="chat-messages">
          <ChatMessage
            v-for="(message, index) in safeMessages"
            :key="getMessageKey(message, index)"
            :message="message"
          />
        </div>

        <div class="input-section">
          <textarea
            v-model="userInput"
            placeholder="输入您的指令..."
            :disabled="isLoading"
            @keydown.enter.prevent="sendUserMessage"
          />
          <button :disabled="isLoading || !userInput.trim()" @click="sendUserMessage">
            {{ isLoading ? "处理中..." : "发送" }}
          </button>
        </div>

        <div v-if="isReviewing" class="control-buttons">
          <button class="btn-accept" @click="acceptChanges">接受更改</button>
          <button class="btn-reject" @click="rejectChanges">拒绝更改</button>
        </div>

        <ErrorDisplay v-if="hasError" :error="error" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { EditorContent } from "@tiptap/vue-3";
import { useAiAgent } from "@/composables/useAiAgent";
import { useEditor } from "@/composables/useEditor";
import EditorToolbar from "./EditorToolbar.vue";
import ChatMessage from "./ChatMessage.vue";
import ErrorDisplay from "@/components/common/ErrorDisplay.vue";
import type { ChatMessage as ChatMessageType } from "@tiptap-pro/extension-ai-agent";

const { provider, state: aiState, sendMessage, acceptChanges, rejectChanges } = useAiAgent();
const { editor } = useEditor(provider);

const userInput = ref("");

// 安全访问计算属性
const safeMessages = computed(() => {
  return aiState?.messages || [];
});

const hasMessages = computed(() => {
  return safeMessages.value.length > 0;
});

const isLoading = computed(() => {
  return aiState?.status === "loading";
});

const isReviewing = computed(() => {
  return aiState?.status === "reviewingToolCall";
});

const hasError = computed(() => {
  return !!aiState?.loadingError;
});

const error = computed(() => {
  return aiState?.loadingError || null;
});

const getMessageKey = (message: ChatMessageType, index: number): string => {
  return `${message.type}-${index}-${Date.now()}`;
};

const handleCommand = (command: string) => {
  sendMessage(command);
};

const sendUserMessage = async () => {
  if (!userInput.value.trim() || isLoading.value) return;

  try {
    await sendMessage(userInput.value);
    userInput.value = "";
  } catch (err) {
    console.error("发送消息失败:", err);
  }
};
</script>

<style scoped>
/* 添加空状态样式 */
.empty-state {
  text-align: center;
  padding: 2rem;
  color: #666;
}

.empty-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

/* 原有样式保持不变 */
.ai-assistant-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  gap: 1rem;
}

.content-area {
  display: flex;
  flex: 1;
  gap: 1rem;
  min-height: 0;
}

.editor-section {
  flex: 2;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
}

.editor {
  height: 100%;
  padding: 1rem;
  overflow-y: auto;
}

.assistant-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 1rem;
  gap: 1rem;
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.input-section {
  display: flex;
  gap: 0.5rem;
}

.input-section textarea {
  flex: 1;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  resize: vertical;
  min-height: 60px;
}

.control-buttons {
  display: flex;
  gap: 0.5rem;
}

.btn-accept {
  background-color: #4caf50;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
}

.btn-reject {
  background-color: #f44336;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
}

button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
