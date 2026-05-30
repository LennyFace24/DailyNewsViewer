<script lang="ts">
  import { Globe, Type, Eye, CheckCheck, Trash2, RotateCcw, Info } from 'lucide-svelte';
  import { settings, updateSetting, resetSettings } from '$lib/stores/settings';
  import { articles, markAllAsRead } from '$lib/stores/articles';
  import { ArticleCache } from '$lib/services/storage';

  $: unreadCount = $articles.filter(a => !a.isRead).length;
  $: bookmarkCount = $articles.filter(a => a.isBookmarked).length;

  let showClearDialog = false;
  let showResetDialog = false;

  function clearCache() {
    ArticleCache.clearExpired();
    showClearDialog = false;
    window.location.reload();
  }
</script>

<div class="min-h-screen pb-20">
  <div class="px-4 py-6">
    <h1 class="text-2xl font-bold mb-6">设置</h1>

    <!-- 代理设置 -->
    <section class="mb-6">
      <h2 class="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
        <Globe class="w-3.5 h-3.5" /> 网络代理
      </h2>
      <div class="glass-card overflow-hidden">
        <div class="p-4 flex items-center justify-between border-b border-white/5">
          <div>
            <span class="text-sm font-medium">启用代理</span>
            <p class="text-xs text-muted-foreground mt-0.5">通过代理服务器访问网络</p>
          </div>
          <button
            class="w-12 h-7 rounded-full transition-colors {$settings.proxyEnabled ? 'bg-white/25' : 'bg-white/10'}"
            on:click={() => updateSetting('proxyEnabled', !$settings.proxyEnabled)}
            type="button"
          >
            <div class="w-5 h-5 bg-white rounded-full transition-transform ml-0.5
                        {$settings.proxyEnabled ? 'translate-x-5' : ''}" />
          </button>
        </div>

        {#if $settings.proxyEnabled}
          <div class="p-4 space-y-3">
            <div>
              <label class="text-xs text-muted-foreground mb-1 block">代理类型</label>
              <div class="flex gap-2">
                {#each ['http', 'https', 'socks5'] as type}
                  <button
                    class="flex-1 px-3 py-2 rounded-lg text-xs font-medium transition-colors
                           {$settings.proxyType === type ? 'bg-white/20 text-foreground' : 'bg-white/5 text-muted-foreground hover:bg-white/10'}"
                    on:click={() => updateSetting('proxyType', type)}
                    type="button"
                  >
                    {type.toUpperCase()}
                  </button>
                {/each}
              </div>
            </div>
            <div class="flex gap-3">
              <div class="flex-1">
                <label class="text-xs text-muted-foreground mb-1 block">主机</label>
                <input
                  value={$settings.proxyHost}
                  on:change={(e) => updateSetting('proxyHost', e.currentTarget.value)}
                  placeholder="127.0.0.1"
                  class="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm outline-none focus:border-white/20"
                />
              </div>
              <div class="w-24">
                <label class="text-xs text-muted-foreground mb-1 block">端口</label>
                <input
                  value={$settings.proxyPort}
                  on:change={(e) => updateSetting('proxyPort', e.currentTarget.value)}
                  placeholder="7890"
                  class="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm outline-none focus:border-white/20"
                />
              </div>
            </div>
          </div>
        {/if}
      </div>
    </section>

    <!-- 外观 -->
    <section class="mb-6">
      <h2 class="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
        <Type class="w-3.5 h-3.5" /> 外观
      </h2>
      <div class="glass-card overflow-hidden">
        <div class="p-4 border-b border-white/5">
          <span class="text-sm font-medium">字体大小</span>
          <div class="flex gap-2 mt-3">
            {#each ['small', 'medium', 'large'] as size}
              <button
                class="flex-1 px-3 py-2 rounded-lg text-xs font-medium transition-colors
                       {$settings.fontSize === size ? 'bg-white/20 text-foreground' : 'bg-white/5 text-muted-foreground hover:bg-white/10'}"
                on:click={() => updateSetting('fontSize', size)}
                type="button"
              >
                {size === 'small' ? '小' : size === 'medium' ? '中' : '大'}
              </button>
            {/each}
          </div>
        </div>
        <div class="p-4">
          <span class="text-sm font-medium">卡片样式</span>
          <div class="flex gap-2 mt-3">
            {#each ['compact', 'comfortable', 'spacious'] as style}
              <button
                class="flex-1 px-3 py-2 rounded-lg text-xs font-medium transition-colors
                       {$settings.cardStyle === style ? 'bg-white/20 text-foreground' : 'bg-white/5 text-muted-foreground hover:bg-white/10'}"
                on:click={() => updateSetting('cardStyle', style)}
                type="button"
              >
                {style === 'compact' ? '紧凑' : style === 'comfortable' ? '舒适' : '宽松'}
              </button>
            {/each}
          </div>
        </div>
      </div>
    </section>

    <!-- 阅读 -->
    <section class="mb-6">
      <h2 class="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
        <Eye class="w-3.5 h-3.5" /> 阅读
      </h2>
      <div class="glass-card overflow-hidden">
        <div class="p-4 flex items-center justify-between border-b border-white/5">
          <span class="text-sm">显示图片</span>
          <button
            class="w-12 h-7 rounded-full transition-colors {$settings.showImages ? 'bg-white/25' : 'bg-white/10'}"
            on:click={() => updateSetting('showImages', !$settings.showImages)}
            type="button"
          >
            <div class="w-5 h-5 bg-white rounded-full transition-transform ml-0.5
                        {$settings.showImages ? 'translate-x-5' : ''}" />
          </button>
        </div>
        <div class="p-4 flex items-center justify-between">
          <span class="text-sm">自动标记已读</span>
          <button
            class="w-12 h-7 rounded-full transition-colors {$settings.markAsReadOnView ? 'bg-white/25' : 'bg-white/10'}"
            on:click={() => updateSetting('markAsReadOnView', !$settings.markAsReadOnView)}
            type="button"
          >
            <div class="w-5 h-5 bg-white rounded-full transition-transform ml-0.5
                        {$settings.markAsReadOnView ? 'translate-x-5' : ''}" />
          </button>
        </div>
      </div>
    </section>

    <!-- 数据 -->
    <section class="mb-6">
      <h2 class="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
        <Info class="w-3.5 h-3.5" /> 数据
      </h2>
      <div class="glass-card overflow-hidden">
        <div class="p-4 border-b border-white/5 flex justify-between">
          <span class="text-sm">未读</span>
          <span class="text-sm text-muted-foreground">{unreadCount}</span>
        </div>
        <div class="p-4 border-b border-white/5 flex justify-between">
          <span class="text-sm">收藏</span>
          <span class="text-sm text-muted-foreground">{bookmarkCount}</span>
        </div>
        <button
          on:click={markAllAsRead}
          class="w-full p-4 flex items-center gap-3 border-b border-white/5 hover:bg-white/5 text-sm transition-colors"
          type="button"
        >
          <CheckCheck class="w-4 h-4 text-muted-foreground" /> 全部标为已读
        </button>
        <button
          on:click={() => showClearDialog = true}
          class="w-full p-4 flex items-center gap-3 hover:bg-white/5 text-sm transition-colors"
          type="button"
        >
          <Trash2 class="w-4 h-4 text-muted-foreground" /> 清除缓存
        </button>
      </div>
    </section>

    <button
      class="w-full py-3 rounded-xl bg-white/10 hover:bg-white/15 transition-colors text-sm flex items-center justify-center gap-2"
      on:click={() => showResetDialog = true}
      type="button"
    >
      <RotateCcw class="w-4 h-4" /> 恢复默认
    </button>

    <p class="text-center text-xs text-muted-foreground/40 mt-6">DailyTech v0.4.1</p>
  </div>
</div>

<!-- 清除缓存弹窗 -->
{#if showClearDialog}
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <div class="fixed inset-0 z-[100] flex items-center justify-center p-6 modal-backdrop fade-in" on:click={() => showClearDialog = false}>
    <div class="glass-card w-full max-w-sm p-6 scale-in" on:click|stopPropagation>
      <div class="flex justify-center mb-4">
        <div class="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center">
          <Trash2 class="w-8 h-8 text-muted-foreground" />
        </div>
      </div>
      <div class="text-center mb-6">
        <h3 class="text-lg font-semibold mb-2">清除缓存</h3>
        <p class="text-sm text-muted-foreground">确定要清除缓存吗？收藏内容不会丢失。</p>
      </div>
      <div class="flex gap-3">
        <button
          class="flex-1 py-3 rounded-xl bg-white/10 hover:bg-white/15 transition-colors text-sm"
          on:click={() => showClearDialog = false}
          type="button"
        >
          取消
        </button>
        <button
          class="flex-1 py-3 rounded-xl bg-white/20 hover:bg-white/25 transition-colors text-sm font-medium"
          on:click={clearCache}
          type="button"
        >
          确定
        </button>
      </div>
    </div>
  </div>
{/if}

<!-- 恢复默认弹窗 -->
{#if showResetDialog}
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <div class="fixed inset-0 z-[100] flex items-center justify-center p-6 modal-backdrop fade-in" on:click={() => showResetDialog = false}>
    <div class="glass-card w-full max-w-sm p-6 scale-in" on:click|stopPropagation>
      <div class="flex justify-center mb-4">
        <div class="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center">
          <RotateCcw class="w-8 h-8 text-muted-foreground" />
        </div>
      </div>
      <div class="text-center mb-6">
        <h3 class="text-lg font-semibold mb-2">恢复默认设置</h3>
        <p class="text-sm text-muted-foreground">确定要恢复所有设置为默认值吗？</p>
      </div>
      <div class="flex gap-3">
        <button
          class="flex-1 py-3 rounded-xl bg-white/10 hover:bg-white/15 transition-colors text-sm"
          on:click={() => showResetDialog = false}
          type="button"
        >
          取消
        </button>
        <button
          class="flex-1 py-3 rounded-xl bg-white/20 hover:bg-white/25 transition-colors text-sm font-medium"
          on:click={() => { resetSettings(); showResetDialog = false; }}
          type="button"
        >
          确定
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
