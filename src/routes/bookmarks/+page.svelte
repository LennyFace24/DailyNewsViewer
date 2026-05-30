<script lang="ts">
  import { Bookmark } from 'lucide-svelte';
  import { articles } from '$lib/stores/articles';
  import NewsCard from '$lib/components/news/NewsCard.svelte';
  import EmptyState from '$lib/components/shared/EmptyState.svelte';

  $: bookmarkedArticles = $articles.filter(a => a.isBookmarked);
</script>

<div class="min-h-screen pb-20">
  <div class="px-4 py-6">
    <div class="flex items-center gap-3 mb-6">
      <div class="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
        <Bookmark class="w-5 h-5" />
      </div>
      <div>
        <h1 class="text-2xl font-bold">收藏夹</h1>
        <p class="text-sm text-muted-foreground">永久保存的内容</p>
      </div>
    </div>

    {#if bookmarkedArticles.length === 0}
      <EmptyState
        icon="bookmark"
        title="暂无收藏"
        description="点击文章卡片上的收藏按钮，内容将永久保存"
      />
    {:else}
      <div class="masonry-grid">
        {#each bookmarkedArticles as article, index (article.id)}
          <NewsCard {article} {index} />
        {/each}
      </div>
    {/if}
  </div>
</div>
