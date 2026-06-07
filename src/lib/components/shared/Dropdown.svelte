<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { ChevronDown } from 'lucide-svelte';

  export let options: Array<{ value: string; label: string }> = [];
  export let value: string = '';
  export let placeholder: string = '请选择';

  const dispatch = createEventDispatcher();

  let isOpen = false;
  let selectedLabel = '';

  $: {
    const selected = options.find(o => o.value === value);
    selectedLabel = selected?.label || placeholder;
  }

  function select(option: { value: string; label: string }) {
    value = option.value;
    isOpen = false;
    dispatch('change', { value: option.value });
  }

  function toggle() {
    isOpen = !isOpen;
  }

  function handleClickOutside(e: MouseEvent) {
    const target = e.target as HTMLElement;
    if (!target.closest('.dropdown')) {
      isOpen = false;
    }
  }
</script>

<svelte:window on:click={handleClickOutside} />

<div class="dropdown">
  <button class="dropdown-trigger" on:click={toggle}>
    <span>{selectedLabel}</span>
    <ChevronDown class="w-4 h-4 transition-transform {isOpen ? 'rotate-180' : ''}" />
  </button>

  {#if isOpen}
    <div class="dropdown-menu">
      {#each options as option}
        <button
          class="dropdown-item {value === option.value ? 'active' : ''}"
          on:click={() => select(option)}
        >
          {option.label}
        </button>
      {/each}
    </div>
  {/if}
</div>

<style>
  .dropdown {
    position: relative;
  }

  .dropdown-trigger {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    width: 100%;
    padding: 10px 14px;
    border-radius: 10px;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    color: white;
    font-size: 14px;
    cursor: pointer;
    transition: all 0.2s;
  }
  .dropdown-trigger:active {
    background: rgba(255, 255, 255, 0.08);
  }

  .dropdown-menu {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    margin-top: 4px;
    padding: 4px;
    background: rgba(30, 30, 30, 0.95);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 10px;
    z-index: 50;
    max-height: 200px;
    overflow-y: auto;
    animation: fadeIn 0.15s ease;
  }

  .dropdown-item {
    display: block;
    width: 100%;
    padding: 10px 12px;
    border-radius: 6px;
    font-size: 14px;
    color: rgba(255, 255, 255, 0.7);
    background: transparent;
    border: none;
    cursor: pointer;
    text-align: left;
    transition: all 0.15s;
  }
  .dropdown-item:hover {
    background: rgba(255, 255, 255, 0.05);
    color: white;
  }
  .dropdown-item.active {
    background: rgba(255, 255, 255, 0.1);
    color: white;
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(-4px); }
    to { opacity: 1; transform: translateY(0); }
  }
</style>
