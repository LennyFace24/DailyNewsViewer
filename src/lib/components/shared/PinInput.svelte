<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  export let length: number = 4;
  export let value: string = '';
  export let type: 'text' | 'password' = 'text';

  const dispatch = createEventDispatcher();

  let inputs: HTMLInputElement[] = [];

  function handleInput(index: number, e: Event) {
    const target = e.target as HTMLInputElement;
    const val = target.value;

    if (val.length === 1) {
      value = value.substring(0, index) + val + value.substring(index + 1);
      if (index < length - 1) {
        inputs[index + 1]?.focus();
      }
      dispatch('change', { value });
    }
  }

  function handleKeydown(index: number, e: KeyboardEvent) {
    if (e.key === 'Backspace' && !value[index] && index > 0) {
      inputs[index - 1]?.focus();
    }
  }

  function handlePaste(e: ClipboardEvent) {
    e.preventDefault();
    const text = e.clipboardData?.getData('text') || '';
    value = text.slice(0, length);
    dispatch('change', { value });
    inputs[Math.min(value.length, length - 1)]?.focus();
  }
</script>

<div class="pin-input" on:paste={handlePaste}>
  {#each Array(length) as _, i}
    <input
      bind:this={inputs[i]}
      type={type}
      maxlength="1"
      value={value[i] || ''}
      on:input={(e) => handleInput(i, e)}
      on:keydown={(e) => handleKeydown(i, e)}
      class="pin-field"
      class:filled={value[i]}
    />
  {/each}
</div>

<style>
  .pin-input {
    display: flex;
    gap: 12px;
  }

  .pin-field {
    width: 48px;
    height: 56px;
    text-align: center;
    font-size: 20px;
    font-weight: 600;
    background: rgba(255, 255, 255, 0.05);
    border: 2px solid rgba(255, 255, 255, 0.1);
    border-radius: 12px;
    color: white;
    outline: none;
    transition: all 0.2s;
  }

  .pin-field:focus {
    border-color: rgba(255, 255, 255, 0.3);
    background: rgba(255, 255, 255, 0.08);
  }

  .pin-field.filled {
    border-color: rgba(255, 255, 255, 0.2);
  }
</style>
