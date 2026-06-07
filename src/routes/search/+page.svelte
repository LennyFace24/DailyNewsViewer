<script lang="ts">
  import { goto } from '$app/navigation';
  import { ArrowLeft, Clock, Trash2 } from 'lucide-svelte';
  import SearchBar from '$lib/components/search/SearchBar.svelte';
  import SearchResults from '$lib/components/search/SearchResults.svelte';
  import Kbd from '$lib/components/shared/Kbd.svelte';
  import { articles } from '$lib/stores/articles';
  import type { Article } from '$lib/types/news';

  let query = '';
  let results: Article[] = [];
  let isSearching = false;
  let searchHistory: string[] = [];

  // 加载搜索历史
  onMount(() => {
    const saved = localStorage.getItem('dailytech_search_history');
    if (saved) {
      try {
        searchHistory = JSON.parse(saved);
      } catch {}
    }
  });

  function saveToHistory(q: string) {
    if (!q.trim()) return;
    searchHistory = [q, ...searchHistory.filter(h => h !== q)].slice(0, 10);
    localStorage.setItem('dailytech_search_history', JSON.stringify(searchHistory));
  }

  function clearHistory() {
    searchHistory = [];
    localStorage.removeItem('dailytech_search_history');
  }

  function handleSearch(event: CustomEvent<{ query: string }>) {
    query = event.detail.query;

    if (!query.trim()) {
      results = [];
      return;
    }

    isSearching = true;

    // 搜索标题和摘要
    const lowerQuery = query.toLowerCase();
    results = $articles.filter(a =>
      a.title.toLowerCase().includes(lowerQuery) ||
      a.summary.toLowerCase().includes(lowerQuery) ||
      a.sourceName.toLowerCase().includes(lowerQuery)
    );

    saveToHistory(query);
    isSearching = false;
  }

  function handleHistoryClick(q: string) {
    query = q;
    handleSearch(new CustomEvent('search', { detail: { query: q } }));
  }

  import { onMount } from 'svelte';
</script>

<div class="min-h-screen pb-20">
  <!-- 顶部栏 -->
  <div class="sticky top-0 z-40 glass" style="padding-top: env(safe-area-inset-top, 0px);">
    <div class="flex items-center gap-3 px-4 py-3">
      <button class="back-btn" on:click={() => goto('/')}>
        <ArrowLeft class="w-5 h-5" />
      </button>
      <div class="flex-1">
        <SearchBar bind:value={query} on:search={handleSearch} />
      </div>
    </div>
  </div>

  <!-- 内容区 -->
  {#if !query}
    <!-- 搜索历史 -->
    {#if searchHistory.length > 0}
      <div class="px-4 py-4">
        <div class="flex items-center justify-between mb-3">
          <h3 class="text-sm font-medium text-muted-foreground">搜索历史</h3>
          <button class="clear-history-btn" on:click={clearHistory}>
            <Trash2 class="w-3.5 h-3.5" />
            清除
          </button>
        </div>
        <div class="flex flex-wrap gap-2">
          {#each searchHistory as item}
            <button
              class="history-tag"
              on:click={() => handleHistoryClick(item)}
            >
              <Clock class="w-3 h-3" />
              {item}
            </button>
          {/each}
        </div>
      </div>
    {/if}

    <!-- 热门搜索 -->
    <div class="px-4 py-4">
      <h3 class="text-sm font-medium text-muted-foreground mb-3">热门话题</h3>
      <div class="flex flex-wrap gap-2">
        {#each ['AI', 'Rust', 'React', 'Security', 'Web3', 'LLM'] as tag}
          <button
            class="hot-tag"
            on:click={() => handleHistoryClick(tag)}
          >
            {tag}
          </button>
        {/each}
      </div>
    </div>

    <!-- 快捷键提示 -->
    <div class="px-4 py-4">
      <h3 class="text-sm font-medium text-muted-foreground mb-3">快捷键</h3>
      <div class="space-y-2">
        <div class="flex items-center gap-3">
          <Kbd key="Enter" />
          <span class="text-sm text-muted-foreground">搜索</span>
        </div>
        <div class="flex items-center gap-3">
          <Kbd key="Esc" />
          <span class="text-sm text-muted-foreground">清除搜索</span>
        </div>
      </div>
    </div>
  {:else}
    <!-- 搜索结果 -->
    <SearchResults {results} {query} isLoading={isSearching} />
  {/if}
</div>

<style>
  .back-btn {
    width: 36px;
    height: 36px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    background: transparent;
    border: none;
    cursor: pointer;
  }
  .back-btn:active {
    background: rgba(255, 255, 255, 0.1);
  }

  .clear-history-btn {
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 4px 8px;
    border-radius: 6px;
    background: transparent;
    color: rgba(255, 255, 255, 0.4);
    font-size: 12px;
    border: none;
    cursor: pointer;
    transition: all 0.2s;
  }
  .clear-history-btn:active {
    background: rgba(255, 255, 255, 0.05);
    color: rgba(255, 255, 255, 0.7);
  }

  .history-tag {
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 6px 12px;
    border-radius: 100px;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.08);
    color: rgba(255, 255, 255, 0.6);
    font-size: 13px;
    cursor: pointer;
    transition: all 0.2s;
  }
  .history-tag:active {
    background: rgba(255, 255, 255, 0.1);
    color: white;
  }

  .hot-tag {
    padding: 6px 14px;
    border-radius: 100px;
    background: rgba(255, 255, 255, 0.08);
    border: 1px solid rgba(255, 255, 255, 0.1);
    color: rgba(255, 255, 255, 0.7);
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
  }
  .hot-tag:active {
    background: rgba(255, 255, 255, 0.15);
    color: white;
  }
</style>
