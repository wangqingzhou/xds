import { ref, computed, onUnmounted } from "vue";
import { AiAgentProvider } from "@tiptap-pro/extension-ai-agent";
import type { UseAIAgentReturn, AIAgentState, AddUserMessageOptions } from "@/types/ai-agent";

export const useAiAgent = (): UseAIAgentReturn => {
  const provider = ref<AiAgentProvider | null>(null);
  const status = ref<"idle" | "loading" | "error" | "reviewing">("idle");
  const error = ref<string | null>(null);
  const messages = ref<ChatMessage[]>([]);

  const state = computed<AIAgentState>(() => ({
    status: status.value,
    messages: messages.value,
    isLoading: status.value === "loading",
    isReviewing: status.value === "reviewing",
    error: error.value,
  }));

  const initialize = (options: Partial<AiAgentProviderOptions>) => {
    try {
      provider.value = new AiAgentProvider({
        appId: import.meta.env.VITE_TIPTAP_APP_ID,
        token: import.meta.env.VITE_TIPTAP_JWT_TOKEN,
        modelName: "gpt-4.1",
        autoSaveCheckpoints: true,
        autoAccept: "onlyRead",

        onStateChange: (newState) => {
          status.value = newState.status;
          messages.value = newState.chatMessages;
        },

        onLoadingError: (err) => {
          status.value = "error";
          error.value = err instanceof Error ? err.message : "Unknown error occurred";
        },

        onStopRunning: () => {
          if (status.value === "loading") {
            status.value = "idle";
          }
        },

        ...options,
      });
    } catch (err) {
      error.value = err instanceof Error ? err.message : "Failed to initialize AI Agent";
    }
  };

  const sendMessage = async (message: string, options?: AddUserMessageOptions) => {
    if (!provider.value || !message.trim()) return;

    try {
      provider.value.addUserMessage(message, {
        addSelection: options?.addSelection ?? true,
        context: options?.context,
      });
      provider.value.run();
    } catch (err) {
      error.value = err instanceof Error ? err.message : "Failed to send message";
    }
  };

  const acceptChanges = () => {
    if (provider.value) {
      provider.value.acceptToolCall();
    }
  };

  const rejectChanges = () => {
    if (provider.value) {
      provider.value.rejectToolCall();
    }
  };

  const reset = () => {
    if (provider.value) {
      provider.value.reset();
      status.value = "idle";
      error.value = null;
    }
  };

  onUnmounted(() => {
    if (provider.value) {
      // Cleanup if needed
    }
  });

  return {
    provider,
    state,
    initialize,
    sendMessage,
    acceptChanges,
    rejectChanges,
    reset,
  };
};
