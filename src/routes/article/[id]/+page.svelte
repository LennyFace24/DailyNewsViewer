<script lang="ts">
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import { articles } from '$lib/stores/articles';
  import ArticleDetail from '$lib/components/news/ArticleDetail.svelte';
  import EmptyState from '$lib/components/shared/EmptyState.svelte';

  $: articleId = $page.params.id;
  $: article = $articles.find(a => a.id === articleId);

  function handleBack() {
    goto('/');
  }
</script>

{#if article}
  <ArticleDetail {article} onBack={handleBack} />
{:else}
  <div class="min-h-screen bg-background flex items-center justify-center">
    <EmptyState
      icon="🔍"
      title="文章未找到"
      description="该文章可能已被清除或不存在"
      actionLabel="返回首页"
      onAction={handleBack}
    />
  </div>
{/if}
