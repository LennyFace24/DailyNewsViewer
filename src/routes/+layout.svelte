<script lang="ts">
  import '../app.css';
  import { onMount, onDestroy } from 'svelte';
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import BottomNav from '$lib/components/layout/BottomNav.svelte';
  import { loadFromCache } from '$lib/stores/articles';
  import { settings } from '$lib/stores/settings';
  import { Capacitor } from '@capacitor/core';
  import { App } from '@capacitor/app';

  let bgImage = '';

  $: {
    if ($settings.backgroundImage) {
      bgImage = `url(${$settings.backgroundImage})`;
    } else {
      bgImage = '';
    }
  }

  $: currentPath = $page.url.pathname;

  onMount(() => {
    loadFromCache();

    // 处理Android返回键
    if (Capacitor.isNativePlatform()) {
      App.addListener('backButton', ({ canGoBack }) => {
        // 如果在文章详情页，返回首页
        if (currentPath.startsWith('/article/')) {
          goto('/');
          return;
        }

        // 如果在其他子页面，返回首页
        if (currentPath !== '/') {
          goto('/');
          return;
        }

        // 在首页时，退出app
        if (canGoBack) {
          window.history.back();
        } else {
          App.exitApp();
        }
      });
    }
  });

  onDestroy(() => {
    if (Capacitor.isNativePlatform()) {
      App.removeAllListeners();
    }
  });
</script>

<div class="app-container min-h-screen text-foreground flex flex-col">
  <!-- 背景层 -->
  {#if bgImage}
    <div class="fixed inset-0 z-0">
      <div class="absolute inset-0 bg-cover bg-center bg-no-repeat" style="background-image: {bgImage}" />
      <div class="absolute inset-0 bg-background/80 backdrop-blur-xl" />
    </div>
  {/if}

  <!-- 内容层 -->
  <main class="flex-1 relative z-10 pb-16 overflow-auto">
    <slot />
  </main>

  <BottomNav />
</div>
