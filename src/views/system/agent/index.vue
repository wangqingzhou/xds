<template>
  <div class="flex flex-col h-screen overflow-hidden">
    <!-- 顶部标题 -->
    <header class="bg-blue-600 text-white p-4">
      <h1 class="text-xl font-bold">简易文档助手</h1>
    </header>

    <!-- 主内容区 -->
    <main class="flex flex-1 overflow-hidden">
      <!-- 编辑器区域 -->
      <div class="flex-1 border-r border-gray-200 overflow-hidden flex flex-col">
        <div class="p-4 border-b border-gray-200 bg-gray-50">
          <h2 class="font-medium">文档编辑区</h2>
        </div>
        <div class="flex-1 p-6 overflow-auto">
          <EditorContent :editor="editor" class="min-h-full" />

          <!-- 加载状态 -->
          <div
            v-if="isLoading"
            class="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-4 rounded shadow-lg flex items-center gap-2"
          >
            <div
              class="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"
            ></div>
            <span>AI处理中...</span>
          </div>
        </div>
      </div>

      <!-- 对话区域 -->
      <div class="w-80 bg-white flex flex-col overflow-hidden border-l border-gray-200">
        <div class="p-4 border-b border-gray-200 bg-gray-50">
          <h2 class="font-medium">AI助手</h2>
        </div>

        <!-- 消息列表 -->
        <div ref="messageContainer" class="flex-1 overflow-y-auto p-4 space-y-4">
          <div v-for="(msg, index) in messages" :key="index" class="flex gap-3">
            <div
              class="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
            >
              <span v-if="msg.type === 'ai'" class="bg-blue-100 text-blue-700">AI</span>
              <span v-if="msg.type === 'user'" class="bg-green-100 text-green-700">我</span>
            </div>
            <div class="max-w-[220px]">
              <p
                class="text-sm p-2 rounded-lg"
                :class="msg.type === 'ai' ? 'bg-gray-100' : 'bg-blue-50 text-blue-800'"
              >
                {{ msg.text }}
              </p>
              <!-- 显示JSON响应预览 -->
              <div v-if="msg.jsonPreview" class="mt-1 text-xs text-gray-500 bg-gray-50 p-2 rounded">
                <details>
                  <summary>JSON响应预览</summary>
                  <pre class="text-xs mt-1 overflow-x-auto">{{ msg.jsonPreview }}</pre>
                </details>
              </div>
            </div>
          </div>
        </div>

        <!-- 输入区域 -->
        <div class="p-4 border-t border-gray-200">
          <textarea
            v-model="userInput"
            class="w-full border border-gray-300 rounded p-2 text-sm min-h-[60px] resize-none focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="输入指令（如：检查拼写错误、总结文档）..."
            @keydown.enter.exact.prevent="sendMessage"
          ></textarea>
          <button
            :disabled="!userInput.trim() || isLoading"
            class="mt-2 w-full bg-blue-600 text-white py-2 rounded text-sm hover:bg-blue-700 disabled:bg-gray-300"
            @click="sendMessage"
          >
            发送
          </button>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { onMounted, ref, watch, nextTick } from "vue";
import { Editor, EditorContent } from "@tiptap/vue-3";
import StarterKit from "@tiptap/starter-kit";
import AiAgent from "@tiptap-pro/extension-ai-agent";

// 核心状态管理
const editor = ref(null);
const userInput = ref("");
const messages = ref([]);
const isLoading = ref(false);
const messageContainer = ref(null);

// ------------------------------
// 1. 模拟JSON响应生成函数
// ------------------------------
const generateAiJsonResponse = (userText, editorContent) => {
  const lowerText = userText.toLowerCase();
  const timestamp = new Date().toISOString();

  // 基础响应结构
  const baseResponse = {
    success: true,
    timestamp,
    message: "",
    data: {
      operation: null,
      content: null,
      details: [],
    },
  };

  // 场景1：拼写检查指令
  if (lowerText.includes("拼写") || lowerText.includes("错误") || lowerText.includes("修正")) {
    const errorMap = [
      { original: "teh", corrected: "the", position: "开头" },
      { original: "wrold", corrected: "world", position: "中间" },
      { original: "recieve", corrected: "receive", position: "中间" },
      { original: "writting", corrected: "writing", position: "结尾" },
      { original: "intresting", corrected: "interesting", position: "中间" },
    ];

    const docLower = editorContent.toLowerCase();
    const matchedErrors = errorMap.filter((err) => docLower.includes(err.original));
    const targetErrors = matchedErrors.slice(0, Math.min(2, matchedErrors.length));

    // 生成修正后的内容 - 修复：确保正确替换所有匹配项
    let correctedContent = editorContent;
    targetErrors.forEach((err) => {
      // 使用全局正则表达式确保替换所有匹配项
      const reg = new RegExp(`(${err.original})`, "gi");
      correctedContent = correctedContent.replace(reg, err.corrected);
    });

    baseResponse.message = `发现${targetErrors.length}处拼写错误`;
    baseResponse.data.operation = "replace";
    baseResponse.data.content = correctedContent;
    baseResponse.data.details = targetErrors.map((err) => ({
      type: "spelling_error",
      original: err.original,
      corrected: err.corrected,
      position: err.position,
    }));

    return baseResponse;
  }

  // 场景2：总结文档指令
  else if (lowerText.includes("总结") || lowerText.includes("概括")) {
    const pureText = editorContent
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim();
    const summary = pureText.length > 100 ? `${pureText.slice(0, 100)}...` : pureText;

    const summaryContent = `<div class="summary"><h3>文档总结</h3><p>${summary}</p></div>`;

    baseResponse.message = "文档总结完成";
    baseResponse.data.operation = "append";
    baseResponse.data.content = summaryContent;
    baseResponse.data.details = [
      {
        type: "summary",
        length: summary.length,
        original_length: pureText.length,
      },
    ];

    return baseResponse;
  }

  // 场景3：格式调整指令
  else if (lowerText.includes("格式") || lowerText.includes("标题") || lowerText.includes("加粗")) {
    const formattedContent = editorContent
      .replace(/^<p>(.*?)<\/p>/, "<h2>$1</h2>")
      .replace(/重要/g, "<strong>重要</strong>")
      .replace(/<p>/g, "<p class='formatted'>");

    baseResponse.message = "文档格式调整完成";
    baseResponse.data.operation = "replace";
    baseResponse.data.content = formattedContent;
    baseResponse.data.details = [
      {
        type: "formatting",
        changes: ["首段转为标题", "关键词加粗", "添加段落样式"],
      },
    ];

    return baseResponse;
  }

  // 场景4：默认响应
  else {
    baseResponse.message = "已收到指令";
    baseResponse.data.operation = "none";
    baseResponse.data.details = [
      {
        type: "info",
        available_operations: ["replace", "append", "format"],
      },
    ];
    return baseResponse;
  }
};

// ------------------------------
// 2. 处理JSON响应并更新编辑器
//    修复：确保编辑器内容正确更新
// ------------------------------
const processJsonResponse = async (jsonResponse) => {
  if (!jsonResponse.success || !jsonResponse.data || !editor.value) return;

  const { operation, content } = jsonResponse.data;

  try {
    // 确保编辑器处于可编辑状态
    if (editor.value.isDestroyed) return;

    switch (operation) {
      case "replace":
        if (content) {
          // 修复：先清空再设置内容，确保更新生效
          await editor.value.commands.clearContent();
          // 使用setTimeout确保DOM更新完成
          await new Promise((resolve) => setTimeout(resolve, 50));
          await editor.value.commands.setContent(content);
        }
        break;

      case "append":
        if (content) {
          const contentLength = editor.value.state.doc.content.size;
          await editor.value.commands.insertContentAt(
            contentLength,
            `<div class="separator">---</div>${content}`
          );
        }
        break;

      case "format":
        await editor.value.commands.setAttribute("class", "formatted-document");
        break;

      default:
        break;
    }
  } catch (error) {
    console.error("处理编辑器操作失败:", error);
    throw new Error(`更新编辑区内容失败: ${error.message}`);
  }
};

// ------------------------------
// 3. 初始化编辑器
// ------------------------------
onMounted(async () => {
  try {
    // 模拟provider
    const mockProvider = {
      state: { chatMessages: [] },
      getExtensions: () => [],
      addUserMessage: async () => {},
      run: async () => {},
      bindEditor: () => {},
      unbindEditor: () => {},
      destroy: () => {},
    };

    // 初始化编辑器
    editor.value = new Editor({
      extensions: [StarterKit, AiAgent.configure({ provider: mockProvider })],
      content: `<p>Hello teh beautiful wrold! 这是一段测试文档，包含一些重要的信息用于模拟拼写检查功能。</p>
                <p>请输入「检查拼写错误」指令测试功能～</p>`,
      autofocus: true,
    });

    // 初始化消息列表
    messages.value = [
      {
        type: "ai",
        text: "您好！我可以帮您编辑文档，支持拼写检查、内容总结和格式调整。\n我的响应会以JSON格式返回并自动更新编辑区。",
      },
    ];

    await nextTick();
    scrollToBottom();
  } catch (error) {
    console.error("初始化失败:", error);
    messages.value.push({
      type: "ai",
      text: `初始化失败: ${error.message || "未知错误"}`,
    });
  }
});

// ------------------------------
// 4. 发送消息逻辑
// ------------------------------
const sendMessage = async () => {
  const userText = userInput.value.trim();
  if (!userText || isLoading.value || !editor.value) return;

  // 添加用户消息
  userInput.value = "";
  messages.value.push({ type: "user", text: userText });
  scrollToBottom();

  // 显示加载状态
  isLoading.value = true;
  try {
    // 模拟API请求延迟
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // 获取当前编辑器内容（修复：确保获取最新内容）
    const editorContent = editor.value.getHTML();

    // 生成模拟的JSON响应
    const jsonResponse = generateAiJsonResponse(userText, editorContent);

    // 根据JSON响应更新编辑器
    await processJsonResponse(jsonResponse);

    // 生成AI回复文本
    const aiText = `${jsonResponse.message}\n${jsonResponse.data.details
      .map(
        (d, i) =>
          `${i + 1}. ${
            d.type === "spelling_error"
              ? `将"${d.original}"修正为"${d.corrected}"`
              : d.type === "summary"
                ? `总结长度: ${d.length}字符`
                : d.changes
                  ? d.changes[i]
                  : d.type
          }`
      )
      .join("\n")}`;

    // 添加AI消息
    messages.value.push({
      type: "ai",
      text: aiText,
      jsonPreview: JSON.stringify(jsonResponse, null, 2),
    });
  } catch (error) {
    messages.value.push({
      type: "ai",
      text: `处理失败: ${error.message}`,
    });
  } finally {
    isLoading.value = false;
    scrollToBottom();
  }
};

// ------------------------------
// 5. 辅助函数
// ------------------------------
const scrollToBottom = () => {
  nextTick(() => {
    if (messageContainer.value) {
      messageContainer.value.scrollTop = messageContainer.value.scrollHeight;
    }
  });
};

// 组件卸载清理
watch(
  () => true,
  () => {
    if (editor.value && !editor.value.isDestroyed) {
      editor.value.destroy();
    }
  },
  { once: true }
);
</script>

<style>
@import "prosemirror-view/style/prosemirror.css";
@import "prosemirror-gapcursor/style/gapcursor.css";

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}

.tiptap {
  min-height: 300px;
  padding: 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  line-height: 1.6;
}

.tiptap p {
  margin-bottom: 0.8rem;
}

.tiptap h2,
.tiptap h3 {
  margin: 1.5rem 0 0.8rem;
  color: #1e40af;
  border-bottom: 1px solid #e2e8f0;
  padding-bottom: 0.3rem;
}

.tiptap strong {
  color: #1e40af;
  font-weight: 600;
}

.tiptap .formatted {
  color: #374151;
  line-height: 1.8;
}

.tiptap .summary {
  background-color: #f0f9ff;
  padding: 1rem;
  border-radius: 4px;
  margin: 1rem 0;
  border-left: 3px solid #3b82f6;
}

.tiptap .separator {
  margin: 1rem 0;
  color: #9ca3af;
  text-align: center;
}

/* 加载动画 */
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}

/* 响应式调整 */
@media (max-width: 768px) {
  main {
    flex-direction: column;
  }
  .w-80 {
    width: 100%;
    height: 300px;
  }
}
</style>
