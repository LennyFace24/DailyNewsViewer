<script lang="ts">
  import { slide } from 'svelte/transition';
  import { ChevronDown } from 'lucide-svelte';

  export let open = false;
  export let title = '';

  function toggle() {
    open = !open;
  }
</script>

<div class="collapsible">
  <button class="collapsible-trigger" on:click={toggle}>
    <span>{title}</span>
    <ChevronDown class="w-4 h-4 transition-transform {open ? 'rotate-180' : ''}" />
  </button>

  {#if open}
    <div class="collapsible-content" transition:slide={{ duration: 200 }}>
      <slot />
    </div>
  {/if}
</div>

<style>
  .collapsible {
    width: 100%;
  }

  .collapsible-trigger {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    padding: 12px 16px;
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.06);
    border-radius: 10px;
    color: rgba(255, 255, 255, 0.8);
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
  }
  .collapsible-trigger:hover {
    background: rgba(255, 255, 255, 0.05);
  }

  .collapsible-content {
    padding: 12px 16px;
    background: rgba(255, 255, 255, 0.02);
    border: 1px solid rgba(255, 255, 255, 0.04);
    border-top: none;
    border-radius: 0 0 10px 10px;
  }
</style>
