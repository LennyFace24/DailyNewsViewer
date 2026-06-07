<script lang="ts">
  import '../app.css';
  import { onMount, onDestroy } from 'svelte';
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import BottomNav from '$lib/components/layout/BottomNav.svelte';
  import ExitDialog from '$lib/components/shared/ExitDialog.svelte';
  import UpdateDialog from '$lib/components/shared/UpdateDialog.svelte';
  import NetworkStatus from '$lib/components/shared/NetworkStatus.svelte';
  import SplashScreen from '$lib/components/shared/SplashScreen.svelte';
  import Onboarding from '$lib/components/shared/Onboarding.svelte';
  import QuickActions from '$lib/components/shared/QuickActions.svelte';
  import ToastContainer from '$lib/components/shared/ToastContainer.svelte';
  import CommandPalette from '$lib/components/shared/CommandPalette.svelte';
  import { loadFromCache } from '$lib/stores/articles';
  import { checkForUpdate, getCurrentVersion, compareVersions } from '$lib/services/updater';
  import type { ReleaseInfo } from '$lib/services/updater';
  import { Capacitor } from '@capacitor/core';
  import { App } from '@capacitor/app';

  let showExitDialog = false;
  let showUpdateDialog = false;
  let latestRelease: ReleaseInfo | null = null;
  let showSplash = true;
  let showOnboarding = false;
  let showQuickActions = false;
  let showCommandPalette = false;

  // 键盘快捷键
  function handleKeydown(e: KeyboardEvent) {
    // Cmd/Ctrl + K 打开命令面板
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      showCommandPalette = true;
    }
  }

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
      const { release, hasUpdate, error } = await checkForUpdate();

      if (error || !release) {
        console.log('[Update] No update available:', error);
        return;
      }

      if (hasUpdate) {
        console.log('[Update] New version available:', release.version);
        latestRelease = release;
        showUpdateDialog = true;
      } else {
        console.log('[Update] Already up to date');
      }
    } catch (error) {
      console.error('[Update] Check failed:', error);
    }
  }

  onMount(() => {
    loadFromCache();
    checkUpdate();

    if (Capacitor.isNativePlatform()) {
      App.addListener('backButton', () => {
        handleBack();
      });
    }

    // 2秒后隐藏启动画面
    setTimeout(() => {
      showSplash = false;

      // 检查是否需要显示引导页
      const onboardingDone = localStorage.getItem('dailytech_onboarding');
      if (!onboardingDone) {
        showOnboarding = true;
      }
    }, 2000);
  });

  onDestroy(() => {
    if (Capacitor.isNativePlatform()) {
      App.removeAllListeners();
    }
  });
</script>

<svelte:window on:keydown={handleKeydown} />

{#if showSplash}
  <SplashScreen />
{:else}
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

    <Onboarding bind:open={showOnboarding} />

    <QuickActions bind:open={showQuickActions} />

    <CommandPalette bind:open={showCommandPalette} />

    <ToastContainer />
  </div>
{/if}
