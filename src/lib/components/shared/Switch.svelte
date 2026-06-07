<script lang="ts">
  export let checked: boolean = false;
  export let disabled: boolean = false;
</script>

<button
  class="switch {checked ? 'active' : ''}"
  {disabled}
  on:click
  role="switch"
  aria-checked={checked}
>
  <span class="thumb" />
</button>

<style>
  .switch {
    position: relative;
    width: 44px;
    height: 24px;
    border-radius: 12px;
    background: rgba(255, 255, 255, 0.1);
    border: none;
    cursor: pointer;
    transition: background 0.2s ease;
    padding: 2px;
    flex-shrink: 0;
  }

  .switch.active {
    background: rgba(255, 255, 255, 0.3);
  }

  .switch:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .switch:active:not(:disabled) {
    transform: scale(0.95);
  }

  .thumb {
    display: block;
    width: 20px;
    height: 20px;
    border-radius: 10px;
    background: white;
    transition: transform 0.2s ease;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
  }

  .switch.active .thumb {
    transform: translateX(20px);
  }
</style>
