<script lang="ts">
  import { getContext } from 'svelte';
  import { fade } from 'svelte/transition';

  export let value: string;

  const { activeTab } = getContext('tabs') as {
    activeTab: any;
  };

  $: active = $activeTab === value;
</script>

{#if active}
  <div class="tabs-content" transition:fade={{ duration: 150 }}>
    <slot />
  </div>
{/if}

<style>
  .tabs-content {
    animation: fadeIn 0.15s ease;
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
</style>
