<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { RefreshCw } from 'lucide-svelte';

  export let threshold = 80;

  const dispatch = createEventDispatcher();

  let startY = 0;
  let currentY = 0;
  let isPulling = false;
  let isRefreshing = false;
  let pullDistance = 0;
  let container: HTMLElement;

  function handleTouchStart(e: TouchEvent) {
    if (container.scrollTop > 0) return;
    startY = e.touches[0].clientY;
    isPulling = true;
  }

  function handleTouchMove(e: TouchEvent) {
    if (!isPulling) return;

    currentY = e.touches[0].clientY;
    pullDistance = Math.max(0, currentY - startY);

    if (pullDistance > 0) {
      e.preventDefault();
    }
  }

  function handleTouchEnd() {
    if (!isPulling) return;

    if (pullDistance >= threshold && !isRefreshing) {
      isRefreshing = true;
      dispatch('refresh');
      setTimeout(() => {
        isRefreshing = false;
      }, 2000);
    }

    isPulling = false;
    pullDistance = 0;
  }

  $: progress = Math.min(pullDistance / threshold, 1);
  $: shouldRefresh = pullDistance >= threshold;
</script>

<div
  bind:this={container}
  class="relative overflow-auto"
  on:touchstart={handleTouchStart}
  on:touchmove={handleTouchMove}
  on:touchend={handleTouchEnd}
>
  <!-- 下拉指示器 -->
  <div
    class="flex items-center justify-center transition-all duration-300 ease-out overflow-hidden"
    style="height: {isPulling || isRefreshing ? pullDistance : 0}px"
  >
    <div
      class="transition-transform duration-200"
      style="transform: rotate({progress * 360}deg)"
    >
      <RefreshCw
        class="w-6 h-6 transition-colors
               {shouldRefresh ? 'text-primary-400' : 'text-slate-500'}
               {isRefreshing ? 'animate-spin' : ''}"
      />
    </div>
  </div>

  <slot />
</div>
