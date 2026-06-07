<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { ArrowLeft, ExternalLink, Bookmark, BookmarkCheck, Clock, User, Share2, Languages, Copy, Check, Settings, Timer } from 'lucide-svelte';
  import type { Article } from '$lib/types/news';
  import { formatRelativeTime } from '$lib/utils/date';
  import { markAsRead, toggleBookmark } from '$lib/stores/articles';
  import { settings } from '$lib/stores/settings';
  import { translateArticle } from '$lib/services/translate';
  import { saveReadingProgress, getReadingProgress } from '$lib/stores/reading';
  import { readingQueue } from '$lib/stores/queue';
  import ReadingMode from '$lib/components/reading/ReadingMode.svelte';
  import ShareDialog from '$lib/components/share/ShareDialog.svelte';

  export let article: Article;
  export let onBack: (() => void) | undefined = undefined;

  let translatedSummary = '';
  let isTranslating = false;
  let showTranslated = false;
  let copied = false;
  let scrollTimer: ReturnType<typeof setTimeout>;
  let containerEl: HTMLElement;
  let showReadingMode = false;
  let showShareDialog = false;

  $: isInQueue = $readingQueue.some(a => a.id === article.id);

  function toggleQueue() {
    if (isInQueue) {
      readingQueue.remove(article.id);
    } else {
      readingQueue.add(article);
    }
  }

  onMount(() => {
    markAsRead(article.id);

    // 恢复阅读进度
    const progress = getReadingProgress(article.id);
    if (progress && progress.scrollPosition > 100) {
      setTimeout(() => {
        window.scrollTo(0, progress.scrollPosition);
      }, 100);
    }
  });

  onDestroy(() => {
    if (scrollTimer) clearTimeout(scrollTimer);
  });

  function handleScroll() {
    clearTimeout(scrollTimer);
    scrollTimer = setTimeout(() => {
      const scrollY = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const percentage = docHeight > 0 ? Math.round((scrollY / docHeight) * 100) : 0;
      saveReadingProgress(article.id, scrollY, percentage);
    }, 500);
  }

  function handleShare() {
    if (navigator.share) {
      navigator.share({ title: article.title, url: article.url });
    } else {
      navigator.clipboard.writeText(article.url);
      copied = true;
      setTimeout(() => copied = false, 2000);
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

  function processContent(html: string): string {
    // 处理图片懒加载
    let processed = html.replace(/<img([^>]*)>/gi, (match, attrs) => {
      if (attrs.includes('loading=')) return match;
      return `<img${attrs} loading="lazy" decoding="async">`;
    });

    // 处理链接在新窗口打开
    processed = processed.replace(/<a([^>]*)href=/gi, '<a$1 target="_blank" rel="noopener" href=');

    return processed;
  }
</script>

<svelte:window on:scroll={handleScroll} />

<div class="min-h-screen bg-background" bind:this={containerEl}>
  <header class="sticky top-0 z-50 glass" style="padding-top: env(safe-area-inset-top, 0px);">
    <div class="flex items-center justify-between px-4 h-12">
      <div class="flex items-center gap-2">
        {#if onBack}
          <button class="icon-btn" on:click={onBack}>
            <ArrowLeft class="w-4 h-4" />
          </button>
        {/if}
        <span class="text-xs px-2.5 py-1 rounded-full bg-white/10 font-medium">{article.sourceName}</span>
      </div>
      <div class="flex items-center gap-1">
        <button class="icon-btn" on:click={toggleQueue}>
          <Timer class="w-4 h-4 {isInQueue ? 'text-primary' : ''}" />
        </button>
        <button class="icon-btn" on:click={() => showReadingMode = true}>
          <Settings class="w-4 h-4" />
        </button>
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
        <button class="icon-btn" on:click={() => showShareDialog = true}>
          <Share2 class="w-4 h-4" />
        </button>
        <button class="icon-btn" on:click={() => window.open(article.url, '_blank')}>
          <ExternalLink class="w-4 h-4" />
        </button>
      </div>
    </div>
  </header>

  <article class="max-w-3xl mx-auto px-4 py-6">
    <!-- 标题 -->
    <h1 class="text-2xl md:text-3xl font-bold leading-tight mb-4">{article.title}</h1>

    <!-- 元信息 -->
    <div class="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6">
      <span class="flex items-center gap-1.5">
        <User class="w-4 h-4" />
        {article.author}
      </span>
      <span class="flex items-center gap-1.5">
        <Clock class="w-4 h-4" />
        {formatRelativeTime(article.publishedAt)}
      </span>
    </div>

    <!-- 封面图 -->
    {#if article.thumbnail}
      <div class="mb-6 rounded-xl overflow-hidden bg-white/5">
        <img
          src={article.thumbnail}
          alt={article.title}
          class="w-full h-auto max-h-[500px] object-cover"
          loading="lazy"
          decoding="async"
        />
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
          <button class="text-xs text-primary mt-2 hover:underline" on:click={() => showTranslated = false}>
            显示原文
          </button>
        {/if}
      </div>
    {/if}

    <!-- 正文内容 -->
    <div class="article-content">
      {#if article.content}
        {@html processContent(article.content)}
      {:else}
        <p class="text-muted-foreground leading-relaxed">{article.summary}</p>
      {/if}
    </div>

    <div class="separator" />

    <!-- 底部操作 -->
    <div class="flex flex-col items-center gap-4 py-8">
      <button class="primary-btn" on:click={() => window.open(article.url, '_blank')}>
        阅读原文 <ExternalLink class="w-4 h-4 ml-2" />
      </button>
      <p class="text-xs text-muted-foreground">来源: {article.sourceName}</p>
    </div>
  </article>
</div>

<ReadingMode bind:open={showReadingMode} />

<ShareDialog bind:open={showShareDialog} {article} />

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
    padding: 12px 28px;
    border-radius: 100px;
    background: rgba(255, 255, 255, 0.12);
    color: white;
    font-size: 14px;
    font-weight: 500;
    border: none;
    cursor: pointer;
    transition: all 0.2s;
  }
  .primary-btn:active {
    background: rgba(255, 255, 255, 0.2);
    transform: scale(0.98);
  }

  /* 文章内容样式 */
  :global(.article-content) {
    line-height: 1.8;
    color: rgba(255, 255, 255, 0.9);
    word-break: break-word;
    font-size: 16px;
  }

  :global(.article-content img) {
    max-width: 100%;
    height: auto;
    border-radius: 12px;
    margin: 20px 0;
    background: rgba(255, 255, 255, 0.05);
  }

  :global(.article-content a) {
    color: rgba(255, 255, 255, 0.9);
    text-decoration: underline;
    text-underline-offset: 4px;
    transition: color 0.2s;
  }
  :global(.article-content a:hover) {
    color: white;
  }

  :global(.article-content pre) {
    background: rgba(0, 0, 0, 0.3);
    border: 1px solid rgba(255, 255, 255, 0.1);
    padding: 16px;
    border-radius: 12px;
    overflow-x: auto;
    font-size: 13px;
    line-height: 1.6;
    margin: 20px 0;
  }

  :global(.article-content code) {
    background: rgba(255, 255, 255, 0.08);
    padding: 2px 6px;
    border-radius: 4px;
    font-size: 0.9em;
    font-family: 'SF Mono', 'Fira Code', monospace;
  }

  :global(.article-content pre code) {
    background: transparent;
    padding: 0;
    font-size: 13px;
  }

  :global(.article-content blockquote) {
    border-left: 3px solid rgba(255, 255, 255, 0.3);
    padding: 12px 16px;
    margin: 20px 0;
    background: rgba(255, 255, 255, 0.03);
    border-radius: 0 8px 8px 0;
    color: rgba(255, 255, 255, 0.7);
  }

  :global(.article-content h1) {
    font-size: 1.8em;
    font-weight: 700;
    margin: 32px 0 16px;
  }

  :global(.article-content h2) {
    font-size: 1.5em;
    font-weight: 600;
    margin: 28px 0 12px;
  }

  :global(.article-content h3) {
    font-size: 1.25em;
    font-weight: 600;
    margin: 24px 0 12px;
  }

  :global(.article-content h4) {
    font-size: 1.1em;
    font-weight: 600;
    margin: 20px 0 8px;
  }

  :global(.article-content p) {
    margin-bottom: 16px;
  }

  :global(.article-content ul, .article-content ol) {
    padding-left: 24px;
    margin: 16px 0;
  }

  :global(.article-content li) {
    margin-bottom: 8px;
  }

  :global(.article-content table) {
    width: 100%;
    border-collapse: collapse;
    margin: 20px 0;
    font-size: 14px;
  }

  :global(.article-content th, .article-content td) {
    border: 1px solid rgba(255, 255, 255, 0.1);
    padding: 10px 12px;
    text-align: left;
  }

  :global(.article-content th) {
    background: rgba(255, 255, 255, 0.05);
    font-weight: 600;
  }

  :global(.article-content tr:hover) {
    background: rgba(255, 255, 255, 0.02);
  }

  :global(.article-content hr) {
    border: none;
    height: 1px;
    background: rgba(255, 255, 255, 0.1);
    margin: 24px 0;
  }

  :global(.article-content figure) {
    margin: 20px 0;
    text-align: center;
  }

  :global(.article-content figcaption) {
    font-size: 13px;
    color: rgba(255, 255, 255, 0.5);
    margin-top: 8px;
  }

  :global(.article-content strong, .article-content b) {
    font-weight: 600;
    color: white;
  }

  :global(.article-content em, .article-content i) {
    font-style: italic;
  }
</style>
