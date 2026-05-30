<script lang="ts">
  import { Plus, Trash2, X, Brain, Shield, Globe, Smartphone, Gamepad2, Settings, Database, Code, Package, Rocket, Briefcase, BookOpen, Newspaper } from 'lucide-svelte';
  import {
    allSources, enabledSourceIds, toggleSource,
    addCustomSource, removeCustomSource
  } from '$lib/stores/sources';
  import { ContentTag, TAG_INFO } from '$lib/types/source';

  const iconMap: Record<string, any> = {
    brain: Brain, shield: Shield, globe: Globe, smartphone: Smartphone,
    'gamepad-2': Gamepad2, settings: Settings, database: Database, code: Code,
    package: Package, rocket: Rocket, briefcase: Briefcase, 'book-open': BookOpen, newspaper: Newspaper
  };

  let showAddForm = false;
  let newName = '';
  let newUrl = '';
  let newDesc = '';
  let deleteTarget: string | null = null;

  $: customSources = $allSources.filter(s => !s.category || s.category === ContentTag.GENERAL);

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
    <!-- 标题栏 -->
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold">数据源</h1>
        <p class="text-sm text-muted-foreground">管理你的信息来源</p>
      </div>
      <button class="icon-btn" on:click={() => showAddForm = !showAddForm}>
        {#if showAddForm}
          <X class="w-5 h-5" />
        {:else}
          <Plus class="w-5 h-5" />
        {/if}
      </button>
    </div>

    <!-- 添加表单 -->
    {#if showAddForm}
      <div class="glass-card p-4 mb-6">
        <h3 class="font-medium mb-3">添加自定义 RSS 源</h3>
        <div class="space-y-3">
          <input bind:value={newName} placeholder="名称" class="input-field" />
          <input bind:value={newUrl} placeholder="RSS URL" class="input-field" />
          <input bind:value={newDesc} placeholder="描述（可选）" class="input-field" />
          <button class="primary-btn" on:click={handleAdd}>添加</button>
        </div>
      </div>
    {/if}

    <!-- 自定义源 -->
    {#if customSources.length > 0}
      <section class="mb-8">
        <h2 class="section-title">自定义</h2>
        <div class="space-y-2">
          {#each customSources as source}
            <div class="glass-card p-4 flex items-center gap-3">
              <div
                class="toggle"
                class:active={$enabledSourceIds.includes(source.id)}
                on:click={() => toggleSource(source.id)}
              >
                <div class="toggle-thumb" class:active={$enabledSourceIds.includes(source.id)} />
              </div>
              <div class="flex-1 min-w-0">
                <div class="font-medium text-sm truncate">{source.name}</div>
                <div class="text-xs text-muted-foreground truncate">{source.url}</div>
              </div>
              <div class="icon-btn-danger" on:click={() => deleteTarget = source.id}>
                <Trash2 class="w-4 h-4" />
              </div>
            </div>
          {/each}
        </div>
      </section>
    {/if}

    <!-- 预设源 -->
    <section>
      <h2 class="section-title">预设源</h2>
      <div class="space-y-2">
        {#each $allSources.filter(s => s.category && s.category !== ContentTag.GENERAL) as source}
          <div class="glass-card p-4 flex items-center gap-3">
            <div
              class="toggle"
              class:active={$enabledSourceIds.includes(source.id)}
              on:click={() => toggleSource(source.id)}
            >
              <div class="toggle-thumb" class:active={$enabledSourceIds.includes(source.id)} />
            </div>
            <div class="flex-1 min-w-0">
              <div class="font-medium text-sm">{source.name}</div>
              <div class="text-xs text-muted-foreground">{source.description}</div>
            </div>
            {#if source.category && source.category !== ContentTag.GENERAL}
              {@const Icon = iconMap[TAG_INFO[source.category]?.icon] || Newspaper}
              <div class="tag-badge">
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
  <div class="modal-overlay" on:click={() => deleteTarget = null}>
    <div class="modal-box glass-card" on:click|stopPropagation>
      <div class="modal-icon-box">
        <Trash2 class="w-8 h-8 text-muted-foreground" />
      </div>
      <div class="modal-text">
        <h3>删除数据源</h3>
        <p>确定要删除此数据源吗？</p>
      </div>
      <div class="modal-actions">
        <button class="secondary-btn" on:click={() => deleteTarget = null}>取消</button>
        <button class="primary-btn" on:click={confirmDelete}>删除</button>
      </div>
    </div>
  </div>
{/if}

<style>
  .icon-btn {
    width: 40px;
    height: 40px;
    border-radius: 12px;
    background: rgba(255, 255, 255, 0.08);
    display: flex;
    align-items: center;
    justify-content: center;
    border: none;
    color: white;
    cursor: pointer;
  }
  .icon-btn:active {
    background: rgba(255, 255, 255, 0.15);
  }

  .icon-btn-danger {
    width: 32px;
    height: 32px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: rgba(255, 255, 255, 0.4);
    cursor: pointer;
  }
  .icon-btn-danger:active {
    background: rgba(255, 255, 255, 0.1);
    color: white;
  }

  .primary-btn {
    width: 100%;
    padding: 12px;
    border-radius: 12px;
    background: rgba(255, 255, 255, 0.15);
    color: white;
    font-size: 14px;
    font-weight: 500;
    border: none;
    cursor: pointer;
  }
  .primary-btn:active {
    background: rgba(255, 255, 255, 0.25);
  }

  .secondary-btn {
    flex: 1;
    padding: 12px;
    border-radius: 12px;
    background: rgba(255, 255, 255, 0.08);
    color: white;
    font-size: 14px;
    border: none;
    cursor: pointer;
  }
  .secondary-btn:active {
    background: rgba(255, 255, 255, 0.15);
  }

  .input-field {
    width: 100%;
    padding: 12px 16px;
    border-radius: 12px;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    color: white;
    font-size: 14px;
    outline: none;
  }
  .input-field:focus {
    border-color: rgba(255, 255, 255, 0.2);
  }

  .section-title {
    font-size: 12px;
    font-weight: 500;
    color: rgba(255, 255, 255, 0.4);
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin-bottom: 12px;
  }

  /* 开关 */
  .toggle {
    width: 48px;
    height: 28px;
    border-radius: 14px;
    background: rgba(255, 255, 255, 0.1);
    padding: 2px;
    cursor: pointer;
    transition: background 0.2s;
    flex-shrink: 0;
  }
  .toggle.active {
    background: rgba(255, 255, 255, 0.25);
  }
  .toggle:active {
    background: rgba(255, 255, 255, 0.2);
  }

  .toggle-thumb {
    width: 24px;
    height: 24px;
    border-radius: 12px;
    background: white;
    transition: transform 0.2s;
  }
  .toggle-thumb.active {
    transform: translateX(20px);
  }

  .tag-badge {
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 4px 8px;
    border-radius: 100px;
    background: rgba(255, 255, 255, 0.05);
    font-size: 12px;
    color: rgba(255, 255, 255, 0.5);
    flex-shrink: 0;
  }

  /* 弹窗 */
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
  }

  .modal-box {
    width: 100%;
    max-width: 384px;
    padding: 24px;
  }

  .modal-icon-box {
    display: flex;
    justify-content: center;
    margin-bottom: 16px;
  }

  .modal-text {
    text-align: center;
    margin-bottom: 24px;
  }
  .modal-text h3 {
    font-size: 18px;
    font-weight: 600;
    margin-bottom: 8px;
  }
  .modal-text p {
    font-size: 14px;
    color: rgba(255, 255, 255, 0.5);
  }

  .modal-actions {
    display: flex;
    gap: 12px;
  }
</style>
