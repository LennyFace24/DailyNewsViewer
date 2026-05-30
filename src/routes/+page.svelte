<script lang="ts">
  import { onMount } from 'svelte';
  import { Skeleton } from '$lib/components/ui/skeleton/index.js';
  import { Button } from '$lib/components/ui/button/index.js';
  import { RefreshCw } from 'lucide-svelte';
  import NewsList from '$lib/components/news/NewsList.svelte';
  import EmptyState from '$lib/components/shared/EmptyState.svelte';
  import {
    articles, filteredArticles, isLoading,
    addArticles, saveToCache, loadFromCache
  } from '$lib/stores/articles';
  import { enabledSources } from '$lib/stores/sources';
  import { fetchMultipleSources, fetchSingleSource } from '$lib/services/rss';
  import { fetchHackerNewsTopStories } from '$lib/services/apis';
  import { classifyArticle } from '$lib/services/classifier';
  import { ContentTag, TAG_INFO } from '$lib/types/source';

  const TOTAL_LIMIT = 60;
  const SINGLE_SOURCE_LIMIT = 30;

  let selectedTag: ContentTag | null = null;
  let isRefreshing = false;

  // 获取所有文章并按标签分组
  $: articlesWithTags = $filteredArticles.map(a => ({
    ...a,
    contentTag: classifyArticle(a)
  }));

  // 按选中标签过滤
  $: displayArticles = selectedTag
    ? articlesWithTags.filter(a => a.contentTag === selectedTag)
    : articlesWithTags;

  // 获取有文章的标签
  $: availableTags = (() => {
    const tags = new Set(articlesWithTags.map(a => a.contentTag));
    return Object.values(ContentTag).filter(t => tags.has(t));
  })();

  // 按日期分组
  $: displayGroups = (() => {
    const groups = new Map<string, typeof displayArticles>();
    for (const article of displayArticles) {
      const date = new Date(article.publishedAt).toDateString();
      const existing = groups.get(date) || [];
      existing.push(article);
      groups.set(date, existing);
    }
    return Array.from(groups.entries()).map(([date, arts]) => ({
      date: formatDate(date),
      articles: arts.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    }));
  })();

  function formatDate(dateStr: string): string {
    const d = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    if (d.toDateString() === today.toDateString()) return '今天';
    if (d.toDateString() === yesterday.toDateString()) return '昨天';
    return `${d.getMonth() + 1}月${d.getDate()}日`;
  }

  async function refreshAll() {
    if (isRefreshing) return;
    isRefreshing = true;
    try {
      const results = await fetchMultipleSources($enabledSources, TOTAL_LIMIT);
      let newArticles = Array.from(results.values()).flat();

      if ($enabledSources.some(s => s.id === 'hackernews')) {
        const hn = await fetchHackerNewsTopStories(15);
        newArticles.push(...hn);
      }

      addArticles(newArticles);
      saveToCache();
    } catch (error) {
      console.error('Refresh failed:', error);
    } finally {
      isRefreshing = false;
    }
  }

  onMount(() => {
    loadFromCache();
    if ($articles.length === 0) refreshAll();
  });
</script>

<div class="min-h-screen">
  <!-- 标签筛选栏 -->
  <div class="sticky top-0 z-40 glass">
    <div class="px-4 py-3">
      <div class="flex gap-2 overflow-x-auto scrollbar-hide">
        <button
          class="shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-all
                 {selectedTag === null ? 'bg-white/10 text-foreground' : 'text-muted-foreground hover:text-foreground'}"
          on:click={() => selectedTag = null}
        >
          全部
        </button>
        {#each availableTags as tag}
          <button
            class="shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-all
                   {selectedTag === tag ? 'bg-white/10 text-foreground' : 'text-muted-foreground hover:text-foreground'}"
            on:click={() => selectedTag = tag}
          >
            {TAG_INFO[tag].icon} {TAG_INFO[tag].label}
          </button>
        {/each}
      </div>
    </div>
  </div>

  <!-- 内容区 -->
  <div class="px-4 py-4">
    {#if isRefreshing && $articles.length === 0}
      <div class="space-y-4">
        {#each Array(3) as _}
          <div class="space-y-3">
            <Skeleton class="h-48 rounded-xl bg-white/5" />
            <Skeleton class="h-4 w-3/4 bg-white/5" />
          </div>
        {/each}
      </div>
    {:else if displayArticles.length === 0}
      <EmptyState
        icon="📰"
        title="暂无内容"
        description="下拉刷新获取最新资讯"
        actionLabel="刷新"
        onAction={refreshAll}
      />
    {:else}
      <NewsList groups={displayGroups} />
      <div class="text-center py-6 text-xs text-muted-foreground/60">
        <p>共 {displayArticles.length} 条</p>
      </div>
    {/if}
  </div>

  <!-- 浮动刷新按钮 -->
  <button
    class="fixed bottom-20 right-4 z-50 w-12 h-12 rounded-full glass accent-glow flex items-center justify-center transition-transform active:scale-95"
    on:click={refreshAll}
    disabled={isRefreshing}
  >
    <RefreshCw class="w-5 h-5 {isRefreshing ? 'animate-spin' : ''}" />
  </button>
</div>
