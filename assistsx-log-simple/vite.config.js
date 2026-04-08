import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const assistsxLocalRoot = process.env.ASSISTSX_JS_LOCAL
  ? path.resolve(process.env.ASSISTSX_JS_LOCAL)
  : path.resolve(__dirname, '../assistsx-js')

const assistsxDevEntry = path.join(assistsxLocalRoot, 'src/index.ts')

/** 开发模式下本地 assistsx-js 入口是否存在（有则走源码，否则回退 node_modules） */
function assistsxLocalEntryExists() {
  try {
    return fs.existsSync(assistsxDevEntry) && fs.statSync(assistsxDevEntry).isFile()
  } catch {
    return false
  }
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const preferLocal =
    mode === 'development' && process.env.ASSISTSX_USE_NPM !== '1'
  const localOk = preferLocal && assistsxLocalEntryExists()
  // 开发：优先本地源码；本地无仓库则走 node_modules（通常为 registry 安装）；生产始终 node_modules
  const useLocalAssistsx = localOk

  if (preferLocal && !localOk) {
    console.info(
      `[vite] assistsx-js: no local entry at ${assistsxDevEntry}, using node_modules`,
    )
  }

  return {
    plugins: [vue()],
    resolve: {
      alias: useLocalAssistsx
        ? {
            'assistsx-js': assistsxDevEntry,
          }
        : {},
    },
    server: {
      host: '0.0.0.0',
      port: 5173,
      strictPort: true,
      fs: {
        allow: [
          path.resolve(__dirname, '..'),
          ...(useLocalAssistsx ? [assistsxLocalRoot] : []),
        ],
      },
    },
    preview: {
      host: '0.0.0.0',
      port: 4173,
      strictPort: true,
    },
  }
})
