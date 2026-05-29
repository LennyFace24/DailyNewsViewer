<script lang="ts">
  import { onMount } from 'svelte';
  import { Skeleton } from '$lib/components/ui/skeleton/index.js';
  import { Button } from '$lib/components/ui/button/index.js';
  import { Badge } from '$lib/components/ui/badge/index.js';
  import { RefreshCw } from 'lucide-svelte';
  import NewsList from '$lib/components/news/NewsList.svelte';
  import EmptyState from '$lib/components/shared/EmptyState.svelte';
  import {
    articles,
    filteredArticles,
    isLoading,
    addArticles,
    saveToCache,
    loadFromCache
  } from '$lib/stores/articles';
  import { allSources, enabledSources } from '$lib/stores/sources';
  import { fetchMultipleSources, fetchSingleSource } from '$lib/services/rss';
  import { fetchHackerNewsTopStories } from '$lib/services/apis';
  import { ContentCategory, CATEGORY_LABELS } from '$lib/types/source';

  const TOTAL_LIMIT = 50;
  const SINGLE_SOURCE_LIMIT = 30;

  let selectedCategory: ContentCategory | null = null;
  let selectedSourceId: string | null = null;
  let isRefreshing = false;

  // 获取当前板块的源
  $: categorySources = selectedCategory
    ? $enabledSources.filter(s => s.category === selectedCategory)
    : $enabledSources;

  // 过滤显示的文章
  $: displayArticles = $filteredArticles.filter(a => {
    if (selectedSourceId) {
      return a.sourceId === selectedSourceId;
    }
    if (selectedCategory) {
      const source = $allSources.find(s => s.id === a.sourceId);
      return source?.category === selectedCategory;
    }
    return true;
  });

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
      let newArticles: any[] = [];

      if (selectedSourceId) {
        // 刷新单个源
        const source = $enabledSources.find(s => s.id === selectedSourceId);
        if (source) {
          if (source.id === 'hackernews') {
            newArticles = await fetchHackerNewsTopStories(SINGLE_SOURCE_LIMIT);
          } else {
            newArticles = await fetchSingleSource(source, SINGLE_SOURCE_LIMIT);
          }
        }
      } else if (selectedCategory) {
        // 刷新板块内所有源
        const sources = $enabledSources.filter(s => s.category === selectedCategory);
        const results = await fetchMultipleSources(sources, TOTAL_LIMIT);
        newArticles = Array.from(results.values()).flat();
      } else {
        // 刷新所有源
        const results = await fetchMultipleSources($enabledSources, TOTAL_LIMIT);
        newArticles = Array.from(results.values()).flat();

        if ($enabledSources.some(s => s.id === 'hackernews')) {
          const hn = await fetchHackerNewsTopStories(15);
          newArticles.push(...hn);
        }
      }

      addArticles(newArticles);
      saveToCache();
    } catch (error) {
      console.error('Refresh failed:', error);
    } finally {
      isRefreshing = false;
    }
  }

  function selectCategory(cat: ContentCategory | null) {
    selectedCategory = cat;
    selectedSourceId = null;
  }

  function selectSource(sourceId: string | null) {
    selectedSourceId = sourceId;
  }

  onMount(() => {
    loadFromCache();
    if ($articles.length === 0) {
      refreshAll();
    }
  });
</script>

<div class="min-h-screen bg-background">
  <!-- 板块选择 -->
  <div class="sticky top-0 z-40 bg-background/90 backdrop-blur-xl border-b">
    <div class="px-4 py-2">
      <!-- 板块标签 -->
      <div class="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
        <Button
          variant={selectedCategory === null ? 'default' : 'ghost'}
          size="sm"
          class="shrink-0"
          on:click={() => selectCategory(null)}
        >
          全部
        </Button>
        {#each Object.values(ContentCategory) as cat}
          {#if cat !== ContentCategory.CUSTOM || $enabledSources.some(s => s.category === ContentCategory.CUSTOM)}
            <Button
              variant={selectedCategory === cat ? 'default' : 'ghost'}
              size="sm"
              class="shrink-0"
              on:click={() => selectCategory(cat)}
            >
              {CATEGORY_LABELS[cat]}
            </Button>
          {/if}
        {/each}
      </div>

      <!-- 源标签（选择板块后显示） -->
      {#if selectedCategory && categorySources.length > 1}
        <div class="flex gap-2 overflow-x-auto scrollbar-hide pt-1">
          <Button
            variant={selectedSourceId === null ? 'secondary' : 'ghost'}
            size="sm"
            class="shrink-0 text-xs"
            on:click={() => selectSource(null)}
          >
            全部{CATEGORY_LABELS[selectedCategory]}
          </Button>
          {#each categorySources as source}
            <Button
              variant={selectedSourceId === source.id ? 'secondary' : 'ghost'}
              size="sm"
              class="shrink-0 text-xs"
              on:click={() => selectSource(source.id)}
            >
              {source.name}
            </Button>
          {/each}
        </div>
      {/if}
    </div>
  </div>

  <!-- 内容区 -->
  <div class="px-4 py-4">
    {#if isRefreshing && $articles.length === 0}
      <div class="space-y-4">
        {#each Array(3) as _}
          <div class="space-y-3">
            <Skeleton class="h-48 rounded-xl" />
            <Skeleton class="h-4 w-3/4" />
          </div>
        {/each}
      </div>
    {:else if displayArticles.length === 0}
      <EmptyState
        icon="📰"
        title="暂无内容"
        description="点击刷新获取最新资讯"
        actionLabel="刷新"
        onAction={refreshAll}
      />
    {:else}
      <NewsList groups={displayGroups} />

      <div class="text-center py-6 text-xs text-muted-foreground/60">
        <p>共 {displayArticles.length} 条 · 高质量内容源</p>
      </div>
    {/if}
  </div>

  <!-- 刷新按钮 -->
  <button
    class="fixed bottom-20 right-4 z-50 w-12 h-12 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center"
    on:click={refreshAll}
    disabled={isRefreshing}
  >
    <RefreshCw class="w-5 h-5 {isRefreshing ? 'animate-spin' : ''}" />
  </button>
</div>

<style>
  .scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
</style>
