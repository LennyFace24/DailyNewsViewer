<script lang="ts">
  export let open = false;
  export let delay = 300;

  let timeout: ReturnType<typeof setTimeout>;
  let triggerEl: HTMLElement;

  function show() {
    timeout = setTimeout(() => {
      open = true;
    }, delay);
  }

  function hide() {
    clearTimeout(timeout);
    open = false;
  }
</script>

<div
  class="hover-card-wrapper"
  on:mouseenter={show}
  on:mouseleave={hide}
  bind:this={triggerEl}
>
  <slot name="trigger" />

  {#if open}
    <div class="hover-card glass-card">
      <slot />
    </div>
  {/if}
</div>

<style>
  .hover-card-wrapper {
    position: relative;
    display: inline-flex;
  }

  .hover-card {
    position: absolute;
    bottom: 100%;
    left: 50%;
    transform: translateX(-50%);
    margin-bottom: 8px;
    min-width: 200px;
    padding: 12px;
    z-index: 50;
    animation: fadeIn 0.15s ease;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateX(-50%) translateY(4px);
    }
    to {
      opacity: 1;
      transform: translateX(-50%) translateY(0);
    }
  }
</style>
