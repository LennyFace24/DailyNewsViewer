<script lang="ts">
  export let items: Array<{ label: string; href?: string; active?: boolean }> = [];
</script>

<nav class="menubar">
  {#each items as item}
    <a
      href={item.href || '#'}
      class="menubar-item"
      class:active={item.active}
    >
      {item.label}
    </a>
  {/each}
</nav>

<style>
  .menubar {
    display: flex;
    align-items: center;
    gap: 2px;
    padding: 4px;
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.06);
    border-radius: 8px;
  }

  .menubar-item {
    padding: 6px 12px;
    border-radius: 6px;
    font-size: 13px;
    color: rgba(255, 255, 255, 0.6);
    text-decoration: none;
    transition: all 0.2s;
  }

  .menubar-item:hover {
    background: rgba(255, 255, 255, 0.05);
    color: white;
  }

  .menubar-item.active {
    background: rgba(255, 255, 255, 0.1);
    color: white;
  }
</style>
