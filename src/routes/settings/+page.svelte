<script lang="ts">
  import {
    Sun, Type, Layout, Eye, RotateCcw, Trash2, CheckCheck,
    Info, Palette, Globe, Wifi
  } from 'lucide-svelte';
  import { Button } from '$lib/components/ui/button/index.js';
  import { Switch } from '$lib/components/ui/switch/index.js';
  import { Badge } from '$lib/components/ui/badge/index.js';
  import { settings, updateSetting, resetSettings, THEME_COLORS, PROXY_PRESETS } from '$lib/stores/settings';
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

  function setPrimaryColor(color: string) {
    updateSetting('primaryColor', color);
  }

  function applyCustomColor() {
    if (customColor) {
      updateSetting('primaryColor', customColor);
    }
  }

  function setProxy(url: string) {
    updateSetting('proxyUrl', url);
  }
</script>

<div class="min-h-screen bg-background pb-20">
  <div class="px-4 py-6">
    <h1 class="text-2xl font-bold mb-6">设置</h1>

    <!-- 主题色 -->
    <section class="mb-6">
      <h2 class="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
        <Palette class="w-4 h-4" /> 主题色
      </h2>
      <div class="bg-card rounded-xl border p-4">
        <div class="grid grid-cols-4 gap-3 mb-4">
          {#each THEME_COLORS as color}
            <button
              class="w-full aspect-square rounded-xl transition-all {$settings.primaryColor === color.value ? 'ring-2 ring-offset-2 ring-offset-background scale-110' : 'hover:scale-105'}"
              style="background: hsl({color.value})"
              on:click={() => setPrimaryColor(color.value)}
            />
          {/each}
        </div>
        <div class="flex gap-2">
          <input bind:value={customColor} placeholder="自定义 HSL (如: 150 80% 50%)" class="flex-1 bg-muted rounded-md px-3 py-2 text-sm" />
          <Button size="sm" on:click={applyCustomColor}>应用</Button>
        </div>
      </div>
    </section>

    <!-- 代理设置 -->
    <section class="mb-6">
      <h2 class="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
        <Globe class="w-4 h-4" /> 代理设置
      </h2>
      <div class="bg-card rounded-xl border overflow-hidden">
        <div class="p-4 flex items-center justify-between border-b">
          <div>
            <span class="text-sm font-medium">启用代理</span>
            <p class="text-xs text-muted-foreground mt-1">解决跨域问题</p>
          </div>
          <Switch
            checked={$settings.proxyEnabled}
            on:click={() => updateSetting('proxyEnabled', !$settings.proxyEnabled)}
          />
        </div>

        {#if $settings.proxyEnabled}
          <div class="p-4 border-b">
            <span class="text-sm font-medium mb-2 block">预设代理</span>
            <div class="grid grid-cols-2 gap-2">
              {#each PROXY_PRESETS as proxy}
                <button
                  class="px-3 py-2 text-xs rounded-lg border transition-colors
                         {$settings.proxyUrl === proxy.url ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-accent'}"
                  on:click={() => setProxy(proxy.url)}
                >
                  {proxy.name}
                </button>
              {/each}
            </div>
          </div>

          <div class="p-4">
            <span class="text-sm font-medium mb-2 block">自定义代理 URL</span>
            <input
              value={$settings.proxyUrl}
              on:change={(e) => updateSetting('proxyUrl', e.currentTarget.value)}
              placeholder="https://corsproxy.io/?"
              class="w-full bg-muted rounded-lg px-3 py-2 text-sm"
            />
            <p class="text-xs text-muted-foreground mt-2">代理需要支持 URL 参数拼接</p>
          </div>
        {/if}
      </div>
    </section>

    <!-- 外观 -->
    <section class="mb-6">
      <h2 class="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
        <Sun class="w-4 h-4" /> 外观
      </h2>
      <div class="bg-card rounded-xl border overflow-hidden">
        <div class="p-4 border-b">
          <span class="text-sm font-medium">字体大小</span>
          <div class="flex gap-2 mt-3">
            {#each ['small', 'medium', 'large'] as size}
              <Button
                variant={$settings.fontSize === size ? 'default' : 'outline'}
                size="sm"
                class="flex-1"
                on:click={() => updateSetting('fontSize', size)}
              >
                {size === 'small' ? '小' : size === 'medium' ? '中' : '大'}
              </Button>
            {/each}
          </div>
        </div>
        <div class="p-4">
          <span class="text-sm font-medium">卡片样式</span>
          <div class="flex gap-2 mt-3">
            {#each ['compact', 'comfortable', 'spacious'] as style}
              <Button
                variant={$settings.cardStyle === style ? 'default' : 'outline'}
                size="sm"
                class="flex-1"
                on:click={() => updateSetting('cardStyle', style)}
              >
                {style === 'compact' ? '紧凑' : style === 'comfortable' ? '舒适' : '宽松'}
              </Button>
            {/each}
          </div>
        </div>
      </div>
    </section>

    <!-- 阅读 -->
    <section class="mb-6">
      <h2 class="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
        <Eye class="w-4 h-4" /> 阅读
      </h2>
      <div class="bg-card rounded-xl border overflow-hidden">
        <div class="p-4 flex items-center justify-between border-b">
          <span class="text-sm">显示图片</span>
          <Switch checked={$settings.showImages} on:click={() => updateSetting('showImages', !$settings.showImages)} />
        </div>
        <div class="p-4 flex items-center justify-between">
          <span class="text-sm">自动标记已读</span>
          <Switch checked={$settings.markAsReadOnView} on:click={() => updateSetting('markAsReadOnView', !$settings.markAsReadOnView)} />
        </div>
      </div>
    </section>

    <!-- 数据 -->
    <section class="mb-6">
      <h2 class="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
        <Info class="w-4 h-4" /> 数据
      </h2>
      <div class="bg-card rounded-xl border overflow-hidden">
        <div class="p-4 border-b flex justify-between">
          <span class="text-sm">未读</span>
          <Badge variant="secondary">{unreadCount}</Badge>
        </div>
        <div class="p-4 border-b flex justify-between">
          <span class="text-sm">收藏</span>
          <Badge variant="secondary">{bookmarkCount}</Badge>
        </div>
        <button on:click={markAllAsRead} class="w-full p-4 flex items-center gap-2 border-b hover:bg-accent text-sm">
          <CheckCheck class="w-4 h-4" /> 全部标为已读
        </button>
        <button on:click={clearCache} class="w-full p-4 flex items-center gap-2 hover:bg-accent text-sm text-destructive">
          <Trash2 class="w-4 h-4" /> 清除缓存
        </button>
      </div>
    </section>

    <Button variant="outline" class="w-full" on:click={resetSettings}>
      <RotateCcw class="w-4 h-4 mr-2" /> 恢复默认
    </Button>

    <p class="text-center text-xs text-muted-foreground mt-6">DailyTech v0.3.0</p>
  </div>
</div>
