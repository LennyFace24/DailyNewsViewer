<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { AlertTriangle, X } from 'lucide-svelte';

  export let open = false;
  export let title = '确认操作';
  export let message = '确定要执行此操作吗？';
  export let confirmText = '确定';
  export let cancelText = '取消';
  export let type: 'danger' | 'warning' | 'info' = 'warning';

  const dispatch = createEventDispatcher();

  let isClosing = false;

  function close() {
    isClosing = true;
    setTimeout(() => {
      open = false;
      isClosing = false;
    }, 200);
  }

  function confirm() {
    dispatch('confirm');
    close();
  }

  function cancel() {
    dispatch('cancel');
    close();
  }

  const iconColors = {
    danger: 'text-red-400',
    warning: 'text-yellow-400',
    info: 'text-blue-400'
  };

  const buttonColors = {
    danger: 'bg-red-500/20 hover:bg-red-500/30 text-red-400',
    warning: 'bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-400',
    info: 'bg-blue-500/20 hover:bg-blue-500/30 text-blue-400'
  };
</script>

{#if open}
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <div class="modal-overlay" class:fade-out={isClosing} on:click={cancel}>
    <div class="modal-box glass-card" class:scale-out={isClosing} on:click|stopPropagation>
      <div class="modal-header">
        <div class="icon-box {iconColors[type]}">
          <AlertTriangle class="w-6 h-6" />
        </div>
        <button class="close-btn" on:click={cancel}>
          <X class="w-5 h-5" />
        </button>
      </div>

      <div class="modal-content">
        <h3 class="modal-title">{title}</h3>
        <p class="modal-message">{message}</p>
      </div>

      <div class="modal-actions">
        <button class="cancel-btn" on:click={cancel}>
          {cancelText}
        </button>
        <button class="confirm-btn {buttonColors[type]}" on:click={confirm}>
          {confirmText}
        </button>
      </div>
    </div>
  </div>
{/if}

<style>
  .modal-overlay {
    position: fixed;
    inset: 0;
    z-index: 200;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 24px;
    background: rgba(0, 0, 0, 0.7);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    animation: fadeIn 0.2s ease-out;
  }

  .modal-box {
    width: 100%;
    max-width: 380px;
    animation: scaleIn 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  }

  .fade-out {
    animation: fadeOut 0.2s ease-out forwards;
  }

  .scale-out {
    animation: scaleOut 0.2s ease-out forwards;
  }

  .modal-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20px 20px 0;
  }

  .icon-box {
    width: 48px;
    height: 48px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(255, 255, 255, 0.05);
  }

  .close-btn {
    width: 32px;
    height: 32px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: rgba(255, 255, 255, 0.5);
    background: transparent;
    border: none;
    cursor: pointer;
  }
  .close-btn:active {
    background: rgba(255, 255, 255, 0.1);
  }

  .modal-content {
    padding: 16px 20px;
  }

  .modal-title {
    font-size: 18px;
    font-weight: 600;
    margin-bottom: 8px;
  }

  .modal-message {
    font-size: 14px;
    color: rgba(255, 255, 255, 0.6);
    line-height: 1.5;
  }

  .modal-actions {
    display: flex;
    gap: 12px;
    padding: 16px 20px 20px;
  }

  .cancel-btn {
    flex: 1;
    padding: 12px;
    border-radius: 10px;
    background: rgba(255, 255, 255, 0.08);
    color: rgba(255, 255, 255, 0.7);
    font-size: 14px;
    font-weight: 500;
    border: none;
    cursor: pointer;
    transition: all 0.2s;
  }
  .cancel-btn:active {
    background: rgba(255, 255, 255, 0.12);
  }

  .confirm-btn {
    flex: 1;
    padding: 12px;
    border-radius: 10px;
    font-size: 14px;
    font-weight: 500;
    border: none;
    cursor: pointer;
    transition: all 0.2s;
  }
  .confirm-btn:active {
    transform: scale(0.98);
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @keyframes fadeOut {
    from { opacity: 1; }
    to { opacity: 0; }
  }

  @keyframes scaleIn {
    from { opacity: 0; transform: scale(0.95); }
    to { opacity: 1; transform: scale(1); }
  }

  @keyframes scaleOut {
    from { opacity: 1; transform: scale(1); }
    to { opacity: 0; transform: scale(0.95); }
  }
</style>
