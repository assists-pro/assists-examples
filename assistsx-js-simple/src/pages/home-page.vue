<script setup lang="ts">
import { float } from 'assistsx-js'
import { onMounted } from 'vue'
import { buildLogPanelFloatUrl } from '@/core/float-log-url'

onMounted(() => {
  document.title = 'Assists Web示例'
})

async function openLogFloat(task: string) {
  const url = buildLogPanelFloatUrl({ task })
  await float.open(url, { showBottomOperationArea: true })
}
</script>

<template>
  <div class="home">
    <header class="home-header">
      <h1 class="home-title">Assists Web 示例</h1>
      <p class="home-desc">
        下方任务将在浮窗中打开日志面板并自动执行；日志写入独立 Web 实例，与宿主首页隔离。
      </p>
    </header>

    <section class="home-actions" aria-label="快捷操作">
      <button
        type="button"
        class="action action--account"
        @click="openLogFloat('accountInfo')"
      >
        <span class="action-title">获取微信账号信息</span>
        <span class="action-sub">读取账号相关元数据</span>
      </button>
      <button
        type="button"
        class="action action--moment"
        @click="openLogFloat('collectMoment')"
      >
        <span class="action-title">收集朋友圈</span>
        <span class="action-sub">浏览并采集朋友圈内容</span>
      </button>
      <button
        type="button"
        class="action action--like"
        @click="openLogFloat('momentLike')"
      >
        <span class="action-title">点赞朋友圈</span>
        <span class="action-sub">进入朋友圈并尝试点赞</span>
      </button>
      <button
        type="button"
        class="action action--unfollow"
        @click="openLogFloat('collectOfficial')"
      >
        <span class="action-title">批量取关公众号</span>
        <span class="action-sub">先采集列表，再在子页勾选取关</span>
      </button>
      <button
        type="button"
        class="action action--test"
        @click="openLogFloat('test')"
      >
        <span class="action-title">测试</span>
        <span class="action-sub">浮窗日志 + 查找「微信助手」节点</span>
      </button>
    </section>
  </div>
</template>

<style scoped>
.home {
  min-height: 100%;
  padding: clamp(16px, 4vw, 28px);
  overflow-y: auto;
  box-sizing: border-box;
  color: #e8eaef;
  background:
    radial-gradient(ellipse 120% 80% at 50% -20%, rgba(100, 108, 255, 0.35), transparent 55%),
    linear-gradient(165deg, #12131a 0%, #0a0b0f 100%);
}

.home-header {
  max-width: 560px;
  margin-bottom: clamp(20px, 5vw, 32px);
}

.home-title {
  font-size: clamp(1.5rem, 4vw, 1.85rem);
  font-weight: 700;
  letter-spacing: -0.02em;
  margin: 0 0 10px;
  color: #f4f5f8;
}

.home-desc {
  margin: 0;
  font-size: 0.9rem;
  line-height: 1.55;
  color: rgba(232, 234, 239, 0.72);
}

.home-actions {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(158px, 1fr));
  gap: 12px;
  max-width: 720px;
}

.action {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 6px;
  padding: 14px 16px;
  min-height: 76px;
  text-align: left;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  cursor: pointer;
  transition:
    transform 0.18s ease,
    box-shadow 0.18s ease,
    border-color 0.18s ease,
    background 0.18s ease;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.25);
}

.action:hover {
  transform: translateY(-2px);
  border-color: rgba(255, 255, 255, 0.14);
  box-shadow: 0 10px 28px rgba(0, 0, 0, 0.35);
}

.action:active {
  transform: translateY(0);
}

.action-title {
  font-size: 0.95rem;
  font-weight: 600;
  color: #fff;
}

.action-sub {
  font-size: 0.72rem;
  line-height: 1.35;
  color: rgba(255, 255, 255, 0.55);
}

.action--account {
  background: linear-gradient(135deg, #4f46e5 0%, #6366f1 100%);
}

.action--moment {
  background: linear-gradient(135deg, #0d9488 0%, #14b8a6 100%);
}

.action--like {
  background: linear-gradient(135deg, #db2777 0%, #ec4899 100%);
}

.action--unfollow {
  background: linear-gradient(135deg, #c2410c 0%, #ea580c 100%);
}

.action--test {
  background: linear-gradient(135deg, #52525b 0%, #71717a 100%);
}
</style>
