<script setup lang="ts">
import { Step } from "assistsx-js";
import { onMounted, watch } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
onMounted(() => {
  // Step.delayMsDefault = 1000;
  // Step.repeatCountMaxDefault = 15;
  // Step.showLog = false;
});
/** 日志浮窗：根透明；内联调试（inline=1）：黑底 */
function syncLogPanelRootClass(): void {
  const q = route.query.inline;
  const isInlineLogRoute = q === "1" || (Array.isArray(q) && q[0] === "1");
  const isLog = route.path === "/logs";
  document.documentElement.classList.toggle(
    "log-panel-transparent",
    isLog && !isInlineLogRoute,
  );
  document.documentElement.classList.toggle(
    "log-panel-inline",
    isLog && isInlineLogRoute,
  );
}

watch(() => [route.path, route.query.inline] as const, syncLogPanelRootClass, {
  immediate: true,
});
</script>

<template>
  <router-view />
</template>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html,
body,
#app {
  height: 100vh;
  width: 100vw;
  overflow: hidden;
}

html.log-panel-transparent {
  background: transparent !important;
}

html.log-panel-transparent body,
html.log-panel-transparent #app {
  background: transparent;
}

html.log-panel-inline {
  background: #000000 !important;
}

html.log-panel-inline body,
html.log-panel-inline #app {
  background: #000000;
}
</style>
