<script lang="ts">
  import { onMount } from 'svelte';
  import { Sparkles } from 'lucide-svelte';
  import { articles } from '$lib/stores/articles';
  import { recommendArticles } from '$lib/services/recommender';
  import type { Article } from '$lib/types/news';
  import NewsCard from '$lib/components/news/NewsCard.svelte';

  let recommended: Article[] = [];
  let isLoading = true;

  $: if ($articles.length > 0) {
    loadRecommendations();
  }

  function loadRecommendations() {
    isLoading = true;
    recommended = recommendArticles($articles, {
      maxResults: 6,
      excludeRead: true
    });
    isLoading = false;
  }
</script>

{#if recommended.length > 0}
  <section class="recommend-section">
    <div class="section-header">
      <div class="flex items-center gap-2">
        <Sparkles class="w-4 h-4 text-primary" />
        <h2 class="section-title">推荐阅读</h2>
      </div>
    </div>

    <div class="recommend-grid">
      {#each recommended as article, index (article.id)}
        <NewsCard {article} {index} />
      {/each}
    </div>
  </section>
{/if}

<style>
  .recommend-section {
    margin-bottom: 24px;
  }

  .section-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 12px;
    padding: 0 4px;
  }

  .section-title {
    font-size: 16px;
    font-weight: 600;
    color: white;
  }

  .recommend-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }

  @media (max-width: 640px) {
    .recommend-grid {
      grid-template-columns: 1fr;
    }
  }
</style>
