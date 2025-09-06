/**
 * 应用全局变量和配置
 */
export const variables = {
  // API配置
  api: {
    baseUrl: import.meta.env.VITE_API_BASE_URL || "https://api.example.com",
    timeout: 30000, // 30秒
    endpoints: {
      aiAssistant: "/api/ai/assistant",
      documentProcess: "/api/document/process",
      saveDocument: "/api/document/save",
    },
  },

  // 编辑器配置
  editor: {
    placeholder: "在此输入或粘贴您的内容...",
    defaultContent: "<p>请开始输入内容...</p>",
    maxLength: 100000, // 最大字符数
    historyDepth: 50, // 历史记录深度
  },

  // AI相关配置
  ai: {
    model: "gpt-3.5-turbo",
    temperature: 0.7,
    maxTokens: 1000,
    defaultSystemPrompt:
      "您是一位专业的文档编辑助手，擅长优化文本内容、修正语法错误并提供清晰的表达。",
  },

  // UI相关常量
  ui: {
    breakpointMobile: 768, // 移动设备断点(px)
    sidebarWidth: "33%",
    maxSidebarWidth: "30rem",
    minSidebarWidth: "17.5rem",
  },

  // 颜色常量
  colors: {
    primary: "#409eff",
    success: "#52c41a",
    warning: "#faad14",
    danger: "#f5222d",
    gray: {
      1: "#f5f7fa",
      2: "#e5e6eb",
      3: "#c9cdD4",
      4: "#86909c",
      5: "#4e5969",
    },
  },
};

// 类型定义
export type ApiConfig = typeof variables.api;
export type EditorConfig = typeof variables.editor;
export type AiConfig = typeof variables.ai;
export type UiConfig = typeof variables.ui;
export type ColorConfig = typeof variables.colors;
