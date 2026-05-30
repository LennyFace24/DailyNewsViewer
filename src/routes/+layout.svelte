<script lang="ts">
  import '../app.css';
  import { onMount, onDestroy } from 'svelte';
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import BottomNav from '$lib/components/layout/BottomNav.svelte';
  import ExitDialog from '$lib/components/shared/ExitDialog.svelte';
  import { loadFromCache } from '$lib/stores/articles';
  import { settings } from '$lib/stores/settings';
  import { Capacitor } from '@capacitor/core';
  import { App } from '@capacitor/app';

  let bgImage = '';
  let showExitDialog = false;

  $: {
    bgImage = $settings.backgroundImage ? `url(${$settings.backgroundImage})` : '';
  }

  $: currentPath = $page.url.pathname;

  function handleBack() {
    if (currentPath.startsWith('/article/')) {
      goto('/');
      return;
    }
    if (currentPath !== '/') {
      goto('/');
      return;
    }
    showExitDialog = true;
  }

  function handleExit() {
    App.exitApp();
  }

  onMount(() => {
    loadFromCache();

    if (Capacitor.isNativePlatform()) {
      App.addListener('backButton', ({ canGoBack }) => {
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

<div class="app-container min-h-screen text-foreground flex flex-col relative">
  <!-- 背景层 -->
  {#if bgImage}
    <div class="fixed inset-0 z-0">
      <div class="absolute inset-0 bg-cover bg-center bg-no-repeat" style="background-image: {bgImage}" />
      <div class="absolute inset-0 bg-background/90 backdrop-blur-2xl" />
    </div>
  {/if}

  <!-- 内容层 -->
  <main class="flex-1 relative z-10 pb-20 overflow-auto">
    <slot />
  </main>

  <BottomNav on:back={handleBack} />

  <!-- 退出弹窗 -->
  <ExitDialog bind:open={showExitDialog} on:confirm={handleExit} />
</div>
