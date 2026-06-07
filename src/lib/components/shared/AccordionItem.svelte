<script lang="ts">
  import { getContext } from 'svelte';
  import { slide } from 'svelte/transition';
  import { ChevronDown } from 'lucide-svelte';

  export let id: string;
  export let title: string;

  const { activeItems, toggle, isActive } = getContext('accordion') as {
    activeItems: any;
    toggle: (id: string) => void;
    isActive: (id: string) => boolean;
  };

  $: open = $activeItems.includes(id);
</script>

<div class="accordion-item" class:open>
  <button class="trigger" on:click={() => toggle(id)}>
    <span>{title}</span>
    <ChevronDown class="w-4 h-4 transition-transform duration-200 {open ? 'rotate-180' : ''}" />
  </button>

  {#if open}
    <div class="content" transition:slide={{ duration: 200 }}>
      <slot />
    </div>
  {/if}
</div>

<style>
  .accordion-item {
    border-radius: 12px;
    overflow: hidden;
    border: 1px solid rgba(255, 255, 255, 0.06);
  }

  .trigger {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    padding: 14px 16px;
    background: rgba(255, 255, 255, 0.03);
    color: white;
    font-size: 14px;
    font-weight: 500;
    border: none;
    cursor: pointer;
    transition: background 0.2s;
  }
  .trigger:active {
    background: rgba(255, 255, 255, 0.06);
  }

  .content {
    padding: 16px;
    background: rgba(255, 255, 255, 0.02);
  }
</style>
