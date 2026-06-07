<script lang="ts">
  import { onMount } from 'svelte';
  import { ChevronLeft, ChevronRight } from 'lucide-svelte';

  export let show = false;
  export let direction: 'left' | 'right' = 'right';

  let visible = false;
  let timer: ReturnType<typeof setTimeout>;

  $: if (show) {
    visible = true;
    clearTimeout(timer);
    timer = setTimeout(() => {
      visible = false;
    }, 2000);
  }

  onMount(() => {
    return () => clearTimeout(timer);
  });
</script>

{#if visible}
  <div class="swipe-hint" class:left={direction === 'left'} class:right={direction === 'right'}>
    <div class="hint-icon">
      {#if direction === 'left'}
        <ChevronLeft class="w-5 h-5" />
      {:else}
        <ChevronRight class="w-5 h-5" />
      {/if}
    </div>
  </div>
{/if}

<style>
  .swipe-hint {
    position: fixed;
    top: 50%;
    transform: translateY(-50%);
    z-index: 100;
    pointer-events: none;
    animation: fadeInOut 2s ease-in-out;
  }

  .swipe-hint.left {
    left: 8px;
  }

  .swipe-hint.right {
    right: 8px;
  }

  .hint-icon {
    width: 36px;
    height: 72px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    border-radius: 8px;
    color: rgba(255, 255, 255, 0.6);
    border: 1px solid rgba(255, 255, 255, 0.1);
  }

  @keyframes fadeInOut {
    0% { opacity: 0; transform: translateY(-50%) scale(0.8); }
    20% { opacity: 1; transform: translateY(-50%) scale(1); }
    80% { opacity: 1; transform: translateY(-50%) scale(1); }
    100% { opacity: 0; transform: translateY(-50%) scale(0.8); }
  }
</style>
