<template>
  <div
    class="log-panel-page"
    :class="{ 'log-panel-page--floating': isFloatingLog }"
  >
    <pre ref="outputRef" class="log-panel-output" aria-live="polite">{{
      displayText
    }}</pre>
    <footer class="log-panel-actions">
      <button type="button" class="log-panel-btn" @click="onAddLog">
        添加日志
      </button>
      <button
        type="button"
        class="log-panel-btn"
        :disabled="clearing"
        @click="onClearLog"
      >
        {{ clearing ? "清空中…" : "清空日志" }}
      </button>
      <button
        type="button"
        class="log-panel-btn"
        :disabled="uploading"
        @click="onUploadClick"
      >
        {{ uploading ? "上传中…" : "上传日志" }}
      </button>
    </footer>
  </div>
</template>

<script setup lang="ts">
import {
  float,
  log,
  LogStream,
  type LogUpdateEvent,
  type LogUploadResult,
} from "assistsx-js";
import {
  computed,
  nextTick,
  onActivated,
  onMounted,
  onUnmounted,
  ref,
} from "vue";
import { useRoute } from "vue-router";

defineOptions({ name: "LogPanelPage" });

/** 与宿主端 uploadLogs / AssistsLogDiagnostics 的 uploadKey 一致 */
const LOG_UPLOAD_KEY = "ulk_Y7MnauToi6rS8Ioi5G-HLuIsxQMvGFb45mw1Y91_xi0";

const route = useRoute();

/** 浮窗打开（无 inline=1）时为 true，与 App.vue 根透明逻辑一致 */
const isFloatingLog = computed(() => {
  const q = route.query.inline;
  const isInline = q === "1" || (Array.isArray(q) && q[0] === "1");
  return !isInline;
});

const lines = ref<string[]>([]);
const demoSeq = ref(0);
const clearing = ref(false);
const uploading = ref(false);
const outputRef = ref<HTMLElement | null>(null);

const displayText = computed(() =>
  lines.value.length > 0 ? lines.value.join("\n") : "暂无日志内容。",
);

function scrollToBottom() {
  void nextTick(() => {
    const el = outputRef.value;
    if (el) el.scrollTop = el.scrollHeight;
  });
}

/** 与 log.addLogUpdateListener 注册的同一引用，便于卸载时移除 */
function onLogUpdate(ev: LogUpdateEvent) {
  if (ev.code !== 0 || !ev.data) return;
  const { stream, text } = ev.data;
  if (stream === LogStream.entireLogText) {
    lines.value = text ? text.split(/\r?\n/) : [];
  } else {
    const line = text.trimEnd();
    if (line) lines.value = [...lines.value, line];
  }
  scrollToBottom();
}

async function loadLogFromBridge() {
  try {
    const text = (await log.readAllText()).trimEnd();
    if (text) lines.value = text.split(/\r?\n/);
  } catch {
    // 无 assistsxLog 桥接时忽略
  } finally {
    scrollToBottom();
  }
}

onMounted(() => {
  log.addLogUpdateListener(onLogUpdate);
  scrollToBottom();
  void loadLogFromBridge();
});

/** 若外层使用 keep-alive，再次进入页面时也要滚到底 */
onActivated(() => {
  scrollToBottom();
});

onUnmounted(() => {
  log.removeLogUpdateListener(onLogUpdate);
});

function onAddLog() {
  demoSeq.value += 1;
  const message = `示例日志 #${demoSeq.value}`;
  log.appendTimestampedEntry(message);
}

async function onClearLog() {
  if (clearing.value) return;
  clearing.value = true;
  try {
    const ok = await log.clear();
    if (ok) {
      lines.value = [];
      void float.toast("已清空日志", 1800).catch(() => {});
    } else {
      void float.toast("清空失败", 2200).catch(() => {});
    }
  } catch (e) {
    const msg = e instanceof Error ? e.message : "清空失败";
    void float.toast(msg, 2200).catch(() => {});
  } finally {
    clearing.value = false;
  }
}

/** 将上传失败结果格式化为可写入日志的多行文本 */
function formatUploadFailureForLog(result: LogUploadResult): string {
  const parts: string[] = ["[上传失败]"];
  parts.push(`message: ${result.message}`);
  if (result.httpCode !== undefined) {
    parts.push(`httpCode: ${String(result.httpCode)}`);
  }
  if (result.causeMessage) {
    parts.push(`causeMessage: ${result.causeMessage}`);
  }
  if (result.responseBody) {
    parts.push(`responseBody: ${result.responseBody}`);
  }
  if (result.localLogFilePath) {
    parts.push(`localLogFilePath: ${result.localLogFilePath}`);
  }
  if (result.localScreenshotFilePath) {
    parts.push(`localScreenshotFilePath: ${result.localScreenshotFilePath}`);
  }
  if (result.localNodeTreeFilePath) {
    parts.push(`localNodeTreeFilePath: ${result.localNodeTreeFilePath}`);
  }
  if (result.data !== undefined) {
    const s =
      typeof result.data === "string"
        ? result.data
        : JSON.stringify(result.data, null, 2);
    parts.push(`data: ${s}`);
  }
  return parts.join("\n");
}

async function onUploadClick() {
  if (uploading.value) return;
  uploading.value = true;
  // void float.toast("正在上传日志，请稍候…").catch(() => {});
  try {
    const result = await log.uploadLogs({
      timeout: 120,
      uploadKey: LOG_UPLOAD_KEY,
    });
    if (result.success) {
      let baseUrl = "";
      try {
        baseUrl = (await log.getLogServiceBaseUrl()).trim();
      } catch {
        // 与上传结果无关，忽略
      }
      const line = baseUrl
        ? `日志已成功上传，请访问 ${baseUrl} 管理后台查看日志。`
        : "日志已成功上传，请访问日志服务管理后台查看日志。";
      log.appendTimestampedEntry(line);
    } else {
      log.appendTimestampedEntry(formatUploadFailureForLog(result));
    }
  } catch (e) {
    const detail =
      e instanceof Error
        ? `${e.message}${e.stack ? `\n${e.stack}` : ""}`
        : String(e);
    log.appendTimestampedEntry(`[上传异常]\n${detail}`);
  } finally {
    uploading.value = false;
  }
}
</script>

<style scoped>
.log-panel-page {
  display: flex;
  flex-direction: column;
  /* 固定为一屏高度，避免日志变长时把底部按钮顶出视口 */
  height: 100svh;
  max-height: 100svh;
  height: 100dvh;
  max-height: 100dvh;
  overflow: hidden;
  width: 100%;
  box-sizing: border-box;
  background: transparent;
}

/* 浮窗场景：半透黑底，透出下层宿主界面 */
.log-panel-page--floating {
  background: rgba(0, 0, 0, 0.5);
}

.log-panel-output {
  flex: 1 1 0;
  min-height: 0;
  margin: 0;
  padding: 12px 14px;
  overflow: auto;
  font-family: var(--mono, ui-monospace, monospace);
  font-size: 0.8125rem;
  line-height: 1.5;
  color: var(--text, #e2e8f0);
  background: transparent;
  border: none;
  border-radius: 0;
  white-space: pre-wrap;
  word-break: break-word;
}

.log-panel-actions {
  flex: 0 0 auto;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 6px;
  padding: 6px 8px calc(6px + env(safe-area-inset-bottom, 0px));
  background: transparent;
  border-top: none;
}

.log-panel-btn {
  font: inherit;
  font-weight: 600;
  font-size: 0.75rem;
  padding: 6px 8px;
  border-radius: 8px;
  cursor: pointer;
  color: #fff;
  border: 1px solid #7c3aed;
  background: linear-gradient(165deg, #7c3aed 0%, #6366f1 100%);
  box-shadow: 0 2px 0 #4c1d95;
}

.log-panel-btn:active {
  transform: translateY(1px);
  box-shadow: 0 1px 0 #4c1d95;
}

.log-panel-btn:focus-visible {
  outline: 2px solid var(--accent, #a78bfa);
  outline-offset: 2px;
}

.log-panel-btn:disabled {
  opacity: 0.65;
  cursor: not-allowed;
}
</style>
