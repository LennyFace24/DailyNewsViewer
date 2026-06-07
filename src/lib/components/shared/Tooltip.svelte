<script lang="ts">
  export let text: string = '';
  export let position: 'top' | 'bottom' | 'left' | 'right' = 'top';

  let show = false;
  let timeout: ReturnType<typeof setTimeout>;

  function showTooltip() {
    timeout = setTimeout(() => {
      show = true;
    }, 300);
  }

  function hideTooltip() {
    clearTimeout(timeout);
    show = false;
  }
</script>

<div
  class="tooltip-wrapper"
  on:mouseenter={showTooltip}
  on:mouseleave={hideTooltip}
  on:focus={showTooltip}
  on:blur={hideTooltip}
  role="tooltip"
>
  <slot />

  {#if show && text}
    <div class="tooltip {position}">
      {text}
    </div>
  {/if}
</div>

<style>
  .tooltip-wrapper {
    position: relative;
    display: inline-flex;
  }

  .tooltip {
    position: absolute;
    z-index: 100;
    padding: 6px 12px;
    border-radius: 8px;
    background: rgba(0, 0, 0, 0.9);
    color: white;
    font-size: 12px;
    white-space: nowrap;
    pointer-events: none;
    animation: fadeIn 0.15s ease;
  }

  .tooltip.top {
    bottom: 100%;
    left: 50%;
    transform: translateX(-50%);
    margin-bottom: 8px;
  }

  .tooltip.bottom {
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    margin-top: 8px;
  }

  .tooltip.left {
    right: 100%;
    top: 50%;
    transform: translateY(-50%);
    margin-right: 8px;
  }

  .tooltip.right {
    left: 100%;
    top: 50%;
    transform: translateY(-50%);
    margin-left: 8px;
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
</style>
