<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  export let open = false;
  export let side: 'top' | 'right' | 'bottom' | 'left' = 'bottom';
  export let title = '';

  const dispatch = createEventDispatcher();

  let isClosing = false;

  function close() {
    isClosing = true;
    setTimeout(() => {
      open = false;
      isClosing = false;
      dispatch('close');
    }, 300);
  }

  function handleOverlayClick(e: MouseEvent) {
    if ((e.target as HTMLElement).classList.contains('sheet-overlay')) {
      close();
    }
  }
</script>

{#if open}
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <div class="sheet-overlay" class:closing={isClosing} on:click={handleOverlayClick}>
    <div class="sheet {side}" class:closing={isClosing}>
      {#if title}
        <div class="sheet-header">
          <h3>{title}</h3>
          <button class="close-btn" on:click={close}>✕</button>
        </div>
      {/if}
      <div class="sheet-content">
        <slot />
      </div>
    </div>
  </div>
{/if}

<style>
  .sheet-overlay {
    position: fixed;
    inset: 0;
    z-index: 200;
    background: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(4px);
    -webkit-backdrop-filter: blur(4px);
    animation: fadeIn 0.2s ease;
  }
  .sheet-overlay.closing {
    animation: fadeOut 0.3s ease forwards;
  }

  .sheet {
    position: fixed;
    background: rgba(20, 20, 20, 0.95);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.08);
    overflow-y: auto;
  }

  .sheet.bottom {
    bottom: 0;
    left: 0;
    right: 0;
    max-height: 90vh;
    border-radius: 20px 20px 0 0;
    animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  }
  .sheet.bottom.closing {
    animation: slideDown 0.3s ease forwards;
  }

  .sheet.top {
    top: 0;
    left: 0;
    right: 0;
    max-height: 90vh;
    border-radius: 0 0 20px 20px;
    animation: slideDown 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  }
  .sheet.top.closing {
    animation: slideUp 0.3s ease forwards;
  }

  .sheet.left {
    top: 0;
    left: 0;
    bottom: 0;
    width: 80%;
    max-width: 320px;
    border-radius: 0 16px 16px 0;
    animation: slideRight 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  }
  .sheet.left.closing {
    animation: slideLeft 0.3s ease forwards;
  }

  .sheet.right {
    top: 0;
    right: 0;
    bottom: 0;
    width: 80%;
    max-width: 320px;
    border-radius: 16px 0 0 16px;
    animation: slideLeft 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  }
  .sheet.right.closing {
    animation: slideRight 0.3s ease forwards;
  }

  .sheet-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20px 20px 0;
  }
  .sheet-header h3 {
    font-size: 18px;
    font-weight: 600;
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
    font-size: 18px;
  }
  .close-btn:active {
    background: rgba(255, 255, 255, 0.1);
  }

  .sheet-content {
    padding: 20px;
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  @keyframes fadeOut {
    from { opacity: 1; }
    to { opacity: 0; }
  }
  @keyframes slideUp {
    from { transform: translateY(100%); }
    to { transform: translateY(0); }
  }
  @keyframes slideDown {
    from { transform: translateY(-100%); }
    to { transform: translateY(0); }
  }
  @keyframes slideLeft {
    from { transform: translateX(100%); }
    to { transform: translateX(0); }
  }
  @keyframes slideRight {
    from { transform: translateX(-100%); }
    to { transform: translateX(0); }
  }
</style>
