<script lang="ts">
  import type { ArticleGroup } from '$lib/types/news';
  import { Separator } from '$lib/components/ui/separator/index.js';
  import NewsCard from './NewsCard.svelte';

  export let groups: ArticleGroup[];
</script>

<div class="space-y-6">
  {#each groups as group, groupIndex}
    <section>
      <div class="flex items-center gap-3 mb-4">
        <Separator class="flex-1" />
        <h2 class="text-sm font-medium text-muted-foreground shrink-0">
          {group.date}
        </h2>
        <Separator class="flex-1" />
      </div>

      <div class="masonry-grid">
        {#each group.articles as article, index (article.id)}
          <NewsCard {article} index={groupIndex * 10 + index} />
        {/each}
      </div>
    </section>
  {/each}
</div>
