<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { Minus, Plus } from 'lucide-svelte';

  export let value: number = 0;
  export let min: number = 0;
  export let max: number = 100;
  export let step: number = 1;
  export let disabled: boolean = false;

  const dispatch = createEventDispatcher();

  function decrement() {
    if (disabled) return;
    value = Math.max(min, value - step);
    dispatch('change', { value });
  }

  function increment() {
    if (disabled) return;
    value = Math.min(max, value + step);
    dispatch('change', { value });
  }

  function handleInput(e: Event) {
    const target = e.target as HTMLInputElement;
    const val = parseInt(target.value);
    if (!isNaN(val)) {
      value = Math.max(min, Math.min(max, val));
      dispatch('change', { value });
    }
  }
</script>

<div class="number-input" class:disabled>
  <button class="btn" on:click={decrement} {disabled}>
    <Minus class="w-4 h-4" />
  </button>
  <input
    type="number"
    {value}
    {min}
    {max}
    {step}
    {disabled}
    on:input={handleInput}
  />
  <button class="btn" on:click={increment} {disabled}>
    <Plus class="w-4 h-4" />
  </button>
</div>

<style>
  .number-input {
    display: inline-flex;
    align-items: center;
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 8px;
    overflow: hidden;
  }

  .number-input.disabled {
    opacity: 0.5;
    pointer-events: none;
  }

  .btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    background: transparent;
    border: none;
    color: rgba(255, 255, 255, 0.6);
    cursor: pointer;
    transition: all 0.2s;
  }
  .btn:hover {
    background: rgba(255, 255, 255, 0.05);
    color: white;
  }

  input {
    width: 48px;
    text-align: center;
    background: transparent;
    border: none;
    color: white;
    font-size: 14px;
    font-weight: 500;
    outline: none;
    -moz-appearance: textfield;
  }
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
</style>
