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

/**
 * 构建测试页浮窗 hash 路由 URL
 */
export function buildTestPanelFloatUrl(
  params?: Record<string, string | undefined>,
): string {
  if (!params || Object.keys(params).length === 0) {
    return './index.html#/test'
  }
  const sp = new URLSearchParams()
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== '') {
      sp.set(k, v)
    }
  }
  const q = sp.toString()
  return q ? `./index.html#/test?${q}` : './index.html#/test'
}
