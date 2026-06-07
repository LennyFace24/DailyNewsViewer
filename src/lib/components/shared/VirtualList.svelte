<script lang="ts">
  import { onMount, onDestroy, createEventDispatcher } from 'svelte';

  export let items: any[] = [];
  export let itemHeight: number = 200;
  export let buffer: number = 5;

  const dispatch = createEventDispatcher();

  let containerEl: HTMLElement;
  let scrollTop = 0;
  let containerHeight = 0;
  let resizeObserver: ResizeObserver;

  $: startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - buffer);
  $: endIndex = Math.min(items.length, Math.ceil((scrollTop + containerHeight) / itemHeight) + buffer);
  $: visibleItems = items.slice(startIndex, endIndex).map((item, i) => ({
    ...item,
    _index: startIndex + i
  }));
  $: totalHeight = items.length * itemHeight;
  $: offsetY = startIndex * itemHeight;

  onMount(() => {
    resizeObserver = new ResizeObserver((entries) => {
      containerHeight = entries[0].contentRect.height;
    });
    resizeObserver.observe(containerEl);
  });

  onDestroy(() => {
    resizeObserver?.disconnect();
  });

  function handleScroll(e: Event) {
    const target = e.target as HTMLElement;
    scrollTop = target.scrollTop;
    dispatch('scroll', { scrollTop });
  }
</script>

<div
  bind:this={containerEl}
  class="virtual-list"
  on:scroll={handleScroll}
>
  <div class="virtual-list-spacer" style="height: {totalHeight}px">
    <div class="virtual-list-content" style="transform: translateY({offsetY}px)">
      {#each visibleItems as item (item.id || item._index)}
        <div class="virtual-list-item" style="height: {itemHeight}px">
          <slot {item} index={item._index} />
        </div>
      {/each}
    </div>
  </div>
</div>

<style>
  .virtual-list {
    height: 100%;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
  }

  .virtual-list-spacer {
    position: relative;
    width: 100%;
  }

  .virtual-list-content {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
  }

  .virtual-list-item {
    overflow: hidden;
  }
</style>
