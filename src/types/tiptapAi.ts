/**
 * Tiptap AI 助手 - 请求/响应类型定义（与后端完全对齐）
 */
export namespace TiptapAi {
  // ------------------------------
  // 请求相关类型
  // ------------------------------
  /** 单个对话消息类型（ai/user/checkpoint） */
  export interface ChatMessage {
    type: "ai" | "user" | "checkpoint";
    text?: string; // ai/user 类型必填
    addSelection?: boolean; // user 类型可选（是否包含选中内容）
    selection?: string; // user 类型可选（选中内容描述）
    checkpoint?: Checkpoint; // checkpoint 类型必填（嵌套历史状态）
  }

  /** Checkpoint 数据（保存历史对话和文档状态） */
  export interface Checkpoint {
    chatMessages: ChatMessage[]; // 历史对话消息
    editorContent: string; // 当时的编辑器内容（HTML 格式）
  }

  /** Schema 元数据（编辑器扩展列表、自定义节点） */
  export interface SchemaAwarenessData {
    extensionNames: string[]; // 已启用的 Tiptap 扩展（如 bold、bulletList）
    customNodes: string[]; // 自定义节点（无则为空数组）
  }

  /** 前端请求实体（发送给后端的格式） */
  export interface Request {
    chatMessages: ChatMessage[]; // 对话消息列表（含历史）
    tools: string[]; // 支持的工具列表（如 replace_document、apply_diff）
    modelName: string; // AI 模型名称（如 gpt-4.1）
    schemaAwarenessData: SchemaAwarenessData; // 编辑器元数据
  }

  // ------------------------------
  // 响应相关类型
  // ------------------------------
  /** 文档编辑指令（后端返回，用于前端修改文档） */
  export interface EditOperation {
    type: "replace" | "insert" | "format"; // 操作类型
    content?: string; // replace/insert 类型必填（HTML 内容）
    position?: number; // insert 类型必填（插入位置）
    format?: "bold" | "italic" | "underline"; // format 类型必填（格式类型）
  }

  /** 拼写检查统计元数据（扩展字段，可选） */
  export interface SpellCheckStats {
    totalErrors: number; // 总错误数
    fixedErrors: number; // 已修正错误数
    unfixedErrors: number; // 未修正错误数
    errorDetails: Array<{
      originalText: string; // 错误文本
      correctedText: string; // 修正后文本
      position: string; // 错误位置描述（如“第1段第7个字符”）
    }>;
  }

  /** 响应元数据（处理耗时、模型版本等） */
  export interface Metadata {
    processTime: number; // 处理耗时（毫秒）
    modelName: string; // 使用的 AI 模型版本
    spellCheckStats?: SpellCheckStats; // 拼写检查统计（仅拼写场景返回）
  }

  /** 后端响应实体（返回给前端的格式） */
  export interface Response {
    chatMessages: Array<{ type: "ai" | "user"; text: string }>; // 对话消息（过滤 checkpoint）
    editOperations: EditOperation[]; // 文档编辑指令列表
    status: "completed" | "error"; // 处理状态
    metadata: Metadata; // 元数据
  }
}
