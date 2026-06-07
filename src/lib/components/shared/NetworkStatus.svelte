<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { Wifi, WifiOff } from 'lucide-svelte';
  import { NetworkMonitor } from '$lib/services/offline';

  let isOnline = true;
  let showStatus = false;
  let statusTimer: ReturnType<typeof setTimeout>;

  let cleanup: (() => void) | null = null;

  onMount(() => {
    NetworkMonitor.init();
    isOnline = NetworkMonitor.isOnline();

    cleanup = NetworkMonitor.addListener((online) => {
      isOnline = online;
      showStatus = true;

      clearTimeout(statusTimer);
      statusTimer = setTimeout(() => {
        showStatus = false;
      }, 3000);
    });
  });

  onDestroy(() => {
    cleanup?.();
    clearTimeout(statusTimer);
  });
</script>

{#if showStatus}
  <div class="network-status" class:online={isOnline} class:offline={!isOnline}>
    {#if isOnline}
      <Wifi class="w-4 h-4" />
      <span>网络已连接</span>
    {:else}
      <WifiOff class="w-4 h-4" />
      <span>离线模式</span>
    {/if}
  </div>
{/if}

<style>
  .network-status {
    position: fixed;
    top: 60px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 16px;
    border-radius: 100px;
    font-size: 13px;
    font-weight: 500;
    z-index: 100;
    animation: slideDown 0.3s ease-out;
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
  }

  .network-status.online {
    background: rgba(34, 197, 94, 0.2);
    color: rgb(34, 197, 94);
    border: 1px solid rgba(34, 197, 94, 0.3);
  }

  .network-status.offline {
    background: rgba(239, 68, 68, 0.2);
    color: rgb(239, 68, 68);
    border: 1px solid rgba(239, 68, 68, 0.3);
  }

  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateX(-50%) translateY(-20px);
    }
    to {
      opacity: 1;
      transform: translateX(-50%) translateY(0);
    }
  }
</style>
