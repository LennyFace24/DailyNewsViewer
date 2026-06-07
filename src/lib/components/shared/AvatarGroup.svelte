<script lang="ts">
  export let max: number = 4;
  export let size: 'sm' | 'md' | 'lg' = 'md';

  const sizes = {
    sm: 'w-6 h-6 text-[10px]',
    md: 'w-8 h-8 text-xs',
    lg: 'w-10 h-10 text-sm'
  };

  let items: any[] = [];
  let remaining = 0;

  $: {
    items = $$restProps.items || [];
    remaining = Math.max(0, items.length - max);
  }
</script>

<div class="avatar-group">
  {#each items.slice(0, max) as item, i}
    <div
      class="avatar {sizes[size]}"
      style="z-index: {max - i}; margin-left: {i > 0 ? '-8px' : '0'}"
    >
      {#if item.avatar}
        <img src={item.avatar} alt={item.name || ''} />
      {:else}
        <span>{(item.name || '?')[0].toUpperCase()}</span>
      {/if}
    </div>
  {/each}

  {#if remaining > 0}
    <div
      class="avatar more {sizes[size]}"
      style="z-index: 0; margin-left: '-8px'"
    >
      <span>+{remaining}</span>
    </div>
  {/if}
</div>

<style>
  .avatar-group {
    display: flex;
    align-items: center;
  }

  .avatar {
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.1);
    border: 2px solid rgba(15, 15, 15, 1);
    overflow: hidden;
    flex-shrink: 0;
  }

  .avatar img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .avatar span {
    font-weight: 600;
    color: rgba(255, 255, 255, 0.7);
  }

  .avatar.more {
    background: rgba(255, 255, 255, 0.05);
  }
  .avatar.more span {
    color: rgba(255, 255, 255, 0.5);
    font-weight: 500;
  }
</style>
