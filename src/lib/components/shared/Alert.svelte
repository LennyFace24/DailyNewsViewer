<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { Info, CheckCircle, AlertTriangle, X } from 'lucide-svelte';

  export let type: 'info' | 'success' | 'warning' | 'error' = 'info';
  export let title = '';
  export let message = '';
  export let dismissible = false;

  const dispatch = createEventDispatcher();

  let visible = true;

  function dismiss() {
    visible = false;
    dispatch('dismiss');
  }

  const config = {
    info: { icon: Info, color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
    success: { icon: CheckCircle, color: 'text-green-400', bg: 'bg-green-500/10', border: 'border-green-500/20' },
    warning: { icon: AlertTriangle, color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20' },
    error: { icon: AlertTriangle, color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20' }
  };

  $: ({ icon: Icon, color, bg, border } = config[type]);
</script>

{#if visible}
  <div class="alert {bg} {border}">
    <div class="alert-icon {color}">
      <svelte:component this={Icon} class="w-5 h-5" />
    </div>
    <div class="alert-content">
      {#if title}
        <div class="alert-title {color}">{title}</div>
      {/if}
      {#if message}
        <div class="alert-message">{message}</div>
      {/if}
    </div>
    {#if dismissible}
      <button class="alert-dismiss" on:click={dismiss}>
        <X class="w-4 h-4" />
      </button>
    {/if}
  </div>
{/if}

<style>
  .alert {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    padding: 14px 16px;
    border-radius: 12px;
    border: 1px solid;
    animation: slideDown 0.3s ease-out;
  }

  .alert-icon {
    flex-shrink: 0;
    margin-top: 1px;
  }

  .alert-content {
    flex: 1;
    min-width: 0;
  }

  .alert-title {
    font-size: 14px;
    font-weight: 600;
    margin-bottom: 2px;
  }

  .alert-message {
    font-size: 13px;
    color: rgba(255, 255, 255, 0.6);
    line-height: 1.5;
  }

  .alert-dismiss {
    flex-shrink: 0;
    width: 24px;
    height: 24px;
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: rgba(255, 255, 255, 0.4);
    background: transparent;
    border: none;
    cursor: pointer;
    transition: all 0.2s;
  }
  .alert-dismiss:active {
    background: rgba(255, 255, 255, 0.1);
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
