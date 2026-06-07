<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { X } from 'lucide-svelte';

  export let open = false;
  export let title = '';
  export let description = '';
  export let size: 'sm' | 'md' | 'lg' = 'md';

  const dispatch = createEventDispatcher();

  let isClosing = false;

  function close() {
    isClosing = true;
    setTimeout(() => {
      open = false;
      isClosing = false;
      dispatch('close');
    }, 200);
  }

  const sizes = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg'
  };
</script>

{#if open}
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <div class="dialog-overlay" class:fade-out={isClosing} on:click={close}>
    <div
      class="dialog-content glass-card {sizes[size]}"
      class:scale-out={isClosing}
      on:click|stopPropagation
    >
      {#if title || $$slots.header}
        <div class="dialog-header">
          <slot name="header">
            <div>
              <h3 class="dialog-title">{title}</h3>
              {#if description}
                <p class="dialog-description">{description}</p>
              {/if}
            </div>
          </slot>
          <button class="close-btn" on:click={close}>
            <X class="w-5 h-5" />
          </button>
        </div>
      {/if}

      <div class="dialog-body">
        <slot />
      </div>

      {#if $$slots.footer}
        <div class="dialog-footer">
          <slot name="footer" />
        </div>
      {/if}
    </div>
  </div>
{/if}

<style>
  .dialog-overlay {
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

  .dialog-content {
    width: 100%;
    animation: scaleIn 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  }

  .fade-out {
    animation: fadeOut 0.2s ease-out forwards;
  }

  .scale-out {
    animation: scaleOut 0.2s ease-out forwards;
  }

  .dialog-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    padding: 20px 20px 0;
  }

  .dialog-title {
    font-size: 18px;
    font-weight: 600;
  }

  .dialog-description {
    font-size: 14px;
    color: rgba(255, 255, 255, 0.5);
    margin-top: 4px;
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
    flex-shrink: 0;
  }
  .close-btn:active {
    background: rgba(255, 255, 255, 0.1);
  }

  .dialog-body {
    padding: 16px 20px;
  }

  .dialog-footer {
    display: flex;
    gap: 12px;
    padding: 16px 20px 20px;
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
