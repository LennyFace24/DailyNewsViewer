<script lang="ts">
  export let selected: boolean = false;
  export let variant: 'default' | 'outline' = 'default';

  function handleClick() {
    selected = !selected;
  }
</script>

<button
  class="chip {variant} {selected ? 'selected' : ''}"
  on:click={handleClick}
>
  <slot />
</button>

<style>
  .chip {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 8px 16px;
    border-radius: 100px;
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
    white-space: nowrap;
    border: 1px solid transparent;
  }

  .chip.default {
    background: rgba(255, 255, 255, 0.05);
    color: rgba(255, 255, 255, 0.6);
    border-color: rgba(255, 255, 255, 0.08);
  }

  .chip.default.selected {
    background: rgba(255, 255, 255, 0.15);
    color: white;
    border-color: rgba(255, 255, 255, 0.2);
  }

  .chip.outline {
    background: transparent;
    color: rgba(255, 255, 255, 0.6);
    border-color: rgba(255, 255, 255, 0.2);
  }

  .chip.outline.selected {
    background: rgba(255, 255, 255, 0.1);
    color: white;
    border-color: rgba(255, 255, 255, 0.3);
  }

  .chip:active {
    transform: scale(0.97);
  }
</style>
