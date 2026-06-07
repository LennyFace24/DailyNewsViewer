<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  export let open = false;
  export let x = 0;
  export let y = 0;

  const dispatch = createEventDispatcher();

  function close() {
    open = false;
    dispatch('close');
  }

  function handleClickOutside(e: MouseEvent) {
    if (!(e.target as HTMLElement).closest('.context-menu')) {
      close();
    }
  }
</script>

<svelte:window on:click={handleClickOutside} />

{#if open}
  <div
    class="context-menu glass-card"
    style="left: {x}px; top: {y}px"
    role="menu"
  >
    <slot />
  </div>
{/if}

<style>
  .context-menu {
    position: fixed;
    z-index: 100;
    min-width: 160px;
    padding: 6px;
    animation: fadeIn 0.15s ease;
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: scale(0.95); }
    to { opacity: 1; transform: scale(1); }
  }

  :global(.context-menu-item) {
    display: flex;
    align-items: center;
    gap: 10px;
    width: 100%;
    padding: 8px 12px;
    border-radius: 6px;
    background: transparent;
    border: none;
    color: rgba(255, 255, 255, 0.7);
    font-size: 13px;
    cursor: pointer;
    transition: all 0.15s;
    text-align: left;
  }

  :global(.context-menu-item:hover) {
    background: rgba(255, 255, 255, 0.08);
    color: white;
  }

  :global(.context-menu-separator) {
    height: 1px;
    background: rgba(255, 255, 255, 0.06);
    margin: 4px 0;
  }
</style>
