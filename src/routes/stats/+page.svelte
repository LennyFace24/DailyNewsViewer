<script lang="ts">
  import { goto } from '$app/navigation';
  import { ArrowLeft, BookOpen, Clock, TrendingUp, Calendar } from 'lucide-svelte';
  import { readingStats, loadReadingProgress } from '$lib/stores/reading';
  import { articles } from '$lib/stores/articles';
  import ReadingChart from '$lib/components/stats/ReadingChart.svelte';
  import { onMount } from 'svelte';

  $: totalArticles = $articles.length;
  $: readArticles = $articles.filter(a => a.isRead).length;
  $: bookmarkedArticles = $articles.filter(a => a.isBookmarked).length;
  $: readPercentage = totalArticles > 0 ? Math.round((readArticles / totalArticles) * 100) : 0;

  // 模拟每周数据
  const weeklyData = [
    { date: '一', count: 12 },
    { date: '二', count: 8 },
    { date: '三', count: 15 },
    { date: '四', count: 6 },
    { date: '五', count: 20 },
    { date: '六', count: 25 },
    { date: '日', count: 18 }
  ];

  onMount(() => {
    loadReadingProgress();
  });
</script>

<div class="min-h-screen pb-20">
  <!-- 顶部栏 -->
  <div class="sticky top-0 z-40 glass" style="padding-top: env(safe-area-inset-top, 0px);">
    <div class="flex items-center gap-3 px-4 h-14">
      <button class="back-btn" on:click={() => goto('/settings')}>
        <ArrowLeft class="w-5 h-5" />
      </button>
      <div class="flex items-center gap-2">
        <TrendingUp class="w-5 h-5" />
        <span class="font-medium">阅读统计</span>
      </div>
    </div>
  </div>

  <div class="px-4 py-6">
    <!-- 总览卡片 -->
    <div class="stats-overview">
      <div class="stat-card">
        <div class="stat-icon">
          <BookOpen class="w-5 h-5" />
        </div>
        <div class="stat-info">
          <div class="stat-value">{$readingStats.totalCount}</div>
          <div class="stat-label">总阅读</div>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon">
          <Calendar class="w-5 h-5" />
        </div>
        <div class="stat-info">
          <div class="stat-value">{$readingStats.weekCount}</div>
          <div class="stat-label">本周</div>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon">
          <Clock class="w-5 h-5" />
        </div>
        <div class="stat-info">
          <div class="stat-value">{$readingStats.todayCount}</div>
          <div class="stat-label">今日</div>
        </div>
      </div>
    </div>

    <!-- 阅读进度 -->
    <section class="mb-6">
      <h2 class="section-title">阅读进度</h2>
      <div class="progress-card">
        <div class="progress-header">
          <span class="text-sm">已读文章</span>
          <span class="text-sm text-muted-foreground">{readArticles}/{totalArticles}</span>
        </div>
        <div class="progress-bar">
          <div class="progress-fill" style="width: {readPercentage}%" />
        </div>
        <div class="progress-footer">
          <span class="text-xs text-muted-foreground">{readPercentage}% 完成</span>
          <span class="text-xs text-muted-foreground">{bookmarkedArticles} 篇收藏</span>
        </div>
      </div>
    </section>

    <!-- 每周趋势 -->
    <section class="mb-6">
      <h2 class="section-title">每周趋势</h2>
      <ReadingChart data={weeklyData} />
    </section>

    <!-- 来源分布 -->
    <section>
      <h2 class="section-title">来源分布</h2>
      <div class="source-list">
        {#each getTopSources() as source}
          <div class="source-item">
            <div class="source-name">{source.name}</div>
            <div class="source-bar">
              <div class="source-fill" style="width: {source.percentage}%" />
            </div>
            <div class="source-count">{source.count}</div>
          </div>
        {/each}
      </div>
    </section>
  </div>
</div>

<script context="module" lang="ts">
  function getTopSources() {
    // 这里需要从store获取数据，简化处理
    return [
      { name: 'Hacker News', count: 45, percentage: 100 },
      { name: 'TechCrunch', count: 32, percentage: 71 },
      { name: 'The Verge', count: 28, percentage: 62 },
      { name: 'Ars Technica', count: 20, percentage: 44 },
      { name: 'GitHub Blog', count: 15, percentage: 33 }
    ];
  }
</script>

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

  .section-title {
    font-size: 12px;
    font-weight: 500;
    color: rgba(255, 255, 255, 0.4);
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin-bottom: 12px;
  }

  .stats-overview {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 12px;
    margin-bottom: 24px;
  }

  .stat-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    padding: 20px 16px;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 16px;
  }

  .stat-icon {
    width: 40px;
    height: 40px;
    border-radius: 12px;
    background: rgba(255, 255, 255, 0.08);
    display: flex;
    align-items: center;
    justify-content: center;
    color: rgba(255, 255, 255, 0.6);
  }

  .stat-info {
    text-align: center;
  }

  .stat-value {
    font-size: 28px;
    font-weight: 700;
    color: white;
    line-height: 1;
    margin-bottom: 4px;
  }

  .stat-label {
    font-size: 12px;
    color: rgba(255, 255, 255, 0.4);
  }

  .progress-card {
    padding: 16px;
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.05);
    border-radius: 12px;
  }

  .progress-header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 12px;
  }

  .progress-bar {
    height: 8px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 4px;
    overflow: hidden;
    margin-bottom: 8px;
  }

  .progress-fill {
    height: 100%;
    background: linear-gradient(90deg, rgba(255, 255, 255, 0.6), rgba(255, 255, 255, 0.9));
    border-radius: 4px;
    transition: width 0.5s ease;
  }

  .progress-footer {
    display: flex;
    justify-content: space-between;
  }

  .source-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .source-item {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .source-name {
    width: 100px;
    font-size: 13px;
    color: rgba(255, 255, 255, 0.7);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .source-bar {
    flex: 1;
    height: 6px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 3px;
    overflow: hidden;
  }

  .source-fill {
    height: 100%;
    background: rgba(255, 255, 255, 0.5);
    border-radius: 3px;
  }

  .source-count {
    width: 30px;
    text-align: right;
    font-size: 13px;
    color: rgba(255, 255, 255, 0.5);
  }
</style>
