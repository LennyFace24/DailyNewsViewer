<script lang="ts">
  import { onMount } from 'svelte';
  import { ChevronLeft, ChevronRight } from 'lucide-svelte';

  export let show = false;
  export let direction: 'left' | 'right' = 'right';

  let visible = false;

  onMount(() => {
    if (show) {
      visible = true;
      setTimeout(() => {
        visible = false;
      }, 2000);
    }
  });

  $: if (show) {
    visible = true;
    setTimeout(() => {
      visible = false;
    }, 2000);
  }
</script>

{#if visible}
  <div class="gesture-hint" class:left={direction === 'left'} class:right={direction === 'right'}>
    {#if direction === 'left'}
      <ChevronLeft class="w-6 h-6" />
    {:else}
      <ChevronRight class="w-6 h-6" />
    {/if}
  </div>
{/if}

<style>
  .gesture-hint {
    position: fixed;
    top: 50%;
    transform: translateY(-50%);
    width: 40px;
    height: 80px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    border-radius: 8px;
    color: rgba(255, 255, 255, 0.6);
    z-index: 100;
    animation: fadeInOut 2s ease-in-out;
    pointer-events: none;
  }

  .gesture-hint.left {
    left: 8px;
  }

  .gesture-hint.right {
    right: 8px;
  }

  @keyframes fadeInOut {
    0% { opacity: 0; transform: translateY(-50%) scale(0.8); }
    20% { opacity: 1; transform: translateY(-50%) scale(1); }
    80% { opacity: 1; transform: translateY(-50%) scale(1); }
    100% { opacity: 0; transform: translateY(-50%) scale(0.8); }
  }
</style>
