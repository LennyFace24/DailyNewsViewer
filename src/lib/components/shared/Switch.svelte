<script lang="ts">
  export let checked: boolean = false;
  export let disabled: boolean = false;
  export let size: 'sm' | 'md' = 'md';

  const sizes = {
    sm: { track: 'w-9 h-5', thumb: 'w-4 h-4', translate: 'translate-x-4' },
    md: { track: 'w-11 h-6', thumb: 'w-5 h-5', translate: 'translate-x-5' }
  };

  function toggle() {
    if (!disabled) {
      checked = !checked;
    }
  }
</script>

<button
  class="switch {sizes[size].track} {checked ? 'active' : ''} {disabled ? 'disabled' : ''}"
  on:click={toggle}
  role="switch"
  aria-checked={checked}
  {disabled}
>
  <span class="thumb {sizes[size].thumb} {checked ? sizes[size].translate : ''}" />
</button>

<style>
  .switch {
    position: relative;
    display: inline-flex;
    align-items: center;
    border-radius: 100px;
    background: rgba(255, 255, 255, 0.1);
    border: none;
    cursor: pointer;
    transition: background 0.2s;
    padding: 2px;
  }

  .switch.active {
    background: rgba(255, 255, 255, 0.25);
  }

  .switch.disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .switch:active:not(.disabled) {
    background: rgba(255, 255, 255, 0.15);
  }

  .thumb {
    background: white;
    border-radius: 50%;
    transition: transform 0.2s ease;
    transform: translateX(0);
  }
</style>
