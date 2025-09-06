<template>
  <div class="menu-bar">
    <!-- 文本格式 -->
    <div class="menu-group">
      <button
        :class="{ 'is-active': editor?.isActive('bold') }"
        title="加粗"
        @click="handleFormat('bold')"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"></path>
          <path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"></path>
        </svg>
      </button>

      <button
        :class="{ 'is-active': editor?.isActive('italic') }"
        title="斜体"
        @click="handleFormat('italic')"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <line x1="19" y1="4" x2="10" y2="4"></line>
          <line x1="14" y1="20" x2="5" y2="20"></line>
          <line x1="15" y1="4" x2="9" y2="20"></line>
        </svg>
      </button>

      <button
        :class="{ 'is-active': editor?.isActive('underline') }"
        title="下划线"
        @click="handleFormat('underline')"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M6 4v6a6 6 0 0 0 12 0V4"></path>
          <line x1="4" y1="20" x2="20" y2="20"></line>
        </svg>
      </button>
    </div>

    <!-- 标题 -->
    <div class="menu-group">
      <select class="heading-select" :value="getCurrentHeading()" @change="handleHeadingChange">
        <option value="paragraph">正文</option>
        <option value="h1">标题 1</option>
        <option value="h2">标题 2</option>
        <option value="h3">标题 3</option>
      </select>
    </div>

    <!-- 列表 -->
    <div class="menu-group">
      <button
        :class="{ 'is-active': editor?.isActive('bulletList') }"
        title="无序列表"
        @click="handleList('bulletList')"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <line x1="8" y1="6" x2="21" y2="6"></line>
          <line x1="8" y1="12" x2="21" y2="12"></line>
          <line x1="8" y1="18" x2="21" y2="18"></line>
          <line x1="3" y1="6" x2="3.01" y2="6"></line>
          <line x1="3" y1="12" x2="3.01" y2="12"></line>
          <line x1="3" y1="18" x2="3.01" y2="18"></line>
        </svg>
      </button>

      <button
        :class="{ 'is-active': editor?.isActive('orderedList') }"
        title="有序列表"
        @click="handleList('orderedList')"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <line x1="10" y1="6" x2="21" y2="6"></line>
          <line x1="10" y1="12" x2="21" y2="12"></line>
          <line x1="10" y1="18" x2="21" y2="18"></line>
          <line x1="4" y1="6" x2="4.01" y2="6"></line>
          <circle cx="5" cy="12" r="1"></circle>
          <circle cx="5" cy="18" r="1"></circle>
        </svg>
      </button>
    </div>

    <!-- 链接和图片（简化版） -->
    <div class="menu-group">
      <button title="插入链接" @click="handleLink">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
          <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup>
import { inject, ref } from "vue";
import { ElMessage } from "element-plus";

// 从上下文获取编辑器
const editor = inject("AiAgentContext")?.editor;

// 文本格式切换
const handleFormat = (type) => {
  if (!editor) return;
  editor.chain().focus().toggleMark(type).run();
};

// 修复标题切换的错误
const getCurrentHeading = () => {
  // 1. 先判断编辑器实例是否存在（通过 .value 访问）
  if (!editor.value) return "paragraph";

  // 2. 循环检查标题级别（使用 editor.value 调用方法）
  for (let i = 1; i <= 3; i++) {
    if (editor.value.isActive("heading", { level: i })) {
      return `h${i}`;
    }
  }

  return "paragraph";
};
const handleHeadingChange = (e) => {
  if (!editor) return;
  const value = e.target.value;
  if (value === "paragraph") {
    editor.chain().focus().setParagraph().run();
  } else {
    const level = parseInt(value.slice(1));
    editor.chain().focus().toggleHeading({ level }).run();
  }
};

// 列表切换
const handleList = (type) => {
  if (!editor) return;
  editor.chain().focus().toggleList(type).run();
};
</script>

<style scoped lang="scss">
.menu-bar {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding: 12px 16px;
  background-color: #f5f7fa;
  border-bottom: 1px solid #e5e7eb;
}

.menu-group {
  display: flex;
  gap: 4px;
  padding-right: 12px;
  border-right: 1px solid #e5e7eb;

  &:last-child {
    border-right: none;
  }
}

button {
  width: 36px;
  height: 36px;
  border-radius: 4px;
  border: none;
  background: transparent;
  color: #333;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background-color: #eef2f7;
    color: #409eff;
  }

  &.is-active {
    background-color: #409eff;
    color: white;
  }
}

.heading-select {
  height: 36px;
  padding: 0 8px;
  border-radius: 4px;
  border: 1px solid #e5e7eb;
  background-color: white;
  font-size: 14px;

  &:focus {
    outline: none;
    border-color: #409eff;
  }
}
</style>
