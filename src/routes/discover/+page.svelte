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

  function handleToggle(id: string, e: Event) {
    e.preventDefault();
    e.stopPropagation();
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
        class="add-btn w-10 h-10 rounded-xl glass flex items-center justify-center"
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
          <input bind:value={newName} placeholder="名称" class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-white/20" />
          <input bind:value={newUrl} placeholder="RSS URL" class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-white/20" />
          <input bind:value={newDesc} placeholder="描述（可选）" class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-white/20" />
          <button
            class="action-btn w-full py-3 rounded-xl bg-white/15 text-sm font-medium"
            on:click={handleAdd}
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
                class="toggle-btn w-12 h-7 rounded-full shrink-0 {isEnabled(source.id) ? 'active' : ''}"
                on:click={(e) => handleToggle(source.id, e)}
              >
                <div class="toggle-knob {isEnabled(source.id) ? 'on' : ''}" />
              </button>
              <div class="flex-1 min-w-0">
                <div class="font-medium text-sm truncate">{source.name}</div>
                <div class="text-xs text-muted-foreground truncate">{source.url}</div>
              </div>
              <button
                class="delete-btn w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground"
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
              class="toggle-btn w-12 h-7 rounded-full shrink-0 {isEnabled(source.id) ? 'active' : ''}"
              on:click={(e) => handleToggle(source.id, e)}
            >
              <div class="toggle-knob {isEnabled(source.id) ? 'on' : ''}" />
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
  <div class="modal-overlay" on:click={() => deleteTarget = null}>
    <div class="modal-content glass-card" on:click|stopPropagation>
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
          class="modal-btn flex-1 py-3 rounded-xl bg-white/10 text-sm"
          on:click={() => deleteTarget = null}
        >
          取消
        </button>
        <button
          class="modal-btn flex-1 py-3 rounded-xl bg-white/20 text-sm font-medium"
          on:click={confirmDelete}
        >
          删除
        </button>
      </div>
    </div>
  </div>
{/if}

<style>
  /* 触摸优化 */
  button {
    touch-action: manipulation;
    -webkit-tap-highlight-color: transparent;
    user-select: none;
  }

  .add-btn {
    transition: background-color 0.2s;
  }
  .add-btn:active {
    background: rgba(255, 255, 255, 0.15);
  }

  .action-btn {
    transition: background-color 0.2s;
  }
  .action-btn:active {
    background: rgba(255, 255, 255, 0.25);
  }

  .toggle-btn {
    background: rgba(255, 255, 255, 0.1);
    transition: background-color 0.2s;
    padding: 2px;
  }
  .toggle-btn.active {
    background: rgba(255, 255, 255, 0.25);
  }

  .toggle-knob {
    width: 20px;
    height: 20px;
    background: white;
    border-radius: 50%;
    transition: transform 0.2s;
    margin-left: 2px;
  }
  .toggle-knob.on {
    transform: translateX(20px);
  }

  .delete-btn {
    transition: all 0.2s;
  }
  .delete-btn:active {
    background: rgba(255, 255, 255, 0.1);
    color: white;
  }

  .modal-overlay {
    position: fixed;
    inset: 0;
    z-index: 100;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 24px;
    background: rgba(0, 0, 0, 0.7);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    animation: fadeIn 0.2s ease-out;
  }

  .modal-content {
    width: 100%;
    max-width: 384px;
    padding: 24px;
    animation: scaleIn 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  }

  .modal-btn {
    transition: background-color 0.2s;
  }
  .modal-btn:active {
    background: rgba(255, 255, 255, 0.3);
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @keyframes scaleIn {
    from { opacity: 0; transform: scale(0.95); }
    to { opacity: 1; transform: scale(1); }
  }
</style>
