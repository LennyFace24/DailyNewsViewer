<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  export let pressed = false;
  export let disabled = false;

  const dispatch = createEventDispatcher();

  function toggle() {
    if (disabled) return;
    pressed = !pressed;
    dispatch('change', { pressed });
  }
</script>

<button
  class="toggle"
  class:pressed
  class:disabled
  on:click={toggle}
  {disabled}
  aria-pressed={pressed}
>
  <slot />
</button>

<style>
  .toggle {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 8px 16px;
    border-radius: 8px;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    color: rgba(255, 255, 255, 0.6);
    font-size: 13px;
    cursor: pointer;
    transition: all 0.2s;
  }

  .toggle:hover:not(.disabled) {
    background: rgba(255, 255, 255, 0.08);
  }

  .toggle.pressed {
    background: rgba(255, 255, 255, 0.15);
    border-color: rgba(255, 255, 255, 0.2);
    color: white;
  }

  .toggle.disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
</style>
