<script lang="ts">
  export let value: string;
  export let selected = false;
  export let disabled = false;
</script>

<button
  class="toggle-item"
  class:selected
  class:disabled
  {disabled}
  on:click
>
  <slot />
</button>

<style>
  .toggle-item {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 8px 16px;
    border-radius: 6px;
    background: transparent;
    color: rgba(255, 255, 255, 0.5);
    font-size: 13px;
    font-weight: 500;
    border: none;
    cursor: pointer;
    transition: all 0.2s;
    white-space: nowrap;
  }

  .toggle-item:hover:not(.disabled) {
    background: rgba(255, 255, 255, 0.05);
  }

  .toggle-item.selected {
    background: rgba(255, 255, 255, 0.12);
    color: white;
  }

  .toggle-item.disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
</style>
