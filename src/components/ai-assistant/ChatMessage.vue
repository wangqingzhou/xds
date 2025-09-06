<template>
  <div class="chat-message" :class="messageClasses">
    <!-- 消息头像 -->
    <div class="message-avatar">
      <div class="avatar" :class="avatarClass">
        {{ avatarIcon }}
      </div>
    </div>

    <!-- 消息内容 -->
    <div class="message-content">
      <!-- 消息头（发送者+时间） -->
      <div class="message-header">
        <span class="sender-name">{{ senderName }}</span>
        <span class="message-time">{{ formattedTime }}</span>
      </div>

      <!-- 消息正文 -->
      <div class="message-body">
        <!-- 文本消息 -->
        <div v-if="isTextMessage" class="text-content">
          <p v-if="isThinking" class="thinking-text">
            <span class="thinking-dots">
              <span class="dot">.</span>
              <span class="dot">.</span>
              <span class="dot">.</span>
            </span>
          </p>
          <div v-else class="message-text" v-html="formattedText"></div>
        </div>

        <!-- 工具调用消息 -->
        <div v-else-if="isToolCall" class="tool-call-message">
          <div class="tool-call-header">
            <span class="tool-icon">⚙️</span>
            <span class="tool-name">调用工具: {{ toolName }}</span>
          </div>
          <div v-if="toolArguments" class="tool-arguments">
            <pre>{{ formattedArguments }}</pre>
          </div>
        </div>

        <!-- 工具调用结果 -->
        <div v-else-if="isToolCallResult" class="tool-result-message">
          <div class="tool-result-header" :class="{ 'is-error': isError }">
            <span class="result-icon">{{ resultIcon }}</span>
            <span class="result-text">
              {{ isError ? "工具调用失败" : "工具调用成功" }}
            </span>
          </div>
          <div v-if="message.result" class="tool-result-content">
            <pre>{{ formattedResult }}</pre>
          </div>
        </div>

        <!-- 检查点消息 -->
        <div v-else-if="isCheckpoint" class="checkpoint-message">
          <div class="checkpoint-header">
            <span class="checkpoint-icon">📌</span>
            <span class="checkpoint-text">文档检查点</span>
          </div>
          <div class="checkpoint-info">已保存文档状态</div>
        </div>
      </div>

      <!-- 消息操作 -->
      <div v-if="showActions" class="message-actions">
        <button v-if="canRerun" class="action-btn" title="重新运行此指令" @click="handleRerun">
          🔄 重新运行
        </button>
        <button v-if="canCopy" class="action-btn" title="复制内容" @click="handleCopy">
          📋 复制
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import type { ChatMessage } from "@tiptap-pro/extension-ai-agent";

interface Props {
  message: ChatMessage;
  showTimestamp?: boolean;
  isThinking?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  showTimestamp: true,
  isThinking: false,
});

const emit = defineEmits<{
  (e: "rerun", message: string): void;
  (e: "copy", text: string): void;
}>();

// 计算属性
const messageType = computed(() => props.message.type);
const isUser = computed(() => messageType.value === "user");
const isAI = computed(() => messageType.value === "ai");
const isToolCall = computed(() => messageType.value === "toolCall");
const isToolCallResult = computed(() => messageType.value === "toolCallResult");
const isCheckpoint = computed(() => messageType.value === "checkpoint");
const isTextMessage = computed(() => isUser.value || isAI.value);

const senderName = computed(() => {
  switch (messageType.value) {
    case "user":
      return "您";
    case "ai":
      return "AI助手";
    case "toolCall":
      return "系统";
    case "toolCallResult":
      return "系统";
    case "checkpoint":
      return "系统";
    default:
      return "未知";
  }
});

const avatarClass = computed(() => ({
  "avatar-user": isUser.value,
  "avatar-ai": isAI.value,
  "avatar-system": !isUser.value && !isAI.value,
}));

const avatarIcon = computed(() => {
  if (isUser.value) return "👤";
  if (isAI.value) return "🤖";
  if (isToolCall.value) return "⚙️";
  if (isToolCallResult.value) return "📋";
  if (isCheckpoint.value) return "📌";
  return "❓";
});

const messageClasses = computed(() => ({
  "message-user": isUser.value,
  "message-ai": isAI.value,
  "message-system": !isUser.value && !isAI.value,
  "message-thinking": props.isThinking,
}));

const formattedTime = computed(() => {
  if (!props.message.metadata?.timestamp) return "";

  const date = new Date(props.message.metadata.timestamp);
  return date.toLocaleTimeString("zh-CN", {
    hour: "2-digit",
    minute: "2-digit",
  });
});

const formattedText = computed(() => {
  if (!isTextMessage.value || !props.message.text) return "";

  // 简单的文本格式化
  return props.message.text
    .replace(/\n/g, "<br>")
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/g, "<em>$1</em>");
});

const toolName = computed(() => {
  if (isToolCall.value && "toolName" in props.message) {
    return props.message.toolName;
  }
  return "";
});

const toolArguments = computed(() => {
  if (isToolCall.value && "arguments" in props.message) {
    return props.message.arguments;
  }
  return null;
});

const formattedArguments = computed(() => {
  if (!toolArguments.value) return "";
  return JSON.stringify(toolArguments.value, null, 2);
});

const isError = computed(() => {
  if (isToolCallResult.value && "isError" in props.message) {
    return props.message.isError;
  }
  return false;
});

const resultIcon = computed(() => (isError.value ? "❌" : "✅"));

const formattedResult = computed(() => {
  if (isToolCallResult.value && "result" in props.message) {
    try {
      // 尝试解析JSON结果
      const result = JSON.parse(props.message.result);
      return JSON.stringify(result, null, 2);
    } catch {
      // 如果不是JSON，直接显示
      return props.message.result;
    }
  }
  return "";
});

const showActions = computed(() => isUser.value || isAI.value);
const canRerun = computed(() => isUser.value && props.message.text);
const canCopy = computed(() => props.message.text && !props.isThinking);

// 处理方法
const handleRerun = () => {
  if (props.message.text) {
    emit("rerun", props.message.text);
  }
};

const handleCopy = async () => {
  if (!props.message.text) return;

  try {
    await navigator.clipboard.writeText(props.message.text);
    // 可以在这里添加复制成功的反馈
    console.log("内容已复制到剪贴板");
  } catch (err) {
    console.error("复制失败:", err);
    // 降级方案
    const textArea = document.createElement("textarea");
    textArea.value = props.message.text;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand("copy");
    document.body.removeChild(textArea);
  }
};
</script>

<style scoped>
.chat-message {
  display: flex;
  gap: 12px;
  padding: 16px;
  margin-bottom: 8px;
  border-radius: 12px;
  animation: fadeIn 0.3s ease;
}

.message-user {
  background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);
  margin-left: 20%;
}

.message-ai {
  background: linear-gradient(135deg, #f3e5f5 0%, #e1bee7 100%);
  margin-right: 20%;
}

.message-system {
  background: #f5f5f5;
  border: 1px solid #e0e0e0;
}

.message-thinking {
  opacity: 0.8;
}

.message-avatar {
  flex-shrink: 0;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-weight: 500;
}

.avatar-user {
  background: linear-gradient(135deg, #2196f3 0%, #1976d2 100%);
  color: white;
}

.avatar-ai {
  background: linear-gradient(135deg, #9c27b0 0%, #7b1fa2 100%);
  color: white;
}

.avatar-system {
  background: #757575;
  color: white;
}

.message-content {
  flex: 1;
  min-width: 0;
}

.message-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;
}

.sender-name {
  font-weight: 600;
  font-size: 14px;
  color: #37474f;
}

.message-time {
  font-size: 12px;
  color: #78909c;
}

.message-body {
  margin-bottom: 8px;
}

.text-content {
  line-height: 1.5;
}

.message-text {
  font-size: 14px;
  color: #263238;
}

.message-text :deep(strong) {
  font-weight: 600;
}

.message-text :deep(em) {
  font-style: italic;
}

.thinking-text {
  color: #78909c;
  font-style: italic;
}

.thinking-dots {
  display: inline-flex;
}

.thinking-dots .dot {
  animation: bounce 1.5s infinite;
}

.thinking-dots .dot:nth-child(2) {
  animation-delay: 0.2s;
}

.thinking-dots .dot:nth-child(3) {
  animation-delay: 0.4s;
}

.tool-call-message,
.tool-result-message,
.checkpoint-message {
  background: rgba(255, 255, 255, 0.8);
  border-radius: 8px;
  padding: 12px;
  border-left: 4px solid #ff9800;
}

.tool-result-message {
  border-left-color: v-bind('isError ? "#f44336" : "#4caf50"');
}

.checkpoint-message {
  border-left-color: #2196f3;
}

.tool-call-header,
.tool-result-header,
.checkpoint-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
  font-weight: 600;
  font-size: 14px;
}

.tool-result-header.is-error {
  color: #f44336;
}

.tool-arguments,
.tool-result-content {
  background: #fafafa;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  padding: 8px;
  overflow-x: auto;
  font-size: 12px;
  font-family: "Monaco", "Menlo", "Ubuntu Mono", monospace;
  line-height: 1.4;
}

.tool-arguments pre,
.tool-result-content pre {
  margin: 0;
  white-space: pre-wrap;
  word-wrap: break-word;
}

.checkpoint-info {
  font-size: 13px;
  color: #546e7a;
}

.message-actions {
  display: flex;
  gap: 8px;
  margin-top: 8px;
}

.action-btn {
  padding: 4px 8px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  background: white;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.action-btn:hover {
  background: #f5f5f5;
  border-color: #bdbdbd;
}

/* 动画 */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes bounce {
  0%,
  20%,
  50%,
  80%,
  100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-3px);
  }
  60% {
    transform: translateY(-2px);
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .chat-message {
    padding: 12px;
    gap: 8px;
  }

  .avatar {
    width: 32px;
    height: 32px;
    font-size: 16px;
  }

  .message-user {
    margin-left: 10%;
  }

  .message-ai {
    margin-right: 10%;
  }

  .tool-call-message,
  .tool-result-message,
  .checkpoint-message {
    padding: 8px;
  }

  .message-actions {
    flex-direction: column;
    gap: 4px;
  }

  .action-btn {
    width: 100%;
    text-align: center;
  }
}

@media (max-width: 480px) {
  .chat-message {
    flex-direction: column;
    text-align: center;
  }

  .message-avatar {
    align-self: center;
  }

  .message-header {
    justify-content: center;
  }

  .message-user,
  .message-ai {
    margin-left: 0;
    margin-right: 0;
  }
}
</style>
