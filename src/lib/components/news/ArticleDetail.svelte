<script lang="ts">
  import { onMount } from 'svelte';
  import { ArrowLeft, ExternalLink, Bookmark, BookmarkCheck, Clock, User, Share2, Languages } from 'lucide-svelte';
  import type { Article } from '$lib/types/news';
  import { formatRelativeTime } from '$lib/utils/date';
  import { markAsRead, toggleBookmark } from '$lib/stores/articles';
  import { settings } from '$lib/stores/settings';
  import { translateArticle } from '$lib/services/translate';

  export let article: Article;
  export let onBack: (() => void) | undefined = undefined;

  let translatedSummary = '';
  let isTranslating = false;
  let showTranslated = false;

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

  async function handleTranslate() {
    if (showTranslated) {
      showTranslated = false;
      return;
    }

    if (translatedSummary) {
      showTranslated = true;
      return;
    }

    if (!$settings.aiTranslateEnabled) return;

    isTranslating = true;
    try {
      translatedSummary = await translateArticle(article.summary);
      showTranslated = true;
    } catch (error) {
      console.error('Translation failed:', error);
    } finally {
      isTranslating = false;
    }
  }
</script>

<div class="min-h-screen bg-background">
  <header class="sticky top-0 z-50 glass" style="padding-top: env(safe-area-inset-top, 0px);">
    <div class="flex items-center justify-between px-4 h-12">
      <div class="flex items-center gap-2">
        {#if onBack}
          <button class="icon-btn" on:click={onBack}>
            <ArrowLeft class="w-4 h-4" />
          </button>
        {/if}
        <span class="text-xs px-2 py-1 rounded-full bg-white/10">{article.sourceName}</span>
      </div>
      <div class="flex items-center gap-1">
        {#if $settings.aiTranslateEnabled}
          <button class="icon-btn" on:click={handleTranslate} disabled={isTranslating}>
            <Languages class="w-4 h-4 {isTranslating ? 'animate-pulse' : ''} {showTranslated ? 'text-primary' : ''}" />
          </button>
        {/if}
        <button class="icon-btn" on:click={() => toggleBookmark(article.id)}>
          {#if article.isBookmarked}
            <BookmarkCheck class="w-4 h-4 text-primary" />
          {:else}
            <Bookmark class="w-4 h-4" />
          {/if}
        </button>
        <button class="icon-btn" on:click={handleShare}>
          <Share2 class="w-4 h-4" />
        </button>
        <button class="icon-btn" on:click={() => window.open(article.url, '_blank')}>
          <ExternalLink class="w-4 h-4" />
        </button>
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
        <img src={article.thumbnail} alt={article.title} class="w-full h-auto" loading="lazy" />
      </div>
    {/if}

    <div class="separator" />

    <!-- 摘要 -->
    {#if article.summary}
      <div class="mb-6 p-4 rounded-xl bg-white/5 border border-white/5">
        <p class="text-muted-foreground leading-relaxed text-sm">
          {showTranslated ? translatedSummary : article.summary}
        </p>
        {#if showTranslated}
          <button class="text-xs text-primary mt-2" on:click={() => showTranslated = false}>
            显示原文
          </button>
        {/if}
      </div>
    {/if}

    <!-- 正文 -->
    <div class="article-content">
      {#if article.content}
        {@html article.content}
      {:else}
        <p class="text-muted-foreground">{article.summary}</p>
      {/if}
    </div>

    <div class="separator" />

    <div class="flex justify-center py-8">
      <button class="primary-btn" on:click={() => window.open(article.url, '_blank')}>
        阅读原文 <ExternalLink class="w-4 h-4 ml-2" />
      </button>
    </div>
  </article>
</div>

<style>
  .icon-btn {
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
  .icon-btn:active {
    background: rgba(255, 255, 255, 0.1);
    color: white;
  }
  .icon-btn:disabled {
    opacity: 0.5;
  }

  .separator {
    height: 1px;
    background: rgba(255, 255, 255, 0.06);
    margin: 24px 0;
  }

  .primary-btn {
    display: flex;
    align-items: center;
    padding: 12px 24px;
    border-radius: 100px;
    background: rgba(255, 255, 255, 0.12);
    color: white;
    font-size: 14px;
    font-weight: 500;
    border: none;
    cursor: pointer;
    transition: background 0.2s;
  }
  .primary-btn:active {
    background: rgba(255, 255, 255, 0.2);
  }

  /* 文章内容样式 */
  :global(.article-content) {
    line-height: 1.8;
    color: rgba(255, 255, 255, 0.9);
    word-break: break-word;
  }
  :global(.article-content img) {
    max-width: 100%;
    height: auto;
    border-radius: 12px;
    margin: 16px 0;
  }
  :global(.article-content a) {
    color: rgba(255, 255, 255, 0.9);
    text-decoration: underline;
    text-underline-offset: 4px;
  }
  :global(.article-content pre) {
    background: rgba(255, 255, 255, 0.05);
    padding: 16px;
    border-radius: 12px;
    overflow-x: auto;
    font-size: 13px;
    margin: 16px 0;
  }
  :global(.article-content code) {
    background: rgba(255, 255, 255, 0.05);
    padding: 2px 6px;
    border-radius: 4px;
    font-size: 13px;
  }
  :global(.article-content pre code) {
    background: transparent;
    padding: 0;
  }
  :global(.article-content blockquote) {
    border-left: 3px solid rgba(255, 255, 255, 0.2);
    padding-left: 16px;
    margin: 16px 0;
    color: rgba(255, 255, 255, 0.6);
  }
  :global(.article-content h2, .article-content h3, .article-content h4) {
    font-weight: 600;
    margin: 24px 0 12px;
  }
  :global(.article-content p) {
    margin-bottom: 16px;
  }
  :global(.article-content ul, .article-content ol) {
    padding-left: 24px;
    margin-bottom: 16px;
  }
  :global(.article-content li) {
    margin-bottom: 8px;
  }
</style>
