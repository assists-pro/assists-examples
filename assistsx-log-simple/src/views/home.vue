<template>
  <main class="landing">
    <div class="landing-body">
      <header class="landing-hero">
        <p class="landing-eyebrow">AssistsX · assistsx-js 日志</p>
        <h1>日志示例项目</h1>
        <p class="landing-lead">
          演示如何集成
          <strong>assistsx-js</strong
          >：添加、监听与上报日志。下方提供浮窗与页面内两种入口。
        </p>
        <div class="landing-purpose">
          <p class="landing-purpose-title">核心价值</p>
          <ol class="landing-points">
            <li>
              <strong>日志与界面节点绑定</strong
              >：与界面节点一一关联，上报后管理后台可查看对应节点，避免测试说不清页面、日志对不上现场，开发难以定位。
            </li>
            <li>在<strong>自动化流程</strong>中按需落日志，回溯步骤与异常。</li>
            <li>
              便于<strong>多人上报</strong>、对齐上下文；在<strong>后台</strong>结合节点与日志分析问题。
            </li>
          </ol>
        </div>
      </header>

      <section class="cta-grid" aria-label="示例入口">
        <button
          type="button"
          class="cta-card cta-card--floating"
          @click="onFloatingLogClick"
        >
          <div class="cta-body">
            <span class="cta-label">浮窗</span>
            <span class="cta-title">浮窗日志入口</span>
            <span class="cta-hint">在浮窗中打开日志面板（上方日志区 + 下方操作）。</span>
          </div>
          <span class="cta-arrow" aria-hidden="true">→</span>
        </button>
        <RouterLink
          class="cta-card cta-card--inline"
          :to="{ name: 'logPanel', query: { inline: '1' } }"
        >
          <div class="cta-body">
            <span class="cta-label">页面内</span>
            <span class="cta-title">内联日志示例</span>
            <span class="cta-hint">
              全屏日志面板（路由打开），添加、监听、清空与上报。
            </span>
          </div>
          <span class="cta-arrow" aria-hidden="true">→</span>
        </RouterLink>
      </section>

      <p v-if="floatingHint" class="floating-demo-hint">
        {{ floatingHint }}
      </p>
    </div>

    <footer class="landing-source-footer" aria-label="Source code">
      <div class="landing-source-main">
        <span class="landing-source-label">源码：</span>
        <a
          class="landing-source-link"
          :href="sourceUrl"
          :title="sourceUrl"
          target="_blank"
          rel="noopener noreferrer"
        >
          {{ sourceUrl }}
        </a>
      </div>
      <button
        type="button"
        class="landing-source-copy"
        :class="{ 'landing-source-copy--wide': copySucceeded }"
        :aria-label="copyAriaLabel"
        :title="copyTitle"
        @click="onCopySourceUrl"
      >
        <span v-if="copySucceeded" class="landing-source-copy-done" aria-live="polite">
          Copied
        </span>
        <svg
          v-else
          class="landing-source-copy-icon"
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
        </svg>
      </button>
    </footer>
  </main>
</template>

<script setup lang="ts">
import { float } from "assistsx-js";
import { computed, onMounted, ref } from "vue";

defineOptions({ name: "HomePage" });

/** 与 public/config.json 中 sourceUrl 一致，可被运行时覆盖 */
const DEFAULT_SOURCE_URL =
  "https://github.com/assists-pro/assists-examples/tree/main/assistsx-log-simple";

const floatingHint = ref("");
const sourceUrl = ref(DEFAULT_SOURCE_URL);
const copySucceeded = ref(false);

const copyAriaLabel = computed(() =>
  copySucceeded.value ? "Copied to clipboard" : "Copy source URL",
);

const copyTitle = computed(() =>
  copySucceeded.value ? "Copied" : "Copy URL",
);

function onFloatingLogClick() {
  float.open("/examples/log-panel", { showBottomOperationArea: true });
}

async function onCopySourceUrl(): Promise<void> {
  const url = sourceUrl.value;
  try {
    await navigator.clipboard.writeText(url);
    copySucceeded.value = true;
    window.setTimeout(() => {
      copySucceeded.value = false;
    }, 2000);
  } catch {
    try {
      const ta = document.createElement("textarea");
      ta.value = url;
      ta.setAttribute("readonly", "");
      ta.style.position = "fixed";
      ta.style.left = "-9999px";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      copySucceeded.value = true;
      window.setTimeout(() => {
        copySucceeded.value = false;
      }, 2000);
    } catch {
      copySucceeded.value = false;
    }
  }
}

onMounted(async () => {
  try {
    const res = await fetch("/config.json");
    if (!res.ok) return;
    const cfg = (await res.json()) as { sourceUrl?: unknown };
    if (typeof cfg.sourceUrl === "string" && cfg.sourceUrl.trim()) {
      sourceUrl.value = cfg.sourceUrl.trim();
    }
  } catch {
    // 使用默认仓库地址
  }
});
</script>
