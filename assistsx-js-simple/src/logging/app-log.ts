import { log as assistsLog } from 'assistsx-js'

/** 取关公众号列表临时存储（浮窗新实例通过 sessionStorage 读取） */
export const STORAGE_KEY_UNFOLLOW_ACCOUNTS = 'assistsx:unfollowAccounts'

/** 清空宿主日志缓冲 */
export async function clearLogs(): Promise<void> {
  await assistsLog.clear().catch(() => {})
}

/** 写入宿主日志桥接（纯文本） */
export async function log(message: string): Promise<void> {
  await assistsLog.appendTimestampedEntry(message).catch(() => {})
}
