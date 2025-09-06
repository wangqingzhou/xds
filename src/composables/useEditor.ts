import { ref, onUnmounted } from "vue";
import { useEditor as useTiptapEditor } from "@tiptap/vue-3";
import StarterKit from "@tiptap/starter-kit";
import AiAgent from "@tiptap-pro/extension-ai-agent";
import type { UseEditorReturn } from "@/types/editor";

export const useEditor = (aiAgentProvider: Ref<any>): UseEditorReturn => {
  const editor = useTiptapEditor({
    extensions: [
      StarterKit,
      AiAgent.configure({
        provider: aiAgentProvider,
      }),
    ],
    content: "<p>开始编写您的文档...</p>",
    onUpdate: ({ editor }) => {
      // Handle editor updates
    },
  });

  const getContent = (): string => {
    return editor.value?.getHTML() || "";
  };

  const setContent = (content: string): void => {
    editor.value?.commands.setContent(content);
  };

  onUnmounted(() => {
    if (editor.value) {
      editor.value.destroy();
    }
  });

  return {
    editor,
    getContent,
    setContent,
    destroy: () => editor.value?.destroy(),
  };
};
