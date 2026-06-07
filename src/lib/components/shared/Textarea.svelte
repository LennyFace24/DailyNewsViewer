<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  export let value: string = '';
  export let placeholder: string = '';
  export let disabled: boolean = false;
  export let rows: number = 4;
  export let maxLength: number | undefined = undefined;

  const dispatch = createEventDispatcher();

  function handleInput(e: Event) {
    const target = e.target as HTMLTextAreaElement;
    value = target.value;
    dispatch('input', { value });
  }
</script>

<div class="textarea-wrapper">
  <textarea
    {value}
    {placeholder}
    {disabled}
    {rows}
    maxlength={maxLength}
    on:input={handleInput}
    class="textarea"
  />
  {#if maxLength}
    <span class="counter">
      {value.length}/{maxLength}
    </span>
  {/if}
</div>

<style>
  .textarea-wrapper {
    position: relative;
  }

  .textarea {
    width: 100%;
    padding: 12px 14px;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 10px;
    color: white;
    font-size: 14px;
    line-height: 1.6;
    resize: vertical;
    outline: none;
    transition: border-color 0.2s;
  }

  .textarea:focus {
    border-color: rgba(255, 255, 255, 0.2);
  }

  .textarea::placeholder {
    color: rgba(255, 255, 255, 0.3);
  }

  .textarea:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .counter {
    position: absolute;
    bottom: 8px;
    right: 12px;
    font-size: 11px;
    color: rgba(255, 255, 255, 0.3);
  }
</style>
