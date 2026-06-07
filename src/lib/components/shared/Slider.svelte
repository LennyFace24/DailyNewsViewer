<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  export let value: number = 0;
  export let min: number = 0;
  export let max: number = 100;
  export let step: number = 1;
  export let disabled: boolean = false;

  const dispatch = createEventDispatcher();

  function handleChange(e: Event) {
    const target = e.target as HTMLInputElement;
    value = Number(target.value);
    dispatch('change', { value });
  }
</script>

<div class="slider-container {disabled ? 'disabled' : ''}">
  <input
    type="range"
    {min}
    {max}
    {step}
    {value}
    {disabled}
    on:input={handleChange}
    class="slider"
  />
  <div class="slider-track">
    <div class="slider-fill" style="width: {((value - min) / (max - min)) * 100}%" />
  </div>
</div>

<style>
  .slider-container {
    position: relative;
    width: 100%;
    height: 20px;
    display: flex;
    align-items: center;
  }

  .slider-container.disabled {
    opacity: 0.5;
    pointer-events: none;
  }

  .slider {
    position: absolute;
    width: 100%;
    height: 100%;
    opacity: 0;
    cursor: pointer;
    z-index: 2;
  }

  .slider-track {
    width: 100%;
    height: 4px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 2px;
    overflow: hidden;
  }

  .slider-fill {
    height: 100%;
    background: rgba(255, 255, 255, 0.7);
    border-radius: 2px;
    transition: width 0.1s ease;
  }
</style>
