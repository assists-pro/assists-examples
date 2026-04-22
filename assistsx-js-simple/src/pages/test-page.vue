<script setup lang="ts">
import { wxMomentLike } from "@/core/wx-moment-like";
import { Step } from "assistsx-js";
import { computed, onMounted, onUnmounted } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();
const originalTitle = document.title;

/** 浮窗打开（无 inline=1）时为 true */
const isFloating = computed(() => {
  const q = route.query.inline;
  const isInline = q === "1" || (Array.isArray(q) && q[0] === "1");
  return !isInline;
});

function onTestClick(): void {
  router.push({ path: "/logs" });
  Step.run(wxMomentLike.clickLikeMoment);
}

function onLogClick(): void {
  void router.push({ path: "/logs" });
}

onMounted(() => {
  document.title = "测试面板";
});

onUnmounted(() => {
  document.title = originalTitle;
});
</script>

<template>
  <div class="test-page" :class="{ 'test-page--floating': isFloating }">
    <div class="test-card">
      <h1 class="test-title">测试面板</h1>
      <p class="test-desc">测试按钮暂不执行逻辑；日志按钮进入执行日志页。</p>
      <div class="test-actions">
        <button
          type="button"
          class="test-btn test-btn--primary"
          @click="onTestClick"
        >
          测试
        </button>
        <button
          type="button"
          class="test-btn test-btn--secondary"
          @click="onLogClick"
        >
          日志
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.test-page {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100svh;
  min-height: 100dvh;
  width: 100%;
  box-sizing: border-box;
  padding: clamp(16px, 4vw, 24px);
  background: #0a0b0f;
}

.test-page--floating {
  background: transparent;
}

.test-card {
  width: min(360px, 100%);
  padding: 22px 20px;
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: linear-gradient(165deg, #1a1b24 0%, #12131a 100%);
  box-shadow: 0 16px 48px rgba(0, 0, 0, 0.45);
}

.test-title {
  margin: 0 0 8px;
  font-size: 1.25rem;
  font-weight: 700;
  color: #f4f5f8;
  letter-spacing: -0.02em;
}

.test-desc {
  margin: 0 0 20px;
  font-size: 0.85rem;
  line-height: 1.5;
  color: rgba(232, 234, 239, 0.65);
}

.test-actions {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.test-btn {
  width: 100%;
  padding: 12px 14px;
  font: inherit;
  font-weight: 600;
  font-size: 0.9rem;
  border-radius: 10px;
  cursor: pointer;
  border: 1px solid transparent;
  transition:
    transform 0.15s ease,
    box-shadow 0.15s ease,
    opacity 0.15s ease;
}

.test-btn:active {
  transform: scale(0.98);
}

.test-btn--primary {
  color: #fff;
  background: linear-gradient(135deg, #52525b 0%, #71717a 100%);
  border-color: rgba(255, 255, 255, 0.12);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.35);
}

.test-btn--secondary {
  color: #fff;
  background: linear-gradient(165deg, #7c3aed 0%, #6366f1 100%);
  border-color: rgba(124, 58, 237, 0.45);
  box-shadow: 0 6px 20px rgba(79, 70, 229, 0.35);
}
</style>
