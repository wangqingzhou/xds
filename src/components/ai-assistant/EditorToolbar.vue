<template>
  <div class="editor-toolbar">
    <!-- 基础格式工具 -->
    <div class="toolbar-section">
      <div class="tool-group">
        <button
          class="tool-btn"
          :class="{ active: editor?.isActive('bold') }"
          title="粗体"
          @click="editor?.chain().focus().toggleBold().run()"
        >
          <span class="tool-icon">B</span>
        </button>

        <button
          class="tool-btn"
          :class="{ active: editor?.isActive('italic') }"
          title="斜体"
          @click="editor?.chain().focus().toggleItalic().run()"
        >
          <span class="tool-icon">I</span>
        </button>

        <button
          class="tool-btn"
          :class="{ active: editor?.isActive('underline') }"
          title="下划线"
          @click="editor?.chain().focus().toggleUnderline().run()"
        >
          <span class="tool-icon">U</span>
        </button>

        <button
          class="tool-btn"
          :class="{ active: editor?.isActive('strike') }"
          title="删除线"
          @click="editor?.chain().focus().toggleStrike().run()"
        >
          <span class="tool-icon">S</span>
        </button>
      </div>

      <div class="tool-group">
        <button
          class="tool-btn"
          :class="{ active: editor?.isActive({ textAlign: 'left' }) }"
          title="左对齐"
          @click="editor?.chain().focus().setTextAlign('left').run()"
        >
          <span class="tool-icon">←</span>
        </button>

        <button
          class="tool-btn"
          :class="{ active: editor?.isActive({ textAlign: 'center' }) }"
          title="居中"
          @click="editor?.chain().focus().setTextAlign('center').run()"
        >
          <span class="tool-icon">↔</span>
        </button>

        <button
          class="tool-btn"
          :class="{ active: editor?.isActive({ textAlign: 'right' }) }"
          title="右对齐"
          @click="editor?.chain().focus().setTextAlign('right').run()"
        >
          <span class="tool-icon">→</span>
        </button>
      </div>
    </div>

    <!-- 标题和段落格式 -->
    <div class="toolbar-section">
      <select
        class="heading-select"
        :value="currentHeading"
        title="标题级别"
        @change="setHeading($event)"
      >
        <option value="paragraph">正文</option>
        <option value="h1">标题 1</option>
        <option value="h2">标题 2</option>
        <option value="h3">标题 3</option>
        <option value="h4">标题 4</option>
      </select>

      <div class="tool-group">
        <button
          class="tool-btn"
          :class="{ active: editor?.isActive('bulletList') }"
          title="无序列表"
          @click="editor?.chain().focus().toggleBulletList().run()"
        >
          <span class="tool-icon">•</span>
        </button>

        <button
          class="tool-btn"
          :class="{ active: editor?.isActive('orderedList') }"
          title="有序列表"
          @click="editor?.chain().focus().toggleOrderedList().run()"
        >
          <span class="tool-icon">1.</span>
        </button>

        <button
          class="tool-btn"
          :class="{ active: editor?.isActive('blockquote') }"
          title="引用"
          @click="editor?.chain().focus().toggleBlockquote().run()"
        >
          <span class="tool-icon">❝</span>
        </button>
      </div>
    </div>

    <!-- AI功能区域 -->
    <div class="toolbar-section ai-tools">
      <div class="ai-tool-group">
        <button
          v-for="tool in aiTools"
          :key="tool.id"
          class="ai-tool-btn"
          :title="tool.description"
          :disabled="!editor"
          @click="emitCommand(tool.command)"
        >
          <span class="ai-tool-icon">{{ tool.icon }}</span>
          <span class="ai-tool-label">{{ tool.label }}</span>
        </button>
      </div>

      <div class="tool-group">
        <button
          class="tool-btn"
          :disabled="!editor?.can().undo()"
          title="撤销"
          @click="editor?.chain().focus().undo().run()"
        >
          <span class="tool-icon">↶</span>
        </button>

        <button
          class="tool-btn"
          :disabled="!editor?.can().redo()"
          title="重做"
          @click="editor?.chain().focus().redo().run()"
        >
          <span class="tool-icon">↷</span>
        </button>
      </div>
    </div>

    <!-- 文档信息 -->
    <div class="toolbar-section document-info">
      <span class="word-count" title="字数统计">📝 {{ wordCount }} 字</span>
      <span class="ai-status" :class="aiStatusClass" title="AI状态">
        {{ aiStatusText }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from "vue";
import type { Editor } from "@tiptap/vue-3";

interface Props {
  editor?: Editor | null;
  aiStatus?: "idle" | "loading" | "error";
}

interface AITool {
  id: string;
  label: string;
  icon: string;
  command: string;
  description: string;
  category: string;
}

const props = withDefaults(defineProps<Props>(), {
  editor: null,
  aiStatus: "idle",
});

const emit = defineEmits<{
  (e: "command", command: string): void;
}>();

const wordCount = ref(0);
let updateInterval: number | null = null;

const aiTools = ref<AITool[]>([
  {
    id: "grammar-check",
    label: "语法检查",
    icon: "🔍",
    command: "请检查并修正文档中的语法错误和拼写错误",
    description: "检查语法和拼写错误",
    category: "edit",
  },
  {
    id: "format",
    label: "格式化",
    icon: "🎨",
    command: "请为文档添加适当的标题层级和格式",
    description: "优化文档格式",
    category: "format",
  },
  {
    id: "summarize",
    label: "总结",
    icon: "📋",
    command: "请总结文档的主要内容",
    description: "生成内容摘要",
    category: "analyze",
  },
  {
    id: "expand",
    label: "扩写",
    icon: "📈",
    command: "请扩展这个内容，使其更加详细",
    description: "扩展内容细节",
    category: "generate",
  },
  {
    id: "simplify",
    label: "简化",
    icon: "✨",
    command: "请简化这段文字，使其更易理解",
    description: "简化复杂内容",
    category: "edit",
  },
  {
    id: "translate",
    label: "翻译",
    icon: "🌐",
    command: "请将选中的内容翻译成英文",
    description: "翻译内容",
    category: "transform",
  },
]);

const currentHeading = computed(() => {
  if (!props.editor) return "paragraph";

  if (props.editor.isActive("heading", { level: 1 })) return "h1";
  if (props.editor.isActive("heading", { level: 2 })) return "h2";
  if (props.editor.isActive("heading", { level: 3 })) return "h3";
  if (props.editor.isActive("heading", { level: 4 })) return "h4";
  return "paragraph";
});

const aiStatusText = computed(() => {
  switch (props.aiStatus) {
    case "loading":
      return "AI处理中...";
    case "error":
      return "AI错误";
    default:
      return "AI就绪";
  }
});

const aiStatusClass = computed(() => ({
  "status-idle": props.aiStatus === "idle",
  "status-loading": props.aiStatus === "loading",
  "status-error": props.aiStatus === "error",
}));

const setHeading = (event: Event) => {
  const target = event.target as HTMLSelectElement;
  const level = target.value;

  if (!props.editor) return;

  if (level === "paragraph") {
    props.editor.chain().focus().setParagraph().run();
  } else {
    const headingLevel = parseInt(level.replace("h", "")) as 1 | 2 | 3 | 4;
    props.editor.chain().focus().setHeading({ level: headingLevel }).run();
  }
};

const emitCommand = (command: string) => {
  emit("command", command);
};

const updateWordCount = () => {
  if (!props.editor) {
    wordCount.value = 0;
    return;
  }

  const text = props.editor.getText();
  wordCount.value = text.trim().length;
};

watch(
  () => props.editor,
  (newEditor) => {
    if (newEditor) {
      newEditor.on("update", updateWordCount);
      newEditor.on("selectionUpdate", updateWordCount);
      updateWordCount();
    }
  }
);

onMounted(() => {
  updateInterval = setInterval(updateWordCount, 5000);
});

onUnmounted(() => {
  if (updateInterval) {
    clearInterval(updateInterval);
  }

  if (props.editor) {
    props.editor.off("update", updateWordCount);
    props.editor.off("selectionUpdate", updateWordCount);
  }
});
</script>

<style scoped>
.editor-toolbar {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 12px 16px;
  background: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
  flex-wrap: wrap;
}

.toolbar-section {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 4px 0;
}

.tool-group {
  display: flex;
  align-items: center;
  gap: 4px;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  padding: 4px;
}

.tool-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: none;
  background: transparent;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s ease;
}

.tool-btn:hover {
  background: #f1f5f9;
}

.tool-btn.active {
  background: #3b82f6;
  color: white;
}

.tool-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.tool-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}

.heading-select {
  padding: 6px 8px;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  background: white;
  font-size: 14px;
  cursor: pointer;
}

.heading-select:hover {
  border-color: #cbd5e1;
}

.ai-tools {
  margin-left: auto;
}

.ai-tool-group {
  display: flex;
  align-items: center;
  gap: 6px;
}

.ai-tool-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  background: white;
  cursor: pointer;
  font-size: 12px;
  font-weight: 500;
  transition: all 0.2s ease;
}

.ai-tool-btn:hover {
  background: #eff6ff;
  border-color: #3b82f6;
  transform: translateY(-1px);
}

.ai-tool-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

.ai-tool-icon {
  font-size: 14px;
}

.ai-tool-label {
  white-space: nowrap;
}

.document-info {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-left: auto;
}

.word-count {
  font-size: 12px;
  color: #64748b;
  font-weight: 500;
}

.ai-status {
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.status-idle {
  background: #dcfce7;
  color: #166534;
}

.status-loading {
  background: #fef3c7;
  color: #92400e;
  animation: pulse 2s infinite;
}

.status-error {
  background: #fee2e2;
  color: #b91c1c;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .editor-toolbar {
    gap: 12px;
    padding: 8px 12px;
  }

  .ai-tool-label {
    display: none;
  }

  .ai-tool-btn {
    padding: 8px;
  }
}

@media (max-width: 768px) {
  .editor-toolbar {
    flex-direction: column;
    align-items: stretch;
    gap: 8px;
  }

  .toolbar-section {
    justify-content: center;
  }

  .ai-tools {
    margin-left: 0;
    order: -1;
  }

  .document-info {
    justify-content: center;
    margin-left: 0;
  }

  .tool-group {
    flex-wrap: wrap;
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .heading-select {
    max-width: 100px;
  }

  .ai-tool-group {
    flex-wrap: wrap;
    justify-content: center;
  }
}
</style>
