<script lang="ts">
  import { setContext } from 'svelte';
  import { writable } from 'svelte/store';

  export let multiple = false;

  const activeItems = writable<string[]>([]);

  setContext('accordion', {
    activeItems,
    toggle: (id: string) => {
      activeItems.update(items => {
        if (multiple) {
          return items.includes(id) ? items.filter(i => i !== id) : [...items, id];
        }
        return items.includes(id) ? [] : [id];
      });
    },
    isActive: (id: string) => {
      let active = false;
      activeItems.subscribe(items => {
        active = items.includes(id);
      })();
      return active;
    }
  });
</script>

<div class="accordion">
  <slot />
</div>

<style>
  .accordion {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }
</style>
