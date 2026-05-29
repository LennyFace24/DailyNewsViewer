<script lang="ts">
  import { goto } from '$app/navigation';
  import { Bookmark, BookmarkCheck, Clock, User } from 'lucide-svelte';
  import * as Card from '$lib/components/ui/card/index.js';
  import { Badge } from '$lib/components/ui/badge/index.js';
  import { Button } from '$lib/components/ui/button/index.js';
  import type { Article } from '$lib/types/news';
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

  function handleClick() {
    goto(`/article/${encodeURIComponent(article.id)}`);
  }

  function handleBookmark(e: Event) {
    e.stopPropagation();
    toggleBookmark(article.id);
  }
</script>

<article
  on:click={handleClick}
  class="masonry-item group cursor-pointer"
>
  <Card.Root class="overflow-hidden transition-all duration-200 hover:shadow-lg active:scale-[0.98] {article.isRead ? 'opacity-70' : ''}">
    <!-- 图片区 -->
    {#if article.thumbnail && $settings.showImages && !imageError}
      <div class="relative overflow-hidden {isCompact ? 'h-32' : isSpacious ? 'h-56' : 'h-44'}">
        {#if !imageLoaded}
          <div class="absolute inset-0 bg-muted animate-pulse" />
        {/if}
        <img
          src={article.thumbnail}
          alt={article.title}
          loading="lazy"
          on:load={() => imageLoaded = true}
          on:error={() => imageError = true}
          class="w-full h-full object-cover {imageLoaded ? '' : 'opacity-0'}"
        />
        <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

        <div class="absolute top-3 left-3">
          <Badge variant="secondary" class="bg-black/50 text-white border-0 text-xs">
            {article.sourceName}
          </Badge>
        </div>

        <button
          class="absolute top-3 right-3 p-1.5 rounded-full bg-black/50 text-white hover:bg-black/70"
          on:click={handleBookmark}
        >
          {#if article.isBookmarked}
            <BookmarkCheck class="h-4 w-4 text-primary" />
          {:else}
            <Bookmark class="h-4 w-4" />
          {/if}
        </button>
      </div>
    {/if}

    <Card.Content class="{isCompact ? 'p-3' : isSpacious ? 'p-5' : 'p-4'}">
      {#if !article.thumbnail || !$settings.showImages || imageError}
        <div class="flex items-center justify-between mb-3">
          <Badge variant="secondary" class="text-xs">{article.sourceName}</Badge>
          <button class="p-1" on:click={handleBookmark}>
            {#if article.isBookmarked}
              <BookmarkCheck class="h-4 w-4 text-primary" />
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
          <Badge variant="outline" class="text-[10px] py-0">已读</Badge>
        {/if}
      </div>
    </Card.Content>
  </Card.Root>
</article>
