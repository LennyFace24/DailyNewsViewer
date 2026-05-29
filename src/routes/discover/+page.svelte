<script lang="ts">
  import { Plus, Trash2, X } from 'lucide-svelte';
  import { Button } from '$lib/components/ui/button/index.js';
  import { Badge } from '$lib/components/ui/badge/index.js';
  import { Switch } from '$lib/components/ui/switch/index.js';
  import {
    allSources, enabledSourceIds, toggleSource,
    addCustomSource, removeCustomSource
  } from '$lib/stores/sources';
  import { ContentCategory, CATEGORY_LABELS } from '$lib/types/source';

  let showAddForm = false;
  let newName = '';
  let newUrl = '';
  let newDesc = '';

  $: enabledIds = $enabledSourceIds;
  $: customSources = $allSources.filter(s => s.category === ContentCategory.CUSTOM);

  function isEnabled(id: string) {
    return enabledIds.has(id);
  }

  function handleAdd() {
    if (newName && newUrl) {
      addCustomSource(newName, newUrl, newDesc);
      newName = '';
      newUrl = '';
      newDesc = '';
      showAddForm = false;
    }
  }

  function handleRemove(id: string) {
    if (confirm('确定删除？')) {
      removeCustomSource(id);
    }
  }

  // 按板块分组
  function getSourcesByCategory(cat: ContentCategory) {
    return $allSources.filter(s => s.category === cat && s.category !== ContentCategory.CUSTOM);
  }
</script>

<div class="min-h-screen bg-background pb-20">
  <div class="px-4 py-6">
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold">数据源</h1>
        <p class="text-sm text-muted-foreground">按板块管理内容源</p>
      </div>
      <Button size="sm" on:click={() => showAddForm = !showAddForm}>
        {#if showAddForm}
          <X class="w-4 h-4" />
        {:else}
          <Plus class="w-4 h-4 mr-1" /> 添加
        {/if}
      </Button>
    </div>

    <!-- 添加表单 -->
    {#if showAddForm}
      <div class="bg-card border rounded-xl p-4 mb-6">
        <h3 class="font-medium mb-3">添加自定义 RSS 源</h3>
        <div class="space-y-3">
          <input bind:value={newName} placeholder="名称" class="w-full bg-muted rounded-lg px-3 py-2 text-sm" />
          <input bind:value={newUrl} placeholder="RSS URL" class="w-full bg-muted rounded-lg px-3 py-2 text-sm" />
          <input bind:value={newDesc} placeholder="描述（可选）" class="w-full bg-muted rounded-lg px-3 py-2 text-sm" />
          <Button class="w-full" on:click={handleAdd}>添加</Button>
        </div>
      </div>
    {/if}

    <!-- 自定义源 -->
    {#if customSources.length > 0}
      <section class="mb-6">
        <h2 class="text-sm font-medium text-muted-foreground mb-3">⭐ 自定义</h2>
        <div class="space-y-2">
          {#each customSources as source}
            <div class="flex items-center gap-3 p-3 bg-card border rounded-xl">
              <Switch checked={isEnabled(source.id)} on:click={() => toggleSource(source.id)} />
              <div class="flex-1 min-w-0">
                <div class="font-medium text-sm truncate">{source.name}</div>
                <div class="text-xs text-muted-foreground truncate">{source.url}</div>
              </div>
              <Button variant="ghost" size="icon" class="h-8 w-8 text-destructive" on:click={() => handleRemove(source.id)}>
                <Trash2 class="w-4 h-4" />
              </Button>
            </div>
          {/each}
        </div>
      </section>
    {/if}

    <!-- 按板块显示预设源 -->
    {#each Object.values(ContentCategory) as cat}
      {#if cat !== ContentCategory.CUSTOM}
        {@const sources = getSourcesByCategory(cat)}
        {#if sources.length > 0}
          <section class="mb-6">
            <div class="flex items-center gap-2 mb-3">
              <h2 class="text-sm font-medium text-muted-foreground">{CATEGORY_LABELS[cat]}</h2>
              <Badge variant="outline" class="ml-auto text-xs">
                {sources.filter(s => isEnabled(s.id)).length}/{sources.length}
              </Badge>
            </div>
            <div class="space-y-2">
              {#each sources as source}
                <div class="flex items-center gap-3 p-3 bg-card border rounded-xl">
                  <Switch checked={isEnabled(source.id)} on:click={() => toggleSource(source.id)} />
                  <div class="flex-1 min-w-0">
                    <div class="font-medium text-sm">{source.name}</div>
                    <div class="text-xs text-muted-foreground">{source.description}</div>
                  </div>
                  {#if source.quality === 'high'}
                    <Badge variant="secondary" class="text-[10px]">高质量</Badge>
                  {/if}
                </div>
              {/each}
            </div>
          </section>
        {/if}
      {/if}
    {/each}
  </div>
</div>
