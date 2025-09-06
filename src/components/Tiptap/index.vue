<template>
  <!-- ✅ 使用 <BubbleMenu> 组件 -->
  <BubbleMenu
    :editor="editor"
    class="bubble-menu px-2 py-1 bg-black text-white rounded shadow-lg space-x-2"
  >
    <button
      class="px-2"
      :class="{ 'font-bold': editor.isActive('bold') }"
      @click="editor.chain().focus().toggleBold().run()"
    >
      Bold
    </button>
    <button
      class="px-2"
      :class="{ 'font-bold': editor.isActive('bulletList') }"
      @click="editor.chain().focus().toggleBulletList().run()"
    >
      List
    </button>
    <button class="px-2 bg-blue-500 hover:bg-blue-600 rounded" @click="optimizeText">
      ✨ 优化文案
    </button>
  </BubbleMenu>

  <EditorContent
    :editor="editor"
    class="prose prose-lg border border-gray-300 p-4 rounded min-h-40"
  />
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";

// ✅ 正确导入 Editor 和 EditorContent
import { Editor, EditorContent } from "@tiptap/vue-3";

// ✅ 单独导入 BubbleMenu 扩展
import { BubbleMenu } from "@tiptap/extension-bubble-menu";

import StarterKit from "@tiptap/starter-kit";
import AiAgent from "@tiptap-pro/extension-ai-agent";
import { AiAgentProvider } from "@tiptap-pro/extension-ai-agent";

// 初始化 AI Provider
const provider = new AiAgentProvider({
  appId: "your-app-id",
  token: "your-token",
});

const editor = ref(null);

onMounted(() => {
  editor.value = new Editor({
    extensions: [
      StarterKit,
      BubbleMenu.configure({
        // ✅ 作为扩展注册
        element: ".bubble-menu", // 可选：自定义容器
        // 默认就会绑定到选区，无需额外配置
      }),
      AiAgent.configure({ provider }),
    ],
    content: "<p>开始输入...</p>",
  });
});

onBeforeUnmount(() => {
  if (editor.value) {
    editor.value.destroy();
  }
});

const optimizeText = () => {
  provider.addUserMessage("请优化这段文字的表达，使其更专业、简洁。");
  provider.run();
};
</script>
