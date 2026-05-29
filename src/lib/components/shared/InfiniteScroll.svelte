<script lang="ts">
  import { onMount, onDestroy, createEventDispatcher } from 'svelte';

  export let threshold = 200;
  export let disabled = false;

  const dispatch = createEventDispatcher();

  let container: HTMLElement;
  let observer: IntersectionObserver;
  let sentinel: HTMLElement;

  onMount(() => {
    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && !disabled) {
            dispatch('loadMore');
          }
        });
      },
      {
        root: container,
        rootMargin: `${threshold}px`
      }
    );

    if (sentinel) {
      observer.observe(sentinel);
    }
  });

  onDestroy(() => {
    observer?.disconnect();
  });
</script>

<div bind:this={container} class="overflow-auto">
  <slot />

  <div bind:this={sentinel} class="h-1" />

  {#if disabled}
    <div class="flex justify-center py-4">
      <div class="flex gap-1">
        {#each Array(3) as _, i}
          <div
            class="w-2 h-2 bg-slate-600 rounded-full animate-bounce"
            style="animation-delay: {i * 100}ms"
          />
        {/each}
      </div>
    </div>
  {/if}
</div>
