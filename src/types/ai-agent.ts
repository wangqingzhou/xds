import type {
  ChatMessage,
  AiAgentProvider,
  AiAgentProviderOptions,
} from "@tiptap-pro/extension-ai-agent";

export interface AIAgentState {
  status: "idle" | "loading" | "error" | "reviewing";
  messages: ChatMessage[];
  isLoading: boolean;
  isReviewing: boolean;
  error: string | null;
}

export interface UseAIAgentReturn {
  provider: Ref<AiAgentProvider | null>;
  state: ComputedRef<AIAgentState>;
  initialize: (options: Partial<AiAgentProviderOptions>) => void;
  sendMessage: (message: string, options?: AddUserMessageOptions) => Promise<void>;
  acceptChanges: () => void;
  rejectChanges: () => void;
  reset: () => void;
}

export interface AddUserMessageOptions {
  addSelection?: boolean;
  context?: string;
}

export interface PresetCommand {
  id: string;
  label: string;
  command: string;
  icon?: string;
  category: "edit" | "format" | "analyze" | "generate";
}
