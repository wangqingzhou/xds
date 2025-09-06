declare module "*.vue" {
  import type { DefineComponent } from "vue";
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

declare module "@tiptap-pro/extension-ai-agent" {
  export * from "@tiptap-pro/extension-ai-agent/types";
}
