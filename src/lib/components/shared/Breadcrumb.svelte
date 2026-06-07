<script lang="ts">
  import { ChevronRight } from 'lucide-svelte';
  import { goto } from '$app/navigation';

  export let items: Array<{ label: string; href?: string }> = [];
</script>

<nav class="breadcrumb" aria-label="面包屑导航">
  {#each items as item, i}
    {#if i > 0}
      <ChevronRight class="separator w-3.5 h-3.5" />
    {/if}

    {#if item.href && i < items.length - 1}
      <a href={item.href} class="link">{item.label}</a>
    {:else}
      <span class="current">{item.label}</span>
    {/if}
  {/each}
</nav>

<style>
  .breadcrumb {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
  }

  .separator {
    color: rgba(255, 255, 255, 0.2);
  }

  .link {
    font-size: 13px;
    color: rgba(255, 255, 255, 0.5);
    text-decoration: none;
    transition: color 0.2s;
  }
  .link:hover {
    color: white;
  }

  .current {
    font-size: 13px;
    color: white;
    font-weight: 500;
  }
</style>
