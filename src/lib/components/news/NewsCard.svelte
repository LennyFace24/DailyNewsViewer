<script lang="ts">
  import { goto } from '$app/navigation';
  import { Bookmark, BookmarkCheck, Clock, User } from 'lucide-svelte';
  import type { Article } from '$lib/types/news';
  import { ContentTag, TAG_INFO } from '$lib/types/source';
  import { classifyArticle } from '$lib/services/classifier';
  import { formatRelativeTime } from '$lib/utils/date';
  import { truncateText } from '$lib/utils/text';
  import { toggleBookmark } from '$lib/stores/articles';
  import { settings } from '$lib/stores/settings';

  export let article: Article;
  export let index: number = 0;

  let imageLoaded = false;
  let imageError = false;

  $: isCompact = $settings.cardStyle === 'compact';
  $: isSpacious = $settings.cardStyle === 'spacious';
  $: tag = classifyArticle(article);

  function handleClick() {
    goto(`/article/${encodeURIComponent(article.id)}`);
  }

  function handleBookmark(e: Event) {
    e.stopPropagation();
    toggleBookmark(article.id);
  }
</script>

<article on:click={handleClick} class="masonry-item group cursor-pointer">
  <div class="glass-card overflow-hidden transition-all duration-200 hover:border-white/15 active:scale-[0.98] {article.isRead ? 'opacity-60' : ''}">
    <!-- 图片区 -->
    {#if article.thumbnail && $settings.showImages && !imageError}
      <div class="relative overflow-hidden {isCompact ? 'h-32' : isSpacious ? 'h-56' : 'h-44'}">
        {#if !imageLoaded}
          <div class="absolute inset-0 bg-white/5 animate-pulse" />
        {/if}
        <img
          src={article.thumbnail}
          alt={article.title}
          loading="lazy"
          on:load={() => imageLoaded = true}
          on:error={() => imageError = true}
          class="w-full h-full object-cover {imageLoaded ? '' : 'opacity-0'}"
        />
        <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        <!-- 标签 -->
        <div class="absolute top-3 left-3">
          <span class="px-2.5 py-1 rounded-full text-xs font-medium bg-black/40 backdrop-blur-md border border-white/10">
            {TAG_INFO[tag].icon} {TAG_INFO[tag].label}
          </span>
        </div>

        <!-- 收藏 -->
        <button
          class="absolute top-3 right-3 p-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-white hover:bg-black/60 transition-colors"
          on:click={handleBookmark}
        >
          {#if article.isBookmarked}
            <BookmarkCheck class="w-4 h-4 text-accent" />
          {:else}
            <Bookmark class="w-4 h-4" />
          {/if}
        </button>
      </div>
    {/if}

    <div class="p-4 {isCompact ? 'p-3' : isSpacious ? 'p-5' : 'p-4'}">
      {#if !article.thumbnail || !$settings.showImages || imageError}
        <div class="flex items-center justify-between mb-3">
          <span class="px-2.5 py-1 rounded-full text-xs font-medium bg-white/5 border border-white/10">
            {TAG_INFO[tag].icon} {TAG_INFO[tag].label}
          </span>
          <button class="p-1 rounded-full hover:bg-white/5 transition-colors" on:click={handleBookmark}>
            {#if article.isBookmarked}
              <BookmarkCheck class="h-4 w-4 text-accent" />
            {:else}
              <Bookmark class="h-4 w-4 text-muted-foreground" />
            {/if}
          </button>
        </div>
      {/if}

      <h3 class="font-semibold text-foreground mb-2 leading-snug
                 {isCompact ? 'text-sm line-clamp-2' : isSpacious ? 'text-lg line-clamp-3' : 'text-base line-clamp-2'}">
        {article.title}
      </h3>

      <p class="text-muted-foreground text-sm mb-3
                {isCompact ? 'line-clamp-2' : isSpacious ? 'line-clamp-4' : 'line-clamp-3'}">
        {truncateText(article.summary, isCompact ? 60 : isSpacious ? 120 : 80)}
      </p>

      <div class="flex items-center justify-between text-xs text-muted-foreground">
        <div class="flex items-center gap-3">
          <span class="flex items-center gap-1">
            <User class="w-3 h-3" />
            {truncateText(article.author, 12)}
          </span>
          <span class="flex items-center gap-1">
            <Clock class="w-3 h-3" />
            {formatRelativeTime(article.publishedAt)}
          </span>
        </div>
        {#if article.isRead}
          <span class="text-xs text-muted-foreground/50">已读</span>
        {/if}
      </div>
    </div>
  </div>
</article>
