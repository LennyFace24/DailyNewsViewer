<script lang="ts">
  import { onMount } from 'svelte';
  import { CheckCircle, AlertCircle, Info, X } from 'lucide-svelte';

  export let show = false;
  export let message = '';
  export let type: 'success' | 'error' | 'info' = 'info';
  export let duration = 3000;

  let visible = false;
  let timer: ReturnType<typeof setTimeout>;

  $: if (show) {
    visible = true;
    clearTimeout(timer);
    timer = setTimeout(() => {
      visible = false;
      setTimeout(() => {
        show = false;
      }, 300);
    }, duration);
  }

  function close() {
    visible = false;
    setTimeout(() => {
      show = false;
    }, 300);
  }

  const icons = {
    success: CheckCircle,
    error: AlertCircle,
    info: Info
  };

  const colors = {
    success: 'bg-green-500/20 text-green-400 border-green-500/30',
    error: 'bg-red-500/20 text-red-400 border-red-500/30',
    info: 'bg-blue-500/20 text-blue-400 border-blue-500/30'
  };
</script>

{#if show}
  <div class="toast-container" class:visible>
    <div class="toast {colors[type]}">
      <svelte:component this={icons[type]} class="w-4 h-4" />
      <span>{message}</span>
      <button class="close-btn" on:click={close}>
        <X class="w-3 h-3" />
      </button>
    </div>
  </div>
{/if}

<style>
  .toast-container {
    position: fixed;
    top: 60px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 200;
    opacity: 0;
    transition: opacity 0.3s ease;
    pointer-events: none;
  }

  .toast-container.visible {
    opacity: 1;
    pointer-events: auto;
  }

  .toast {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 16px;
    border-radius: 10px;
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border: 1px solid;
    font-size: 13px;
    font-weight: 500;
    white-space: nowrap;
    animation: slideDown 0.3s ease-out;
  }

  .close-btn {
    width: 20px;
    height: 20px;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: transparent;
    border: none;
    color: inherit;
    cursor: pointer;
    opacity: 0.7;
    transition: opacity 0.2s;
  }
  .close-btn:hover {
    opacity: 1;
  }

  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
</style>
