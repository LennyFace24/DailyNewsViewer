<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  export let type: 'single' | 'multiple' = 'single';
  export let value: string | string[] = type === 'single' ? '' : [];

  const dispatch = createEventDispatcher();

  function handleClick(itemValue: string) {
    if (type === 'single') {
      value = value === itemValue ? '' : itemValue;
      dispatch('change', { value });
    } else {
      const arr = Array.isArray(value) ? [...value] : [];
      const idx = arr.indexOf(itemValue);
      if (idx >= 0) {
        arr.splice(idx, 1);
      } else {
        arr.push(itemValue);
      }
      value = arr;
      dispatch('change', { value: arr });
    }
  }

  function isSelected(itemValue: string): boolean {
    if (type === 'single') return value === itemValue;
    return Array.isArray(value) && value.includes(itemValue);
  }
</script>

<div class="toggle-group" role="group">
  <slot {handleClick} {isSelected} />
</div>

<style>
  .toggle-group {
    display: inline-flex;
    gap: 4px;
    padding: 4px;
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.06);
    border-radius: 10px;
  }
</style>
