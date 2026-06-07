<script lang="ts">
  import { getContext } from 'svelte';

  export let value: string;

  const { activeTab, select } = getContext('tabs') as {
    activeTab: any;
    select: (tab: string) => void;
  };

  $: active = $activeTab === value;
</script>

<button
  class="tabs-trigger"
  class:active
  on:click={() => select(value)}
>
  <slot />
</button>

<style>
  .tabs-trigger {
    flex: 1;
    padding: 8px 16px;
    border-radius: 6px;
    background: transparent;
    border: none;
    color: rgba(255, 255, 255, 0.5);
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
  }

  .tabs-trigger:hover {
    color: rgba(255, 255, 255, 0.7);
  }

  .tabs-trigger.active {
    background: rgba(255, 255, 255, 0.1);
    color: white;
  }
</style>
