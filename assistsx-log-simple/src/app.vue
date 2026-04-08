<template>
  <div class="app-root" :class="{ 'app-root--full-bleed': isLogPanel }">
    <RouterView />
  </div>
</template>

<script setup lang="ts">
import { computed, watch } from "vue";
import { useRoute } from "vue-router";
import "./app.css";

const route = useRoute();
const isLogPanel = computed(() => route.name === "logPanel");

/** 日志页：浮窗打开（无 inline=1）→ 根透明；内联示例（inline=1）→ 黑底 */
function syncLogPanelRootClass(): void {
  const name = route.name;
  const q = route.query.inline;
  const isLog = name === "logPanel";
  const isInlineLogRoute = q === "1" || (Array.isArray(q) && q[0] === "1");
  document.documentElement.classList.toggle(
    "log-panel-transparent",
    isLog && !isInlineLogRoute,
  );
  document.documentElement.classList.toggle(
    "log-panel-inline",
    isLog && isInlineLogRoute,
  );
}

watch(() => [route.name, route.query.inline] as const, syncLogPanelRootClass, {
  immediate: true,
});
</script>
