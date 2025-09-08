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
const CUSTOM_AI_API = "https://your-ai-proxy.com/api/tiptap-ai";
const CONTENT_AI_SECRET = "NpZws0gMHdlNLkezKbvoAwMucTkg46sH22J4DOCqPHK7jRQlEtQgluIev3zzsh3u";
const DEFAULT_MODEL = "qwen-plus";
// --- 配置结束 ---

// 响应式数据
const editor = ref(null);
const messages = ref([]);
const isLoading = ref(false);
const errorMessage = ref("");

// ✅ 只需要 StarterKit 即可
const extensions = [
  StarterKit.configure({
    // 可选：自定义配置
    // heading: { levels: [1, 2, 3] },
    // bulletList: false, // 关闭某个功能
    // orderedList: false,
    // listItem: false,
    // blockquote: false,
    // codeBlock: false,
    // horizontalRule: false,
    // history: false,
  }),
];

// 扩展名称列表（用于 schemaAwarenessData）
const extensionNames = [
  "link",
  "paragraph",
  "editable",
  "clipboardTextSerializer",
  "commands",
  "focusEvents",
  "keymap",
  "tabindex",
  "drop",
  "paste",
  "delete",
  "starterKit",
  "bold",
  "blockquote",
  "bulletList",
  "code",
  "codeBlock",
  "doc",
  "dropCursor",
  "gapCursor",
  "hardBreak",
  "heading",
  "undoRedo",
  "horizontalRule",
  "italic",
  "listItem",
  "listKeymap",
  "orderedList",
  "strike",
  "text",
  "underline",
  "trailingNode",
  "aiAgent",
  "tiptapAiAgentInlineSelection",
  "tiptapAiAgentBlockSelection",
];

// 初始化编辑器
onMounted(() => {
  editor.value = new Editor({
    extensions,
    content: "<p>你好，这是 Tiptap 自定义 AI 的测试内容！</p>",
    editorProps: {
      attributes: {
        class: "focus:outline-none",
      },
    },
  });

  console.log("[AI Agent] 编辑器初始化完成");
});

onBeforeUnmount(() => {
  if (editor.value) {
    editor.value.destroy();
    console.log("[AI Agent] 编辑器已销毁");
  }
});

// 获取 JWT Token（实际项目中应由后端提供）
async function getJWTToken() {
  return "your-jwt-token-from-backend";
}

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

function logJson(title, data) {
  console.log(`[AI Agent] ${title}`, JSON.stringify(data, getCircularReplacer(), 2));
}

// === 核心方法：调用自定义 AI ===

const callCustomAI = async (userPrompt = "") => {
  if (!editor.value || isLoading.value) return;

  isLoading.value = true;
  errorMessage.value = "";

  try {
    const editorContent = editor.value.getHTML();

    const payload = {
      chatMessages: [
        ...messages.value.map((msg) => ({
          role: msg.role,
          content: msg.content,
        })),
        {
          role: "user",
          content: userPrompt || editorContent,
        },
      ],
      tools: [
        "read_first_chunk",
        "read_next_chunk",
        "read_previous_chunk",
        "ask_user",
        "finish_with_summary",
        "plan",
        "replace_document",
        "apply_diff",
      ],
      modelName: DEFAULT_MODEL,
      schemaAwarenessData: {
        extensionNames,
        customNodes: [],
      },
    };

    logJson("📤 发送自定义 AI 请求", payload);

    const response = await fetch(CUSTOM_AI_API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${await getJWTToken()}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    logJson("📥 收到自定义 AI 响应", data);

    if (data.messages && Array.isArray(data.messages)) {
      messages.value = [...data.messages];
    } else if (data.reply) {
      messages.value.push({
        role: "assistant",
        content: data.reply,
      });
    }

    if (data.actions && Array.isArray(data.actions)) {
      data.actions.forEach((action) => {
        if (action.type === "replace_document" && action.content) {
          editor.value.commands.setContent(action.content);
        }
      });
    }
  } catch (error) {
    console.error("[AI Agent] 调用失败", error);
    errorMessage.value = error.message || "AI 调用失败";
  } finally {
    isLoading.value = false;
  }
};

// 运行 AI Agent
const runAiAgent = () => {
  callCustomAI();
};

// 添加示例提示
const addExampleMessage = () => {
  const prompt = "纠正拼写和语法错误。然后找出文中的关键词并加粗。";
  messages.value.push({ role: "user", content: prompt });
  callCustomAI(prompt);
};

// 清空消息
const clearMessages = () => {
  messages.value = [];
  errorMessage.value = "";
  console.log("[AI Agent] 消息已清空");
};
</script>

<style>
/* 样式保持不变 */
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
