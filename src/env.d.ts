/// <reference types="vite/client" />

declare module '*.vue' {
    import type { DefineComponent } from 'vue'
    const component: DefineComponent<object, object, unknown>
    export default component
}

declare module '@/data/ai-summary.json' {
    interface AiSummaryData {
        summary: string
        generatedAt: string
    }
    const data: AiSummaryData
    export default data
}
