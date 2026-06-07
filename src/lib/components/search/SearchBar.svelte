<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { Search, X } from 'lucide-svelte';

  export let value = '';
  export let placeholder = '搜索文章...';

  const dispatch = createEventDispatcher();

  let inputEl: HTMLInputElement;

  function handleInput() {
    dispatch('search', { query: value });
  }

  function handleClear() {
    value = '';
    dispatch('search', { query: '' });
    inputEl?.focus();
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Enter') {
      dispatch('search', { query: value });
    }
    if (e.key === 'Escape') {
      handleClear();
    }
  }
</script>

<div class="search-bar">
  <Search class="w-4 h-4 text-muted-foreground shrink-0" />
  <input
    bind:this={inputEl}
    bind:value
    {placeholder}
    type="text"
    class="search-input"
    on:input={handleInput}
    on:keydown={handleKeydown}
  />
  {#if value}
    <button class="clear-btn" on:click={handleClear}>
      <X class="w-4 h-4" />
    </button>
  {/if}
</div>

<style>
  .search-bar {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 14px;
    border-radius: 12px;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.08);
    transition: all 0.2s;
  }

  .search-bar:focus-within {
    border-color: rgba(255, 255, 255, 0.2);
    background: rgba(255, 255, 255, 0.08);
  }

  .search-input {
    flex: 1;
    background: transparent;
    border: none;
    outline: none;
    color: white;
    font-size: 14px;
  }

  .search-input::placeholder {
    color: rgba(255, 255, 255, 0.3);
  }

  .clear-btn {
    width: 24px;
    height: 24px;
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: rgba(255, 255, 255, 0.5);
    background: transparent;
    border: none;
    cursor: pointer;
    transition: all 0.2s;
  }

  .clear-btn:active {
    background: rgba(255, 255, 255, 0.1);
    color: white;
  }
</style>
