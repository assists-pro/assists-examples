/// <reference types="vite/client" />

/** 与 Vite 内置 ImportMetaEnv 合并，勿再声明 ImportMeta（见 node_modules/vite/types/importMeta.d.ts） */
interface ImportMetaEnv {
  readonly VITE_LOG_UPLOAD_KEY?: string
  /** 完整 origin，优先于 HOST+PORT */
  readonly VITE_LOG_SERVICE_BASE_URL?: string
  readonly VITE_LOG_SERVICE_HOST?: string
  readonly VITE_LOG_SERVICE_PORT?: string
  /** 默认 https；与 HOST+PORT 联用 */
  readonly VITE_LOG_SERVICE_PROTOCOL?: string
}

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
