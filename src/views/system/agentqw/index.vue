<template>
  <div class="tiptap-editor">
    <!-- 编辑器容器 -->
    <EditorContent :editor="editor" class="editor-content" />

    <!-- AI Agent 控制区域 -->
    <div class="ai-agent-ui">
      <h3>AI Agent</h3>

      <!-- 错误信息 -->
      <div v-if="errorMessage" class="error">错误：{{ errorMessage }}</div>

      <!-- 加载状态 -->
      <div v-if="isLoading" class="loading">AI 正在处理中...</div>

      <!-- 消息列表 -->
      <ul v-if="messages.length" class="messages">
        <li v-for="(msg, index) in messages" :key="index" :class="`message message--${msg.role}`">
          <strong>{{ msg.role }}:</strong>
          {{ msg.content }}
        </li>
      </ul>

      <!-- 控制按钮 -->
      <div class="controls">
        <button :disabled="isLoading || !editor" @click="runAiAgent">运行 AI Agent</button>
        <button :disabled="isLoading || !editor" @click="addExampleMessage">添加示例提示</button>
        <button :disabled="!messages.length" @click="clearMessages">清空消息</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import { Editor, EditorContent } from "@tiptap/vue-3";
import StarterKit from "@tiptap/starter-kit";

// --- 配置项 ---
const APP_ID = "YOUR_APP_ID_HERE"; // 替换为你的 Tiptap Cloud App ID
const TOKEN = "YOUR_TOKEN_HERE"; // 替换为你的 Token
// --- 配置结束 ---

// 响应式数据
const editor = ref(null); // 编辑器实例
const aiProvider = ref(null); // AI Agent 提供者
const messages = ref([]); // 存储对话消息
const isLoading = ref(false); // 加载状态
const errorMessage = ref(""); // 错误信息

// 防止 JSON.stringify 循环引用
function getCircularReplacer() {
  const seen = new WeakSet();
  return (key, value) => {
    if (typeof value === "object" && value !== null) {
      if (seen.has(value)) {
        return "[Circular]";
      }
      seen.add(value);
    }
    return value;
  };
}

// 安全地打印 JSON 到控制台（用于发送和接收数据）
function logJson(title, data) {
  console.log(`[AI Agent] ${title}`, JSON.stringify(data, getCircularReplacer(), 2));
}

// 初始化编辑器和 AI Agent
onMounted(() => {
  console.log("[AI Agent] 开始初始化...");

  // 动态导入 AI Agent 扩展（私有包）
  Promise.all([
    import("@tiptap-pro/extension-ai-agent").then((module) => module.default),
    import("@tiptap-pro/extension-ai-agent").then((module) => module.AiAgentProvider),
  ])
    .then(([AiAgent, AiAgentProviderClass]) => {
      // 创建 AI Agent 提供者
      const provider = new AiAgentProviderClass({
        appId: APP_ID,
        token: TOKEN,
      });
      aiProvider.value = provider;

      console.log("[AI Agent] AI Provider 已创建");

      // 监听状态变化（即：收到 AI 返回的响应）
      provider.on("stateChange", (newState) => {
        logJson("📥 收到 AI 响应（stateChange）", newState);

        // 更新消息列表
        if (Array.isArray(newState.messages)) {
          messages.value = [...newState.messages];
        } else {
          console.warn("newState.messages 不是数组：", newState.messages);
        }

        // 根据状态更新加载中状态
        isLoading.value = newState.status === "loading";
      });

      // 监听错误
      provider.on("loadingError", (error) => {
        const errorData = {
          message: error.message,
          stack: error.stack,
          response: error.response, // 可能包含后端返回的 JSON
        };
        logJson("❌ AI 请求出错", errorData);
        errorMessage.value = error.message || "AI Agent 发生错误";
        isLoading.value = false;
      });

      // 创建 Tiptap 编辑器
      editor.value = new Editor({
        element: document.querySelector(".editor-content"),
        extensions: [
          StarterKit,
          AiAgent.configure({
            provider, // 使用 AI 提供者
          }),
        ],
        content: "<p>你好，这是 Tiptap AI Agent 的测试内容！</p>",
      });

      console.log("[AI Agent] 编辑器初始化完成");
    })
    .catch((error) => {
      console.error("[AI Agent] 模块加载失败", error);
      errorMessage.value = "AI Agent 初始化失败，请检查网络或配置";
    });
});

// 组件销毁前清理资源
onBeforeUnmount(() => {
  if (editor.value) {
    editor.value.destroy();
    console.log("[AI Agent] 编辑器已销毁");
  }
});

// === 方法定义 ===

// 运行 AI Agent（发送请求）
const runAiAgent = () => {
  if (!aiProvider.value || isLoading.value) return;

  // 准备发送前的上下文（模拟“发送的 JSON”）
  const requestPayload = {
    action: "run",
    currentMessages: messages.value,
    editorContent: editor.value.getHTML(),
    timestamp: new Date().toISOString(),
  };

  logJson("📤 发送 AI 请求（run）", requestPayload);

  errorMessage.value = "";
  isLoading.value = true;
  aiProvider.value.run(); // 实际触发请求
};

// 添加示例消息（也会触发请求）
const addExampleMessage = () => {
  if (!aiProvider.value || isLoading.value) return;

  const prompt = "纠正拼写和语法错误。然后找出文中的关键词并加粗。";

  // 模拟发送用户消息的请求体
  const requestPayload = {
    action: "addUserMessage",
    prompt,
    timestamp: new Date().toISOString(),
  };

  logJson("📤 发送用户提示", requestPayload);

  aiProvider.value.addUserMessage(prompt);
};

// 清空消息
const clearMessages = () => {
  messages.value = [];
  errorMessage.value = "";
  console.log("[AI Agent] 消息已清空");
};
</script>

<style>
/* 原有样式保持不变 */
.tiptap-editor {
  font-family: sans-serif;
  max-width: 800px;
  margin: 20px auto;
  border: 1px solid #ccc;
  border-radius: 4px;
  overflow: hidden;
}

.editor-content {
  min-height: 200px;
  padding: 10px;
  border-bottom: 1px solid #eee;
}

.ai-agent-ui {
  padding: 15px;
}

.error {
  color: red;
  margin-bottom: 10px;
}

.loading {
  color: orange;
  margin-bottom: 10px;
}

.messages {
  list-style: none;
  padding: 0;
  margin-bottom: 15px;
  max-height: 200px;
  overflow-y: auto;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 10px;
}

.message {
  margin-bottom: 8px;
  padding: 5px;
  border-radius: 3px;
}

.message--user {
  background-color: #e0f7fa;
}

.message--assistant {
  background-color: #f1f8e9;
}

.message--system {
  background-color: #fff3e0;
  font-style: italic;
}

.controls {
  display: flex;
  gap: 10px;
}

.controls button {
  padding: 8px 12px;
  border: 1px solid #999;
  border-radius: 4px;
  background-color: #f5f5f5;
  cursor: pointer;
}

.controls button:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

.tiptap-editor p {
  margin: 0 0 0.5em;
}
.tiptap-editor ul,
.tiptap-editor ol {
  padding-left: 1.5em;
  margin: 0 0 0.5em;
}
.tiptap-editor blockquote {
  border-left: 3px solid #ccc;
  margin: 0 0 0.5em;
  padding-left: 0.8em;
}
</style>
