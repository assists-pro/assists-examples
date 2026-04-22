/**
 * 构建浮窗加载的 hash 路由 URL（与 vite base: './' 及 createWebHashHistory 一致）
 */
export function buildLogPanelFloatUrl(params: Record<string, string | undefined>): string {
  const sp = new URLSearchParams()
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== '') {
      sp.set(k, v)
    }
  }
  const q = sp.toString()
  return q ? `./index.html#/logs?${q}` : './index.html#/logs'
}
