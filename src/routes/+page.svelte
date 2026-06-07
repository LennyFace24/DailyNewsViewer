<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { goto } from '$app/navigation';
  import { Skeleton } from '$lib/components/ui/skeleton/index.js';
  import { RefreshCw, Brain, Shield, Globe, Smartphone, Gamepad2, Settings, Database, Code, Package, Rocket, Briefcase, BookOpen, Newspaper, AlertCircle, SlidersHorizontal, Search } from 'lucide-svelte';
  import { createGestureHandler } from '$lib/utils/gesture';
  import NewsList from '$lib/components/news/NewsList.svelte';
  import NewsFilter from '$lib/components/news/NewsFilter.svelte';
  import RecommendedSection from '$lib/components/recommend/RecommendedSection.svelte';
  import LoadingSpinner from '$lib/components/shared/LoadingSpinner.svelte';
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

  const TOTAL_LIMIT = 30; // 减少初始加载量
  const INITIAL_LIMIT = 5; // 首次加载每个源只拉取5条

  let isRefreshing = false;
  let isLoadingMore = false;
  let loadError = '';
  let isFirstLoad = true;
  let showFilter = false;

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

  async function fetchAllSources(isInitialLoad = false) {
    loadError = '';
    const sources = $enabledSources;

    if (sources.length === 0) {
      loadError = '没有启用的数据源';
      return;
    }

    const limit = isInitialLoad ? INITIAL_LIMIT : TOTAL_LIMIT;
    let allArticles: any[] = [];

    // 拉取RSS源
    try {
      const results = await fetchMultipleSources(sources, limit);
      allArticles = Array.from(results.values()).flat();
    } catch (e) {
      console.error('RSS fetch failed:', e);
    }

    // 拉取Hacker News（限制数量）
    if (sources.some(s => s.id === 'hackernews')) {
      try {
        const hnLimit = isInitialLoad ? 5 : 15;
        const hn = await fetchHackerNewsTopStories(hnLimit);
        allArticles.push(...hn);
      } catch (e) {
        console.error('HN fetch failed:', e);
      }
    }

    if (allArticles.length === 0) {
      loadError = '无法获取内容，请检查网络连接';
      return;
    }

    addArticlesToPool(allArticles);
    saveToCache();
  }

  async function handleRefresh() {
    if (isRefreshing) return;
    isRefreshing = true;
    loadError = '';

    try {
      await fetchAllSources(false); // 手动刷新拉取更多
      refreshArticles();
    } catch (error) {
      console.error('Refresh failed:', error);
      loadError = '刷新失败，请稍后重试';
    } finally {
      isRefreshing = false;
    }
  }

  async function handleLoadMore() {
    if (isLoadingMore || !$hasMore) return;
    isLoadingMore = true;
    loadMoreArticles();
    setTimeout(() => isLoadingMore = false, 300);
  }

  function handleScroll(e: Event) {
    const target = e.target as HTMLElement;
    if (!target) return;
    const { scrollTop, scrollHeight, clientHeight } = target;
    if (scrollHeight - scrollTop - clientHeight < 300) {
      handleLoadMore();
    }
  }

  let gestureCleanup: (() => void) | null = null;

  onMount(async () => {
    loadFromCache();

    // 如果有缓存，先显示缓存
    if ($articles.length > 0) {
      isFirstLoad = false;
      return; // 有缓存就不自动刷新
    }

    // 首次加载，限制数量
    isRefreshing = true;
    try {
      await fetchAllSources(true);
    } finally {
      isRefreshing = false;
      isFirstLoad = false;
    }
  });

  onDestroy(() => {
    gestureCleanup?.();
  });
</script>

<div class="min-h-screen" on:scroll={handleScroll}>
  <!-- 分类筛选栏 -->
  <div class="sticky top-0 z-40 glass" style="padding-top: env(safe-area-inset-top, 0px);">
    <div class="px-4 py-3 flex items-center gap-2">
      <!-- 搜索按钮 -->
      <button
        class="shrink-0 w-9 h-9 rounded-lg flex items-center justify-center bg-white/5 hover:bg-white/10 transition-colors"
        on:click={() => goto('/search')}
      >
        <Search class="w-4 h-4" />
      </button>

      <!-- 筛选按钮 -->
      <button
        class="shrink-0 w-9 h-9 rounded-lg flex items-center justify-center bg-white/5 hover:bg-white/10 transition-colors"
        on:click={() => showFilter = true}
      >
        <SlidersHorizontal class="w-4 h-4" />
      </button>

      <!-- 分类标签 -->
      <div class="flex gap-2 overflow-x-auto scrollbar-hide flex-1">
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
    <!-- 推荐阅读 -->
    {#if !isFirstLoad && !$selectedTag}
      <RecommendedSection />
    {/if}

    <!-- 首次加载骨架屏 -->
    {#if isFirstLoad && isRefreshing}
      <div class="space-y-4">
        {#each Array(3) as _}
          <div class="space-y-3">
            <Skeleton class="h-48 rounded-xl bg-white/5" />
            <Skeleton class="h-4 w-3/4 bg-white/5" />
          </div>
        {/each}
      </div>

    <!-- 错误状态 -->
    {:else if loadError && displayArticles.length === 0}
      <div class="flex flex-col items-center justify-center py-20">
        <AlertCircle class="w-12 h-12 text-muted-foreground mb-4" />
        <p class="text-muted-foreground mb-4">{loadError}</p>
        <button class="refresh-btn px-6 py-2" on:click={handleRefresh}>
          重试
        </button>
      </div>

    <!-- 空状态 -->
    {:else if displayArticles.length === 0}
      <div class="flex flex-col items-center justify-center py-20">
        <Newspaper class="w-12 h-12 text-muted-foreground mb-4" />
        <p class="text-muted-foreground mb-4">暂无内容</p>
        <button class="refresh-btn px-6 py-2" on:click={handleRefresh}>
          刷新
        </button>
      </div>

    <!-- 内容列表 -->
    {:else}
      <NewsList groups={cachedGroups} />

      {#if isLoadingMore}
        <div class="flex justify-center py-6">
          <LoadingSpinner size="sm" text="加载中..." />
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

<!-- 筛选面板 -->
<NewsFilter bind:open={showFilter} />

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
    background: rgba(255, 255, 255, 0.1);
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.15s;
  }
  .refresh-btn:active {
    background: rgba(255, 255, 255, 0.2);
  }
  .refresh-btn:disabled {
    opacity: 0.5;
  }
</style>
