<script lang="ts">
  import { Plus, Trash2, X, Brain, Shield, Globe, Smartphone, Gamepad2, Settings, Database, Code, Package, Rocket, Briefcase, BookOpen, Newspaper } from 'lucide-svelte';
  import {
    allSources, enabledSourceIds, toggleSource,
    addCustomSource, removeCustomSource
  } from '$lib/stores/sources';
  import { ContentTag, TAG_INFO } from '$lib/types/source';

  const iconMap: Record<string, any> = {
    brain: Brain,
    shield: Shield,
    globe: Globe,
    smartphone: Smartphone,
    'gamepad-2': Gamepad2,
    settings: Settings,
    database: Database,
    code: Code,
    package: Package,
    rocket: Rocket,
    briefcase: Briefcase,
    'book-open': BookOpen,
    newspaper: Newspaper
  };

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

  function handleToggle(id: string) {
    toggleSource(id);
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
        class="w-10 h-10 rounded-xl glass flex items-center justify-center transition-all active:scale-95 hover:bg-white/10"
        on:click={() => showAddForm = !showAddForm}
        type="button"
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
          <input bind:value={newName} placeholder="名称" class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-white/20" />
          <input bind:value={newUrl} placeholder="RSS URL" class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-white/20" />
          <input bind:value={newDesc} placeholder="描述（可选）" class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-white/20" />
          <button
            class="w-full py-3 rounded-xl bg-white/15 hover:bg-white/20 transition-colors text-sm font-medium"
            on:click={handleAdd}
            type="button"
          >
            添加
          </button>
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
                class="w-12 h-7 rounded-full transition-colors shrink-0 {isEnabled(source.id) ? 'bg-white/90' : 'bg-white/10'}"
                on:click={() => handleToggle(source.id)}
                type="button"
              >
                <div class="w-5 h-5 bg-black rounded-full transition-transform ml-0.5
                            {isEnabled(source.id) ? 'translate-x-5' : ''}" />
              </button>
              <div class="flex-1 min-w-0">
                <div class="font-medium text-sm truncate">{source.name}</div>
                <div class="text-xs text-muted-foreground truncate">{source.url}</div>
              </div>
              <button
                class="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-white hover:bg-white/10 transition-colors"
                on:click={() => deleteTarget = source.id}
                type="button"
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
              class="w-12 h-7 rounded-full transition-colors shrink-0 {isEnabled(source.id) ? 'bg-white/90' : 'bg-white/10'}"
              on:click={() => handleToggle(source.id)}
              type="button"
            >
              <div class="w-5 h-5 bg-black rounded-full transition-transform ml-0.5
                          {isEnabled(source.id) ? 'translate-x-5' : ''}" />
            </button>
            <div class="flex-1 min-w-0">
              <div class="font-medium text-sm">{source.name}</div>
              <div class="text-xs text-muted-foreground">{source.description}</div>
            </div>
            {#if source.category && source.category !== ContentTag.GENERAL}
              {@const Icon = iconMap[TAG_INFO[source.category]?.icon] || Newspaper}
              <div class="flex items-center gap-1 px-2 py-1 rounded-full bg-white/5 text-xs text-muted-foreground shrink-0">
                <Icon class="w-3 h-3" />
                {TAG_INFO[source.category]?.label}
              </div>
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
          <Trash2 class="w-8 h-8 text-muted-foreground" />
        </div>
      </div>
      <div class="text-center mb-6">
        <h3 class="text-lg font-semibold mb-2">删除数据源</h3>
        <p class="text-sm text-muted-foreground">确定要删除此数据源吗？</p>
      </div>
      <div class="flex gap-3">
        <button
          class="flex-1 py-3 rounded-xl bg-white/10 hover:bg-white/15 transition-colors text-sm"
          on:click={() => deleteTarget = null}
          type="button"
        >
          取消
        </button>
        <button
          class="flex-1 py-3 rounded-xl bg-white/20 hover:bg-white/25 transition-colors text-sm font-medium"
          on:click={confirmDelete}
          type="button"
        >
          删除
        </button>
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
