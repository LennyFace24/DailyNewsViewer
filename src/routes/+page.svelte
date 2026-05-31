<script lang="ts">
  import { onMount } from 'svelte';
  import { Skeleton } from '$lib/components/ui/skeleton/index.js';
  import { RefreshCw, Brain, Shield, Globe, Smartphone, Gamepad2, Settings, Database, Code, Package, Rocket, Briefcase, BookOpen, Newspaper } from 'lucide-svelte';
  import NewsList from '$lib/components/news/NewsList.svelte';
  import EmptyState from '$lib/components/shared/EmptyState.svelte';
  import {
    articles, filteredArticles, displayedArticles,
    addArticlesToPool, saveToCache, loadFromCache,
    refreshArticles, loadMoreArticles, hasMore
  } from '$lib/stores/articles';
  import { enabledSources } from '$lib/stores/sources';
  import { selectedTag } from '$lib/stores/ui';
  import { fetchMultipleSources } from '$lib/services/rss';
  import { fetchHackerNewsTopStories } from '$lib/services/apis';
  import { getArticleCategory } from '$lib/services/classifier';
  import { ContentTag, TAG_INFO } from '$lib/types/source';

  const TOTAL_LIMIT = 100;

  let isRefreshing = false;
  let isLoadingMore = false;

  const iconMap: Record<string, any> = {
    brain: Brain, shield: Shield, globe: Globe, smartphone: Smartphone,
    'gamepad-2': Gamepad2, settings: Settings, database: Database, code: Code,
    package: Package, rocket: Rocket, briefcase: Briefcase, 'book-open': BookOpen, newspaper: Newspaper
  };

  // 缓存分类结果
  let cachedArticles: typeof $filteredArticles = [];
  let cachedTags: typeof $filteredArticles = [];

  $: if ($filteredArticles !== cachedArticles) {
    cachedArticles = $filteredArticles;
    cachedTags = $filteredArticles.map(a => ({
      ...a,
      contentTag: getArticleCategory(a)
    }));
  }

  $: displayArticles = $selectedTag
    ? cachedTags.filter(a => a.contentTag === $selectedTag)
    : cachedTags;

  $: availableTags = (() => {
    const tags = new Set(cachedTags.map(a => a.contentTag));
    return Object.values(ContentTag).filter(t => tags.has(t));
  })();

  // 缓存分组结果
  let lastDisplayKey = '';
  let cachedGroups: any[] = [];

  $: {
    const key = `${$selectedTag}-${displayArticles.length}-${displayArticles[0]?.id}`;
    if (key !== lastDisplayKey) {
      lastDisplayKey = key;
      const groups = new Map<string, typeof displayArticles>();
      for (const article of displayArticles) {
        const date = new Date(article.publishedAt).toDateString();
        const existing = groups.get(date) || [];
        existing.push(article);
        groups.set(date, existing);
      }
      cachedGroups = Array.from(groups.entries()).map(([date, arts]) => ({
        date: formatDate(date),
        articles: arts.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
      }));
    }
  }

  function formatDate(dateStr: string): string {
    const d = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    if (d.toDateString() === today.toDateString()) return '今天';
    if (d.toDateString() === yesterday.toDateString()) return '昨天';
    return `${d.getMonth() + 1}月${d.getDate()}日`;
  }

  async function fetchAllSources() {
    const results = await fetchMultipleSources($enabledSources, TOTAL_LIMIT);
    let newArticles = Array.from(results.values()).flat();

    if ($enabledSources.some(s => s.id === 'hackernews')) {
      const hn = await fetchHackerNewsTopStories(30);
      newArticles.push(...hn);
    }

    addArticlesToPool(newArticles);
    saveToCache();
  }

  async function handleRefresh() {
    if (isRefreshing) return;
    isRefreshing = true;
    try {
      await fetchAllSources();
      refreshArticles();
    } catch (error) {
      console.error('Refresh failed:', error);
    } finally {
      isRefreshing = false;
    }
  }

  async function handleLoadMore() {
    if (isLoadingMore || !$hasMore) return;
    isLoadingMore = true;
    loadMoreArticles();
    // 模拟加载延迟
    setTimeout(() => isLoadingMore = false, 300);
  }

  // 滚动检测
  function handleScroll(e: Event) {
    const target = e.target as HTMLElement;
    if (!target) return;

    const { scrollTop, scrollHeight, clientHeight } = target;
    if (scrollHeight - scrollTop - clientHeight < 300) {
      handleLoadMore();
    }
  }

  onMount(async () => {
    loadFromCache();
    if ($articles.length === 0) {
      isRefreshing = true;
      try {
        await fetchAllSources();
        refreshArticles();
      } finally {
        isRefreshing = false;
      }
    }
  });
</script>

<div class="min-h-screen" on:scroll={handleScroll}>
  <!-- 分类筛选栏 -->
  <div class="sticky top-0 z-40 glass">
    <div class="px-4 py-3">
      <div class="flex gap-2 overflow-x-auto scrollbar-hide">
        <button
          class="tag-btn shrink-0 px-4 py-1.5 rounded-full text-sm font-medium {$selectedTag === null ? 'active' : ''}"
          on:click={() => selectedTag.set(null)}
        >
          全部
        </button>
        {#each availableTags as tag}
          {@const Icon = iconMap[TAG_INFO[tag]?.icon] || Newspaper}
          <button
            class="tag-btn shrink-0 px-4 py-1.5 rounded-full text-sm font-medium flex items-center gap-1.5 {$selectedTag === tag ? 'active' : ''}"
            on:click={() => selectedTag.set(tag)}
          >
            <Icon class="w-3.5 h-3.5" />
            {TAG_INFO[tag]?.label || tag}
          </button>
        {/each}
      </div>
    </div>
  </div>

  <!-- 内容区 -->
  <div class="px-4 py-4">
    {#if isRefreshing && $displayedArticles.length === 0}
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
        icon="newspaper"
        title="暂无内容"
        description="下拉刷新获取最新资讯（仅显示最近2天）"
        actionLabel="刷新"
        onAction={handleRefresh}
      />
    {:else}
      <NewsList groups={cachedGroups} />

      <!-- 加载状态 -->
      {#if isLoadingMore}
        <div class="flex justify-center py-6">
          <div class="flex gap-1">
            <div class="w-2 h-2 bg-white/30 rounded-full animate-bounce" style="animation-delay: 0ms" />
            <div class="w-2 h-2 bg-white/30 rounded-full animate-bounce" style="animation-delay: 150ms" />
            <div class="w-2 h-2 bg-white/30 rounded-full animate-bounce" style="animation-delay: 300ms" />
          </div>
        </div>
      {:else if !$hasMore}
        <div class="text-center py-6 text-xs text-muted-foreground/40">
          <p>已显示全部内容（最近2天）</p>
        </div>
      {/if}

      <div class="text-center py-2 text-xs text-muted-foreground/40">
        <p>共 {displayArticles.length} 条</p>
      </div>
    {/if}
  </div>

  <!-- 浮动刷新按钮 -->
  <button
    class="refresh-btn fixed bottom-20 right-4 z-50 w-12 h-12 rounded-full glass flex items-center justify-center"
    on:click={handleRefresh}
    disabled={isRefreshing}
  >
    <RefreshCw class="w-5 h-5 {isRefreshing ? 'animate-spin' : ''}" />
  </button>
</div>

<style>
  button {
    touch-action: manipulation;
    -webkit-tap-highlight-color: transparent;
    user-select: none;
  }

  .tag-btn {
    color: rgba(255, 255, 255, 0.5);
    transition: all 0.15s;
  }
  .tag-btn:active, .tag-btn.active {
    background: rgba(255, 255, 255, 0.12);
    color: white;
  }

  .refresh-btn {
    transition: all 0.15s;
  }
  .refresh-btn:active {
    transform: scale(0.95);
    background: rgba(255, 255, 255, 0.15);
  }
</style>
