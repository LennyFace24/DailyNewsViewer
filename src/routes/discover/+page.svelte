<script lang="ts">
  import { Plus, Trash2, X, ExternalLink } from 'lucide-svelte';
  import { Button } from '$lib/components/ui/button/index.js';
  import { Badge } from '$lib/components/ui/badge/index.js';
  import {
    allSources, enabledSourceIds, toggleSource,
    addCustomSource, removeCustomSource
  } from '$lib/stores/sources';
  import { ContentTag, TAG_INFO } from '$lib/types/source';

  let showAddForm = false;
  let newName = '';
  let newUrl = '';
  let newDesc = '';
  let deleteTarget: string | null = null;

  $: enabledIds = $enabledSourceIds;
  $: customSources = $allSources.filter(s => !s.category || s.category === ContentTag.GENERAL);

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

  function confirmDelete() {
    if (deleteTarget) {
      removeCustomSource(deleteTarget);
      deleteTarget = null;
    }
  }
</script>

<div class="min-h-screen pb-20">
  <div class="px-4 py-6">
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold">数据源</h1>
        <p class="text-sm text-muted-foreground">管理你的信息来源</p>
      </div>
      <button
        class="w-10 h-10 rounded-xl glass flex items-center justify-center transition-transform active:scale-95"
        on:click={() => showAddForm = !showAddForm}
      >
        {#if showAddForm}
          <X class="w-5 h-5" />
        {:else}
          <Plus class="w-5 h-5" />
        {/if}
      </button>
    </div>

    <!-- 添加表单 -->
    {#if showAddForm}
      <div class="glass-card p-4 mb-6 slide-up">
        <h3 class="font-medium mb-3">添加自定义 RSS 源</h3>
        <div class="space-y-3">
          <input bind:value={newName} placeholder="名称" class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm" />
          <input bind:value={newUrl} placeholder="RSS URL" class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm" />
          <input bind:value={newDesc} placeholder="描述（可选）" class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm" />
          <Button class="w-full bg-white/10 hover:bg-white/15 border-0" on:click={handleAdd}>添加</Button>
        </div>
      </div>
    {/if}

    <!-- 自定义源 -->
    {#if customSources.length > 0}
      <section class="mb-8">
        <h2 class="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">自定义</h2>
        <div class="space-y-2">
          {#each customSources as source}
            <div class="glass-card p-4 flex items-center gap-3">
              <button
                class="w-12 h-7 rounded-full transition-colors shrink-0 {isEnabled(source.id) ? 'bg-accent' : 'bg-white/10'}"
                on:click={() => toggleSource(source.id)}
              >
                <div class="w-5 h-5 bg-white rounded-full transition-transform ml-0.5
                            {isEnabled(source.id) ? 'translate-x-5' : ''}" />
              </button>
              <div class="flex-1 min-w-0">
                <div class="font-medium text-sm truncate">{source.name}</div>
                <div class="text-xs text-muted-foreground truncate">{source.url}</div>
              </div>
              <button
                class="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-white/5 transition-colors"
                on:click={() => deleteTarget = source.id}
              >
                <Trash2 class="w-4 h-4" />
              </button>
            </div>
          {/each}
        </div>
      </section>
    {/if}

    <!-- 预设源 -->
    <section>
      <h2 class="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">预设源</h2>
      <div class="space-y-2">
        {#each $allSources.filter(s => s.category && s.category !== ContentTag.GENERAL) as source}
          <div class="glass-card p-4 flex items-center gap-3">
            <button
              class="w-12 h-7 rounded-full transition-colors shrink-0 {isEnabled(source.id) ? 'bg-accent' : 'bg-white/10'}"
              on:click={() => toggleSource(source.id)}
            >
              <div class="w-5 h-5 bg-white rounded-full transition-transform ml-0.5
                          {isEnabled(source.id) ? 'translate-x-5' : ''}" />
            </button>
            <div class="flex-1 min-w-0">
              <div class="font-medium text-sm">{source.name}</div>
              <div class="text-xs text-muted-foreground">{source.description}</div>
            </div>
            {#if source.category}
              <Badge variant="secondary" class="bg-white/5 text-xs shrink-0">
                {TAG_INFO[source.category]?.icon} {TAG_INFO[source.category]?.label}
              </Badge>
            {/if}
          </div>
        {/each}
      </div>
    </section>
  </div>
</div>

<!-- 删除确认弹窗 -->
{#if deleteTarget}
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <div class="fixed inset-0 z-[100] flex items-center justify-center p-6 modal-backdrop fade-in" on:click={() => deleteTarget = null}>
    <div class="glass-card w-full max-w-sm p-6 scale-in" on:click|stopPropagation>
      <div class="flex justify-center mb-4">
        <div class="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center">
          <Trash2 class="w-8 h-8 text-destructive" />
        </div>
      </div>
      <div class="text-center mb-6">
        <h3 class="text-lg font-semibold mb-2">删除数据源</h3>
        <p class="text-sm text-muted-foreground">确定要删除此数据源吗？</p>
      </div>
      <div class="flex gap-3">
        <Button variant="outline" class="flex-1 bg-white/5 border-white/10 hover:bg-white/10" on:click={() => deleteTarget = null}>
          取消
        </Button>
        <Button class="flex-1 bg-destructive/20 hover:bg-destructive/30 text-destructive border-0" on:click={confirmDelete}>
          删除
        </Button>
      </div>
    </div>
  </div>
{/if}

<style>
  .modal-backdrop {
    background: rgba(0, 0, 0, 0.7);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
  }
</style>
