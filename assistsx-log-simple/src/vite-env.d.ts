/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<object, object, unknown>
  export default component
}

/** 仅日志桥接所需，避免引用 assistsx-js 的 global.d.ts（会拉入 Node 全量类型） */
declare global {
  interface Window {
    assistsxLog?: {
      call(method: string): string | null
    }
    assistsxLogCallback?: (data: string) => void
    onAssistsLogUpdate?: (encoded: string) => void
  }
}

export {}
