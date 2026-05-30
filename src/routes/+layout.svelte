<script lang="ts">
  import '../app.css';
  import { onMount, onDestroy } from 'svelte';
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import BottomNav from '$lib/components/layout/BottomNav.svelte';
  import ExitDialog from '$lib/components/shared/ExitDialog.svelte';
  import { loadFromCache } from '$lib/stores/articles';
  import { Capacitor } from '@capacitor/core';
  import { App } from '@capacitor/app';

  let showExitDialog = false;

  $: currentPath = $page.url.pathname;

  const pages = ['/', '/discover', '/bookmarks', '/settings'];
  $: currentIndex = pages.indexOf(currentPath);

  // 滑动相关
  let touchStartX = 0;
  let touchStartY = 0;
  let isSwiping = false;

  function handleTouchStart(e: TouchEvent) {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
    isSwiping = false;
  }

  function handleTouchMove(e: TouchEvent) {
    if (!isSwiping) {
      const deltaX = Math.abs(e.touches[0].clientX - touchStartX);
      const deltaY = Math.abs(e.touches[0].clientY - touchStartY);
      if (deltaX > deltaY && deltaX > 10) {
        isSwiping = true;
      }
    }
  }

  function handleTouchEnd(e: TouchEvent) {
    if (!isSwiping) return;

    const deltaX = e.changedTouches[0].clientX - touchStartX;
    const threshold = 80;

    if (Math.abs(deltaX) > threshold) {
      if (deltaX > 0 && currentIndex > 0) {
        // 右滑 - 上一页
        goto(pages[currentIndex - 1]);
      } else if (deltaX < 0 && currentIndex < pages.length - 1) {
        // 左滑 - 下一页
        goto(pages[currentIndex + 1]);
      }
    }
  }

  function handleBack() {
    if (currentPath !== '/') {
      goto('/');
    } else {
      showExitDialog = true;
    }
  }

  function handleExit() {
    App.exitApp();
  }

  onMount(() => {
    loadFromCache();

    if (Capacitor.isNativePlatform()) {
      App.addListener('backButton', () => {
        handleBack();
      });
    }
  });

  onDestroy(() => {
    if (Capacitor.isNativePlatform()) {
      App.removeAllListeners();
    }
  });
</script>

<div
  class="app-container min-h-screen text-foreground flex flex-col"
  on:touchstart={handleTouchStart}
  on:touchmove={handleTouchMove}
  on:touchend={handleTouchEnd}
  role="main"
>
  <!-- 内容层 -->
  <main class="flex-1 relative z-10 pb-16 overflow-auto">
    <slot />
  </main>

  <BottomNav on:back={handleBack} />

  <!-- 退出弹窗 -->
  <ExitDialog bind:open={showExitDialog} on:confirm={handleExit} />
</div>
