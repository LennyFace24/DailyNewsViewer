<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { Github, Star, GitFork, ExternalLink, RefreshCw } from 'lucide-svelte';
  import { fetchGitHubTrending } from '$lib/services/apis/github';
  import type { Article } from '$lib/types/news';
  import LoadingSpinner from '$lib/components/shared/LoadingSpinner.svelte';
  import EmptyIllustration from '$lib/components/shared/EmptyIllustration.svelte';

  let repos: Article[] = [];
  let isLoading = true;
  let selectedLanguage = '';
  let selectedPeriod = 'daily';

  const languages = [
    { value: '', label: '全部' },
    { value: 'javascript', label: 'JavaScript' },
    { value: 'typescript', label: 'TypeScript' },
    { value: 'python', label: 'Python' },
    { value: 'rust', label: 'Rust' },
    { value: 'go', label: 'Go' },
    { value: 'java', label: 'Java' },
    { value: 'c++', label: 'C++' },
    { value: 'swift', label: 'Swift' },
  ];

  const periods = [
    { value: 'daily', label: '今日' },
    { value: 'weekly', label: '本周' },
    { value: 'monthly', label: '本月' },
  ];

  function handleImageError(e: Event) {
    const img = e.target as HTMLImageElement;
    img.style.display = 'none';
  }

  onMount(() => {
    loadTrending();
  });

  async function loadTrending() {
    isLoading = true;
    try {
      repos = await fetchGitHubTrending(selectedLanguage, selectedPeriod);
    } catch (error) {
      console.error('Failed to load trending:', error);
    } finally {
      isLoading = false;
    }
  }

  function handleLanguageChange(lang: string) {
    selectedLanguage = lang;
    loadTrending();
  }

  function handlePeriodChange(period: string) {
    selectedPeriod = period;
    loadTrending();
  }
</script>

<div class="min-h-screen pb-20">
  <!-- 顶部栏 -->
  <div class="sticky top-0 z-40 glass" style="padding-top: env(safe-area-inset-top, 0px);">
    <div class="flex items-center justify-between px-4 h-14">
      <div class="flex items-center gap-2">
        <Github class="w-5 h-5" />
        <span class="font-medium">GitHub Trending</span>
      </div>
      <button class="refresh-btn" on:click={loadTrending} disabled={isLoading}>
        <RefreshCw class="w-4 h-4 {isLoading ? 'animate-spin' : ''}" />
      </button>
    </div>

    <!-- 筛选栏 -->
    <div class="px-4 pb-3 space-y-2">
      <!-- 语言筛选 -->
      <div class="flex gap-2 overflow-x-auto scrollbar-hide">
        {#each languages as lang}
          <button
            class="chip {selectedLanguage === lang.value ? 'active' : ''}"
            on:click={() => handleLanguageChange(lang.value)}
          >
            {lang.label}
          </button>
        {/each}
      </div>

      <!-- 时间筛选 -->
      <div class="flex gap-2">
        {#each periods as period}
          <button
            class="chip {selectedPeriod === period.value ? 'active' : ''}"
            on:click={() => handlePeriodChange(period.value)}
          >
            {period.label}
          </button>
        {/each}
      </div>
    </div>
  </div>

  <!-- 内容区 -->
  <div class="px-4 py-4">
    {#if isLoading}
      <div class="flex justify-center py-20">
        <LoadingSpinner text="加载中..." />
      </div>
    {:else if repos.length === 0}
      <EmptyIllustration type="empty" />
    {:else}
      <div class="space-y-3">
        {#each repos as repo, index}
          <a
            href={repo.url}
            target="_blank"
            rel="noopener"
            class="repo-card glass-card block overflow-hidden hover:border-white/15 transition-colors"
          >
            {#if repo.thumbnail}
              <div class="repo-image">
                <img
                  src={repo.thumbnail}
                  alt={repo.title}
                  loading="lazy"
                  class="w-full h-32 object-cover"
                  on:error={handleImageError}
                />
              </div>
            {/if}
            <div class="p-4">
              <div class="flex items-start justify-between gap-3">
                <div class="flex-1 min-w-0">
                  <div class="flex items-center gap-2 mb-1">
                    <span class="text-primary font-mono text-sm font-medium truncate">
                      {repo.title}
                    </span>
                  </div>
                  <p class="text-sm text-muted-foreground line-clamp-2 mb-3">
                    {repo.summary}
                  </p>
                  <div class="flex items-center gap-4 text-xs text-muted-foreground">
                    {#if repo.tags[0]}
                      <span class="flex items-center gap-1">
                        <span class="w-2.5 h-2.5 rounded-full bg-primary/50" />
                        {repo.tags[0]}
                      </span>
                    {/if}
                    <span class="flex items-center gap-1">
                      <Star class="w-3.5 h-3.5" />
                      {repo.tags[1] || '0 stars'}
                    </span>
                  </div>
                </div>
                <ExternalLink class="w-4 h-4 text-muted-foreground shrink-0 mt-1" />
              </div>
            </div>
          </a>
        {/each}
      </div>
    {/if}
  </div>
</div>

<style>
  .chip {
    display: inline-flex;
    align-items: center;
    padding: 6px 14px;
    border-radius: 100px;
    font-size: 13px;
    background: rgba(255, 255, 255, 0.05);
    color: rgba(255, 255, 255, 0.6);
    border: 1px solid transparent;
    cursor: pointer;
    transition: all 0.2s;
    white-space: nowrap;
  }
  .chip.active {
    background: rgba(255, 255, 255, 0.15);
    color: white;
    border-color: rgba(255, 255, 255, 0.2);
  }
  .chip:active {
    transform: scale(0.97);
  }

  .refresh-btn {
    width: 36px;
    height: 36px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: rgba(255, 255, 255, 0.7);
    background: transparent;
    border: none;
    cursor: pointer;
    transition: all 0.2s;
  }
  .refresh-btn:active {
    background: rgba(255, 255, 255, 0.1);
  }
  .refresh-btn:disabled {
    opacity: 0.5;
  }

  .repo-card {
    text-decoration: none;
    color: inherit;
  }

  .scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
</style>
