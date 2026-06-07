<script lang="ts">
  import type { Article } from '$lib/types/news';
  import NewsCard from '$lib/components/news/NewsCard.svelte';
  import { Clock, Search } from 'lucide-svelte';

  export let results: Article[] = [];
  export let query: string = '';
  export let isLoading: boolean = false;
</script>

<div class="search-results">
  {#if isLoading}
    <div class="loading-state">
      <div class="flex gap-1">
        <div class="w-2 h-2 bg-white/30 rounded-full animate-bounce" style="animation-delay: 0ms" />
        <div class="w-2 h-2 bg-white/30 rounded-full animate-bounce" style="animation-delay: 150ms" />
        <div class="w-2 h-2 bg-white/30 rounded-full animate-bounce" style="animation-delay: 300ms" />
      </div>
      <p class="text-sm text-muted-foreground mt-2">搜索中...</p>
    </div>
  {:else if query && results.length === 0}
    <div class="empty-state">
      <Search class="w-12 h-12 text-muted-foreground mb-3" />
      <p class="text-muted-foreground">未找到相关文章</p>
      <p class="text-xs text-muted-foreground/60 mt-1">尝试其他关键词</p>
    </div>
  {:else if results.length > 0}
    <div class="results-header">
      <p class="text-xs text-muted-foreground">
        找到 {results.length} 篇相关文章
      </p>
    </div>
    <div class="results-list">
      {#each results as article, index (article.id)}
        <NewsCard {article} {index} />
      {/each}
    </div>
  {/if}
</div>

<style>
  .search-results {
    padding: 16px;
  }

  .loading-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 48px 0;
  }

  .empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 48px 0;
  }

  .results-header {
    margin-bottom: 16px;
  }

  .results-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
</style>
