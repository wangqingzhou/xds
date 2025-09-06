import { defineMock } from "./base";

// 生成随机整数的工具函数（替代Mock.js的随机功能）
const randomInt = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// 随机文本库（用于生成模拟数据）
const errorTexts = [
  { original: "teh", corrected: "the" },
  { original: "wrold", corrected: "world" },
  { original: "recieve", corrected: "receive" },
  { original: "writting", corrected: "writing" },
  { original: "goverment", corrected: "government" },
  { original: "intresting", corrected: "interesting" },
  { original: "begining", corrected: "beginning" },
];

// 生成随机日期时间
const randomDateTime = (): string => {
  const date = new Date();
  date.setDate(date.getDate() - randomInt(0, 30));
  return date.toISOString().slice(0, 19).replace("T", " ");
};

// 生成随机段落
const randomParagraph = (min: number, max: number): string => {
  const sentences = [
    "这是一段测试文档内容。",
    "用于模拟拼写检查功能。",
    "包含一些故意设置的拼写错误。",
    "AI助手会自动检测并修正这些错误。",
    "文档编辑功能可以提高工作效率。",
  ];
  const count = randomInt(min, max);
  return Array.from({ length: count }, () => sentences[randomInt(0, sentences.length - 1)]).join(
    ""
  );
};

export default defineMock([
  /**
   * AI 文档助手 - 拼写检查/文档编辑接口
   * POST /api/ai/chat
   */
  {
    url: "/api/v1/agent",
    method: ["POST"],
    body: ({ body }: any) => {
      // 解析请求参数
      const userMsg = body.chatMessages?.find((msg: any) => msg.type === "user") || {};
      const userInput = userMsg.text || "检查文档拼写错误";
      const checkpointMsg = body.chatMessages?.find((msg: any) => msg.type === "checkpoint") || {};
      const originalDocContent =
        checkpointMsg.checkpoint?.editorContent || "<p>teh wrold is intresting</p>";

      // 生成随机错误
      const errorCount = randomInt(1, 3);
      const selectedErrors = [];
      const usedIndices = new Set();

      while (selectedErrors.length < errorCount) {
        const index = randomInt(0, errorTexts.length - 1);
        if (!usedIndices.has(index)) {
          usedIndices.add(index);
          selectedErrors.push(errorTexts[index]);
        }
      }

      // 生成修正后的文档
      let correctedDocContent = originalDocContent;
      selectedErrors.forEach((error) => {
        correctedDocContent = correctedDocContent.replace(error.original, error.corrected);
      });

      // 生成AI回复
      let aiReply = `已完成文档拼写检查，共发现 ${errorCount} 处拼写错误：\n`;
      selectedErrors.forEach((error, index) => {
        aiReply += `${index + 1}. "${error.original}" → 修正为 "${error.corrected}"\n`;
      });
      aiReply += "已自动修正文档内容";

      // 错误详情
      const errorDetails = selectedErrors.map((error, index) => ({
        originalText: error.original,
        correctedText: error.corrected,
        position: `第${randomInt(1, 3)}段第${randomInt(5, 25)}个字符`,
      }));

      return {
        code: "00000",
        data: {
          chatMessages: [
            { type: "ai", text: "您好！我可以帮您编辑文档，请输入您的需求。" },
            { type: "user", text: userInput },
            { type: "ai", text: aiReply },
          ],
          editOperations: [
            {
              type: "replace",
              content: correctedDocContent,
            },
          ],
          status: "completed",
          metadata: {
            processTime: randomInt(500, 1200),
            modelName: body.modelName || "gpt-4.1",
            spellCheckStats: {
              totalErrors: errorCount,
              fixedErrors: errorCount,
              unfixedErrors: 0,
              errorDetails,
            },
          },
        },
        msg: "一切ok",
      };
    },
  },

  /**
   * AI 文档助手 - 重置会话接口
   * POST /api/ai/reset
   */
  {
    url: "api/ai/reset",
    method: ["POST"],
    body: () => {
      return {
        code: "00000",
        data: null,
        msg: "AI会话已重置成功",
      };
    },
  },

  /**
   * AI 文档助手 - 获取检查点列表接口
   * GET /api/ai/checkpoints
   */
  {
    url: "api/ai/checkpoints",
    method: ["GET"],
    body: ({ params }: any) => {
      const page = params.page ? parseInt(params.page) : 1;
      const size = params.size ? parseInt(params.size) : 10;
      const total = 23;

      // 生成检查点列表
      const list = Array.from({ length: size }, (_, i) => ({
        id: (page - 1) * size + i + 1000,
        createTime: randomDateTime(),
        docPreview: randomParagraph(1, 2),
        messageCount: randomInt(1, 10),
      }));

      return {
        code: "00000",
        data: {
          list,
          total,
          page,
          size,
          pages: Math.ceil(total / size),
        },
        msg: "一切ok",
      };
    },
  },

  /**
   * AI 文档助手 - 恢复检查点接口
   * POST /api/ai/checkpoints/:id/restore
   */
  {
    url: "api/ai/checkpoints/:id/restore",
    method: ["POST"],
    body: ({ params }: any) => {
      return {
        code: "00000",
        data: {
          editorContent: `<p>${randomParagraph(2, 4)}</p>`,
          chatMessages: [
            { type: "ai", text: "您好！我可以帮您编辑文档，请输入您的需求。" },
            { type: "user", text: "请总结这段文档" },
            { type: "ai", text: "已为您总结文档内容：" + randomParagraph(1, 2) },
          ],
        },
        msg: `已成功恢复检查点（ID：${params.id}）`,
      };
    },
  },
]);
