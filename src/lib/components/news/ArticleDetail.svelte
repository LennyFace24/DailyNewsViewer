<script lang="ts">
  import { onMount } from 'svelte';
  import { ArrowLeft, ExternalLink, Bookmark, BookmarkCheck, Clock, User, Share2 } from 'lucide-svelte';
  import { Button } from '$lib/components/ui/button/index.js';
  import { Badge } from '$lib/components/ui/badge/index.js';
  import { Separator } from '$lib/components/ui/separator/index.js';
  import type { Article } from '$lib/types/news';
  import { formatRelativeTime } from '$lib/utils/date';
  import { markAsRead, toggleBookmark } from '$lib/stores/articles';

  export let article: Article;
  export let onBack: (() => void) | undefined = undefined;

  onMount(() => {
    markAsRead(article.id);
  });

  function handleShare() {
    if (navigator.share) {
      navigator.share({ title: article.title, url: article.url });
    } else {
      navigator.clipboard.writeText(article.url);
    }
  }
</script>

<div class="min-h-screen bg-background">
  <header class="sticky top-0 z-50 bg-background/90 backdrop-blur-xl border-b safe-area-top">
    <div class="flex items-center justify-between px-4 h-12">
      <div class="flex items-center gap-2">
        {#if onBack}
          <Button variant="ghost" size="icon" class="h-8 w-8" on:click={onBack}>
            <ArrowLeft class="w-4 h-4" />
          </Button>
        {/if}
        <Badge variant="secondary" class="text-xs">{article.sourceName}</Badge>
      </div>
      <div class="flex items-center gap-1">
        <Button variant="ghost" size="icon" class="h-8 w-8" on:click={() => toggleBookmark(article.id)}>
          {#if article.isBookmarked}
            <BookmarkCheck class="w-4 h-4 text-primary" />
          {:else}
            <Bookmark class="w-4 h-4" />
          {/if}
        </Button>
        <Button variant="ghost" size="icon" class="h-8 w-8" on:click={handleShare}>
          <Share2 class="w-4 h-4" />
        </Button>
        <Button variant="ghost" size="icon" class="h-8 w-8" on:click={() => window.open(article.url, '_blank')}>
          <ExternalLink class="w-4 h-4" />
        </Button>
      </div>
    </div>
  </header>

  <article class="max-w-3xl mx-auto px-4 py-6">
    <h1 class="text-2xl font-bold leading-tight mb-4">{article.title}</h1>

    <div class="flex items-center gap-4 text-sm text-muted-foreground mb-6">
      <span class="flex items-center gap-1"><User class="w-4 h-4" />{article.author}</span>
      <span class="flex items-center gap-1"><Clock class="w-4 h-4" />{formatRelativeTime(article.publishedAt)}</span>
    </div>

    {#if article.thumbnail}
      <div class="mb-6 rounded-xl overflow-hidden">
        <img src={article.thumbnail} alt={article.title} class="w-full h-auto" />
      </div>
    {/if}

    <Separator class="mb-6" />

    <!-- 完整内容 -->
    <div class="article-content">
      {#if article.content}
        {@html article.content}
      {:else}
        <p>{article.summary}</p>
      {/if}
    </div>

    <Separator class="my-8" />

    <div class="flex justify-center pb-8">
      <Button on:click={() => window.open(article.url, '_blank')}>
        阅读原文 <ExternalLink class="w-4 h-4 ml-2" />
      </Button>
    </div>
  </article>
</div>

<style>
  :global(.article-content) {
    line-height: 1.8;
    color: hsl(var(--foreground));
    word-break: break-word;
  }
  :global(.article-content img) {
    max-width: 100%;
    height: auto;
    border-radius: 0.75rem;
    margin: 1rem 0;
  }
  :global(.article-content a) {
    color: hsl(var(--primary));
    text-decoration: underline;
  }
  :global(.article-content pre) {
    background: hsl(var(--muted));
    padding: 1rem;
    border-radius: 0.5rem;
    overflow-x: auto;
    font-size: 0.875rem;
    margin: 1rem 0;
  }
  :global(.article-content code) {
    background: hsl(var(--muted));
    padding: 0.125rem 0.375rem;
    border-radius: 0.25rem;
    font-size: 0.875rem;
  }
  :global(.article-content pre code) {
    background: transparent;
    padding: 0;
  }
  :global(.article-content blockquote) {
    border-left: 3px solid hsl(var(--primary));
    padding-left: 1rem;
    margin: 1rem 0;
    color: hsl(var(--muted-foreground));
  }
  :global(.article-content h2, .article-content h3, .article-content h4) {
    font-weight: 600;
    margin: 1.5em 0 0.5em;
  }
  :global(.article-content p) {
    margin-bottom: 1em;
  }
  :global(.article-content ul, .article-content ol) {
    padding-left: 1.5em;
    margin-bottom: 1em;
  }
  :global(.article-content li) {
    margin-bottom: 0.5em;
  }
  :global(.article-content table) {
    width: 100%;
    border-collapse: collapse;
    margin: 1rem 0;
  }
  :global(.article-content th, .article-content td) {
    border: 1px solid hsl(var(--border));
    padding: 0.5rem;
    text-align: left;
  }
  :global(.article-content th) {
    background: hsl(var(--muted));
  }
</style>
