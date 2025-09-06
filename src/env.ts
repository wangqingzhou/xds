interface Env {
  VITE_TIPTAP_APP_ID: string;
  VITE_TIPTAP_JWT_TOKEN: string;
  VITE_API_BASE_URL?: string;
}

export const env: Env = {
  VITE_TIPTAP_APP_ID: import.meta.env.VITE_TIPTAP_APP_ID || "",
  VITE_TIPTAP_JWT_TOKEN: import.meta.env.VITE_TIPTAP_JWT_TOKEN || "",
  VITE_API_BASE_URL: import.meta.env.VITE_API_BASE_URL,
};

export const validateEnv = (): void => {
  if (!env.VITE_TIPTAP_APP_ID) {
    throw new Error("VITE_TIPTAP_APP_ID is required");
  }
  if (!env.VITE_TIPTAP_JWT_TOKEN) {
    throw new Error("VITE_TIPTAP_JWT_TOKEN is required");
  }
};
