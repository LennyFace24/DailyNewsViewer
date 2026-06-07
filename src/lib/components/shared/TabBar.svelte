<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  export let tabs: Array<{ id: string; label: string }> = [];
  export let activeTab: string = '';

  const dispatch = createEventDispatcher();

  function selectTab(id: string) {
    activeTab = id;
    dispatch('change', { id });
  }
</script>

<div class="tab-bar">
  {#each tabs as tab}
    <button
      class="tab-item {activeTab === tab.id ? 'active' : ''}"
      on:click={() => selectTab(tab.id)}
    >
      {tab.label}
    </button>
  {/each}
</div>

<style>
  .tab-bar {
    display: flex;
    gap: 4px;
    padding: 4px;
    background: rgba(255, 255, 255, 0.03);
    border-radius: 12px;
    border: 1px solid rgba(255, 255, 255, 0.05);
  }

  .tab-item {
    flex: 1;
    padding: 10px 16px;
    border-radius: 8px;
    font-size: 13px;
    font-weight: 500;
    color: rgba(255, 255, 255, 0.5);
    background: transparent;
    border: none;
    cursor: pointer;
    transition: all 0.2s;
    text-align: center;
  }

  .tab-item.active {
    background: rgba(255, 255, 255, 0.1);
    color: white;
  }

  .tab-item:active:not(.active) {
    background: rgba(255, 255, 255, 0.05);
  }
</style>
