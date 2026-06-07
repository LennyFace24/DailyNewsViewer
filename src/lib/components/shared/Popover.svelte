<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { fade } from 'svelte/transition';

  export let open = false;
  export let placement: 'top' | 'bottom' | 'left' | 'right' = 'bottom';

  const dispatch = createEventDispatcher();

  function close() {
    open = false;
    dispatch('close');
  }

  function handleClickOutside(e: MouseEvent) {
    const target = e.target as HTMLElement;
    if (!target.closest('.popover-wrapper')) {
      close();
    }
  }
</script>

<svelte:window on:click={handleClickOutside} />

<div class="popover-wrapper">
  <slot name="trigger" />

  {#if open}
    <div
      class="popover {placement}"
      transition:fade={{ duration: 150 }}
      role="tooltip"
    >
      <slot />
    </div>
  {/if}
</div>

<style>
  .popover-wrapper {
    position: relative;
    display: inline-flex;
  }

  .popover {
    position: absolute;
    z-index: 50;
    min-width: 160px;
    padding: 8px;
    background: rgba(30, 30, 30, 0.95);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 12px;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
  }

  .popover.top {
    bottom: 100%;
    left: 50%;
    transform: translateX(-50%);
    margin-bottom: 8px;
  }

  .popover.bottom {
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    margin-top: 8px;
  }

  .popover.left {
    right: 100%;
    top: 50%;
    transform: translateY(-50%);
    margin-right: 8px;
  }

  .popover.right {
    left: 100%;
    top: 50%;
    transform: translateY(-50%);
    margin-left: 8px;
  }
</style>
