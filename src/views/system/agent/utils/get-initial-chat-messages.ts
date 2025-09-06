/**
 * 聊天消息类型定义
 */
export interface ChatMessage {
  type: "ai" | "user" | "checkpoint" | "toolCall" | "toolCallResult";
  text?: string;
  [key: string]: any; // 允许其他属性
}

/**
 * 业务用例类型定义
 */
export interface BusinessUseCase {
  name: string;
  description: string;
  editorContent: string;
  prompt: string;
}

// 导入业务用例常量
import { businessUseCases } from "../constants/business-use-cases";

/**
 * 获取初始聊天消息
 * 根据业务用例或默认情况生成初始聊天记录
 * @param {string} [useCaseName] - 业务用例名称，可选
 * @returns {ChatMessage[]} 初始聊天消息数组
 */
export function getInitialChatMessages(useCaseName?: string): ChatMessage[] {
  // 基础初始消息
  const baseMessages: ChatMessage[] = [
    {
      type: "ai",
      text: "您好！我是您的AI助手，可以帮助您编辑和优化文档内容。有什么我可以帮您的吗？",
    },
  ];

  // 如果指定了用例名称，添加相应的提示
  if (useCaseName) {
    // 查找匹配的用例
    const useCase = businessUseCases.find((item) => item.name === useCaseName);

    if (useCase) {
      return [
        ...baseMessages,
        {
          type: "ai",
          text: `我看到您选择了"${useCaseName}"场景。我可以${useCase.description}。您可以直接编辑文档，或告诉我您的具体需求。`,
        },
      ];
    }
  }

  return baseMessages;
}

/**
 * 初始化聊天消息并添加欢迎信息
 * @param {string} [useCaseName] - 业务用例名称，可选
 * @param {boolean} [showTutorial=false] - 是否显示教程提示
 * @returns {ChatMessage[]} 初始化的聊天消息数组
 */
export function initializeChatMessages(
  useCaseName?: string,
  showTutorial: boolean = false
): ChatMessage[] {
  const messages = getInitialChatMessages(useCaseName);

  // 如果需要显示教程，添加教程信息
  if (showTutorial) {
    messages.push({
      type: "ai",
      text: "小贴士：您可以使用编辑器上方的工具栏格式化文本，或使用右侧聊天框向我提出具体的编辑需求。",
    });
  }

  return messages;
}
