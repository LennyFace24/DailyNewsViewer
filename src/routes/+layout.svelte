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

<div class="app-container min-h-screen text-foreground flex flex-col">
  <main class="flex-1 relative z-10 pb-16 overflow-auto">
    <slot />
  </main>

  <BottomNav on:back={handleBack} />

  <ExitDialog bind:open={showExitDialog} on:confirm={handleExit} />
</div>
