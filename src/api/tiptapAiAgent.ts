// src/api/tiptapAiAgent.ts
import { AiAgentProvider } from "@tiptap-pro/extension-ai-agent";

// 从环境变量读取凭证（避免硬编码，需在 .env.local 中配置）
const TIPTAP_APP_ID = import.meta.env.VITE_TIPTAP_APP_ID;
const TIPTAP_AGENT_TOKEN = import.meta.env.VITE_TIPTAP_AGENT_TOKEN;

// 初始化 Cloud Provider（全局单例，避免重复创建）
export const aiAgentProvider = new AiAgentProvider({
  appId: TIPTAP_APP_ID, // 从 Dashboard 获取的 App ID（如：app_abc123）
  token: TIPTAP_AGENT_TOKEN, // 从 Dashboard 获取的 Agent Token（如：tok_def456）
  // 可选配置：任务超时、默认工具集
  timeout: 30000, // 任务超时时间（30秒）
  defaultTools: [
    "readDocument", // 允许 AI 读取全文内容
    "editContent", // 允许 AI 编辑文档内容
    "formatText", // 允许 AI 格式化文本（如加粗、斜体）
  ],
});
