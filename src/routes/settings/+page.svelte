<script lang="ts">
  import {
    Palette, Globe, Type, Layout, Eye, CheckCheck,
    Trash2, RotateCcw, Info
  } from 'lucide-svelte';
  import { Button } from '$lib/components/ui/button/index.js';
  import { Badge } from '$lib/components/ui/badge/index.js';
  import { settings, updateSetting, resetSettings, THEME_COLORS } from '$lib/stores/settings';
  import { articles, markAllAsRead } from '$lib/stores/articles';
  import { ArticleCache } from '$lib/services/storage';

  $: unreadCount = $articles.filter(a => !a.isRead).length;
  $: bookmarkCount = $articles.filter(a => a.isBookmarked).length;

  let customColor = '';

  function clearCache() {
    if (confirm('清除缓存？收藏内容不会丢失。')) {
      ArticleCache.clearExpired();
      window.location.reload();
    }
  }
</script>

<div class="min-h-screen pb-20">
  <div class="px-4 py-6">
    <h1 class="text-2xl font-bold mb-6">设置</h1>

    <!-- 主题色 -->
    <section class="mb-6">
      <h2 class="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
        <Palette class="w-3.5 h-3.5" /> 点缀色
      </h2>
      <div class="glass-card p-4">
        <div class="grid grid-cols-6 gap-3">
          {#each THEME_COLORS as color}
            <button
              class="w-full aspect-square rounded-xl transition-all duration-200
                     {$settings.primaryColor === color.value
                       ? 'ring-2 ring-white/30 scale-110'
                       : 'hover:scale-105'}"
              style="background: hsl({color.value})"
              on:click={() => updateSetting('primaryColor', color.value)}
            />
          {/each}
        </div>
      </div>
    </section>

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
            class="w-12 h-7 rounded-full transition-colors {$settings.proxyEnabled ? 'bg-accent' : 'bg-white/10'}"
            on:click={() => updateSetting('proxyEnabled', !$settings.proxyEnabled)}
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
                           {$settings.proxyType === type ? 'bg-white/10 text-foreground' : 'bg-white/5 text-muted-foreground'}"
                    on:click={() => updateSetting('proxyType', type)}
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
                  class="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm"
                />
              </div>
              <div class="w-24">
                <label class="text-xs text-muted-foreground mb-1 block">端口</label>
                <input
                  value={$settings.proxyPort}
                  on:change={(e) => updateSetting('proxyPort', e.currentTarget.value)}
                  placeholder="7890"
                  class="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm"
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
                       {$settings.fontSize === size ? 'bg-white/10 text-foreground' : 'bg-white/5 text-muted-foreground'}"
                on:click={() => updateSetting('fontSize', size)}
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
                       {$settings.cardStyle === style ? 'bg-white/10 text-foreground' : 'bg-white/5 text-muted-foreground'}"
                on:click={() => updateSetting('cardStyle', style)}
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
            class="w-12 h-7 rounded-full transition-colors {$settings.showImages ? 'bg-accent' : 'bg-white/10'}"
            on:click={() => updateSetting('showImages', !$settings.showImages)}
          >
            <div class="w-5 h-5 bg-white rounded-full transition-transform ml-0.5
                        {$settings.showImages ? 'translate-x-5' : ''}" />
          </button>
        </div>
        <div class="p-4 flex items-center justify-between">
          <span class="text-sm">自动标记已读</span>
          <button
            class="w-12 h-7 rounded-full transition-colors {$settings.markAsReadOnView ? 'bg-accent' : 'bg-white/10'}"
            on:click={() => updateSetting('markAsReadOnView', !$settings.markAsReadOnView)}
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
          <Badge variant="secondary" class="bg-white/10">{unreadCount}</Badge>
        </div>
        <div class="p-4 border-b border-white/5 flex justify-between">
          <span class="text-sm">收藏</span>
          <Badge variant="secondary" class="bg-white/10">{bookmarkCount}</Badge>
        </div>
        <button on:click={markAllAsRead} class="w-full p-4 flex items-center gap-3 border-b border-white/5 hover:bg-white/5 text-sm">
          <CheckCheck class="w-4 h-4 text-muted-foreground" /> 全部标为已读
        </button>
        <button on:click={clearCache} class="w-full p-4 flex items-center gap-3 hover:bg-white/5 text-sm text-destructive">
          <Trash2 class="w-4 h-4" /> 清除缓存
        </button>
      </div>
    </section>

    <button
      class="w-full py-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors text-sm flex items-center justify-center gap-2"
      on:click={resetSettings}
    >
      <RotateCcw class="w-4 h-4" /> 恢复默认
    </button>

    <p class="text-center text-xs text-muted-foreground/40 mt-6">DailyTech v0.4.0</p>
  </div>
</div>
