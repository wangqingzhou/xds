import { BusinessUseCase } from "../utils/get-initial-chat-messages";

/**
 * 预定义的业务用例
 * 这些用例将在业务用例选择菜单中显示
 */
export const businessUseCases: BusinessUseCase[] = [
  {
    name: "文档编辑",
    description: "帮助您编辑和优化各类文档内容，提升表达清晰度和专业性",
    editorContent: "<p>请在此输入您需要编辑的文档内容...</p>",
    prompt: "请帮我编辑这份文档，使其表达更清晰、专业，同时修正可能的语法错误。",
  },
  {
    name: "邮件撰写",
    description: "协助撰写和优化各类邮件，包括商务邮件、感谢信、邀请函等",
    editorContent:
      "<p>主题：[请输入邮件主题]</p><p>尊敬的[收件人]：</p><p>&nbsp;&nbsp;&nbsp;&nbsp;[请输入邮件正文]</p><p>此致</p><p>敬礼</p><p>[您的姓名]</p>",
    prompt: "请帮我优化这封邮件，使其语气恰当、表达清晰，并符合商务沟通规范。",
  },
  {
    name: "报告总结",
    description: "对长文档或报告进行总结，提取关键信息和核心观点",
    editorContent:
      "<h2>报告标题</h2><p>这里是报告的详细内容...</p><p>可以是多个段落，包含关键数据、分析结果和结论等信息。</p>",
    prompt: "请总结这份报告的核心内容，提取关键信息和主要结论，保持简洁明了。",
  },
  {
    name: "内容改写",
    description: "对现有内容进行改写，调整语气、风格或复杂度，适应不同场景",
    editorContent: "<p>请输入需要改写的内容...</p>",
    prompt: "请改写这段内容，使其[更简洁/更正式/更通俗易懂]（根据需要选择或修改）。",
  },
  {
    name: "创意写作",
    description: "提供创意写作支持，包括故事构思、文案创作、诗歌写作等",
    editorContent:
      "<p>写作主题：[请输入写作主题]</p><p>创意方向：[请描述您的创意想法]</p><p>开始写作：</p>",
    prompt: "请围绕这个主题进行创意写作，保持内容新颖有趣，语言生动流畅。",
  },
];
