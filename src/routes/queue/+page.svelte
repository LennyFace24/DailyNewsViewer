<script lang="ts">
  import { goto } from '$app/navigation';
  import { Clock, Trash2, BookOpen } from 'lucide-svelte';
  import { readingQueue, queueCount } from '$lib/stores/queue';
  import NewsCard from '$lib/components/news/NewsCard.svelte';
  import EmptyState from '$lib/components/shared/EmptyState.svelte';

  function clearQueue() {
    if (confirm('确定清空阅读队列？')) {
      readingQueue.clear();
    }
  }
</script>

<div class="min-h-screen pb-20">
  <!-- 顶部栏 -->
  <div class="sticky top-0 z-40 glass" style="padding-top: env(safe-area-inset-top, 0px);">
    <div class="flex items-center justify-between px-4 h-14">
      <div class="flex items-center gap-3">
        <div class="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
          <Clock class="w-4 h-4" />
        </div>
        <div>
          <h1 class="font-semibold">稍后阅读</h1>
          <p class="text-xs text-muted-foreground">{$queueCount} 篇文章</p>
        </div>
      </div>

      {#if $queueCount > 0}
        <button
          class="clear-btn"
          on:click={clearQueue}
        >
          <Trash2 class="w-4 h-4" />
        </button>
      {/if}
    </div>
  </div>

  <!-- 内容区 -->
  <div class="px-4 py-4">
    {#if $readingQueue.length === 0}
      <EmptyState
        icon="bookmark"
        title="队列为空"
        description="点击文章卡片上的时钟图标添加到稍后阅读"
      />
    {:else}
      <div class="masonry-grid">
        {#each $readingQueue as article, index (article.id)}
          <NewsCard {article} {index} />
        {/each}
      </div>
    {/if}
  </div>
</div>

<style>
  .clear-btn {
    width: 36px;
    height: 36px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: rgba(255, 255, 255, 0.5);
    background: transparent;
    border: none;
    cursor: pointer;
    transition: all 0.2s;
  }
  .clear-btn:active {
    background: rgba(255, 255, 255, 0.1);
    color: rgba(239, 68, 68, 0.8);
  }
</style>
