<script lang="ts">
  import { Filter, ArrowUpDown, Eye, EyeOff, Bookmark } from 'lucide-svelte';
  import * as Sheet from '$lib/components/ui/sheet/index.js';
  import { Button } from '$lib/components/ui/button/index.js';
  import { Badge } from '$lib/components/ui/badge/index.js';
  import { Separator } from '$lib/components/ui/separator/index.js';
  import { filter } from '$lib/stores/articles';
  import { enabledSources } from '$lib/stores/sources';

  export let open = false;

  function setSortBy(sort: 'newest' | 'oldest') {
    filter.update(f => ({ ...f, sortBy: sort }));
  }

  function toggleReadFilter() {
    filter.update(f => ({
      ...f,
      isRead: f.isRead === undefined ? true : f.isRead ? false : undefined
    }));
  }

  function toggleBookmarkFilter() {
    filter.update(f => ({
      ...f,
      isBookmarked: !f.isBookmarked
    }));
  }

  function selectSource(sourceId: string | undefined) {
    filter.update(f => ({ ...f, sourceId }));
  }
</script>

<Sheet.Root bind:open>
  <Sheet.Content side="bottom" class="h-[80vh] rounded-t-3xl">
    <Sheet.Header>
      <Sheet.Title class="flex items-center gap-2">
        <Filter class="w-5 h-5" />
        筛选
      </Sheet.Title>
    </Sheet.Header>

    <div class="mt-6 space-y-6 overflow-auto px-1">
      <!-- 排序 -->
      <div>
        <h4 class="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
          <ArrowUpDown class="w-4 h-4" />
          排序方式
        </h4>
        <div class="flex gap-2">
          <Button
            variant={$filter.sortBy === 'newest' ? 'default' : 'outline'}
            size="sm"
            on:click={() => setSortBy('newest')}
          >
            最新
          </Button>
          <Button
            variant={$filter.sortBy === 'oldest' ? 'default' : 'outline'}
            size="sm"
            on:click={() => setSortBy('oldest')}
          >
            最早
          </Button>
        </div>
      </div>

      <Separator />

      <!-- 状态过滤 -->
      <div>
        <h4 class="text-sm font-medium text-muted-foreground mb-3">状态</h4>
        <div class="flex flex-wrap gap-2">
          <Button
            variant={$filter.isRead === true ? 'default' : 'outline'}
            size="sm"
            on:click={toggleReadFilter}
          >
            <Eye class="w-4 h-4 mr-2" />
            已读
          </Button>
          <Button
            variant={$filter.isRead === false ? 'default' : 'outline'}
            size="sm"
            on:click={toggleReadFilter}
          >
            <EyeOff class="w-4 h-4 mr-2" />
            未读
          </Button>
          <Button
            variant={$filter.isBookmarked ? 'default' : 'outline'}
            size="sm"
            on:click={toggleBookmarkFilter}
          >
            <Bookmark class="w-4 h-4 mr-2" />
            收藏
          </Button>
        </div>
      </div>

      <Separator />

      <!-- 来源过滤 -->
      <div>
        <h4 class="text-sm font-medium text-muted-foreground mb-3">来源</h4>
        <div class="flex flex-wrap gap-2">
          <Button
            variant={!$filter.sourceId ? 'default' : 'outline'}
            size="sm"
            on:click={() => selectSource(undefined)}
          >
            全部
          </Button>
          {#each $enabledSources as source}
            <Button
              variant={$filter.sourceId === source.id ? 'default' : 'outline'}
              size="sm"
              on:click={() => selectSource(source.id)}
            >
              {source.name}
            </Button>
          {/each}
        </div>
      </div>
    </div>
  </Sheet.Content>
</Sheet.Root>
