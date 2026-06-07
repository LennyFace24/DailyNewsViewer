<script lang="ts">
  import { createEventDispatcher, setContext } from 'svelte';
  import { writable } from 'svelte/store';

  export let value: string = '';

  const dispatch = createEventDispatcher();
  const activeTab = writable(value);

  $: $activeTab = value;

  setContext('tabs', {
    activeTab,
    select: (tab: string) => {
      value = tab;
      activeTab.set(tab);
      dispatch('change', { value: tab });
    }
  });
</script>

<div class="tabs">
  <slot />
</div>

<style>
  .tabs {
    display: flex;
    flex-direction: column;
  }
</style>
