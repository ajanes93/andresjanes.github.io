/// <reference types="vite/client" />

declare module "*.vue" {
  import type { DefineComponent } from "vue";
  const component: DefineComponent<object, object, unknown>;
  export default component;
}

declare module "@/data/ai-summary.json" {
  interface AiSummaryData {
    generatedAt: string;
    summary: string;
  }
  const data: AiSummaryData;
  export default data;
}
