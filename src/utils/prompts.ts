export const systemPrompts = {
  editor: `你是一个专业的文档编辑助手，专注于帮助用户改进文档质量。
  你的任务包括：语法检查、格式优化、内容扩展和结构重组。
  请始终保持专业和友好的态度。`,

  creative: `你是一个创意写作助手，帮助用户进行创意写作和内容创作。
  提供灵感建议、情节发展和角色塑造帮助。`,

  technical: `你是一个技术文档专家，专注于API文档、技术规范和开发指南。
  确保技术准确性和术语一致性。`,
} as const;

export const presetCommands: PresetCommand[] = [
  {
    id: "grammar-check",
    label: "语法检查",
    command: "请检查并修正文档中的语法错误和拼写错误",
    icon: "spellcheck",
    category: "edit",
  },
  {
    id: "format-document",
    label: "格式化",
    command: "请为文档添加适当的标题层级和格式",
    icon: "format",
    category: "format",
  },
  {
    id: "summarize",
    label: "总结",
    command: "请总结文档的主要内容",
    icon: "summary",
    category: "analyze",
  },
  {
    id: "expand",
    label: "扩写",
    command: "请扩展这个内容，使其更加详细",
    icon: "expand",
    category: "generate",
  },
] as const;

export type SystemPromptType = keyof typeof systemPrompts;
export type PresetCommand = {
  id: string;
  label: string;
  command: string;
  icon?: string;
  category: "edit" | "format" | "analyze" | "generate";
};
