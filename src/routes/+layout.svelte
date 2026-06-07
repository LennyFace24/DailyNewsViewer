<script lang="ts">
  import '../app.css';
  import { onMount, onDestroy } from 'svelte';
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import BottomNav from '$lib/components/layout/BottomNav.svelte';
  import ExitDialog from '$lib/components/shared/ExitDialog.svelte';
  import UpdateDialog from '$lib/components/shared/UpdateDialog.svelte';
  import NetworkStatus from '$lib/components/shared/NetworkStatus.svelte';
  import { loadFromCache } from '$lib/stores/articles';
  import { checkForUpdate, getCurrentVersion, compareVersions } from '$lib/services/updater';
  import type { ReleaseInfo } from '$lib/services/updater';
  import { Capacitor } from '@capacitor/core';
  import { App } from '@capacitor/app';

  let showExitDialog = false;
  let showUpdateDialog = false;
  let latestRelease: ReleaseInfo | null = null;

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

  async function checkUpdate() {
    try {
      const { release, error } = await checkForUpdate();

      if (error) {
        console.log('[Update] Error:', error);
        return;
      }

      if (!release) {
        console.log('[Update] No release info');
        return;
      }

      const currentVersion = getCurrentVersion();
      const comparison = compareVersions(currentVersion, release.version);

      console.log('[Update] Current:', currentVersion, 'Latest:', release.version, 'Comparison:', comparison);

      if (comparison > 0) {
        latestRelease = release;
        showUpdateDialog = true;
      }
    } catch (error) {
      console.error('Update check failed:', error);
    }
  }

  onMount(() => {
    loadFromCache();

    // 检查更新
    checkUpdate();

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

  <NetworkStatus />

  <ExitDialog bind:open={showExitDialog} on:confirm={handleExit} />

  <UpdateDialog
    bind:open={showUpdateDialog}
    release={latestRelease}
    on:close={() => showUpdateDialog = false}
  />
</div>
