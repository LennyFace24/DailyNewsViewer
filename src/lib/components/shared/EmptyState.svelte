<script lang="ts">
  import { Bookmark, Newspaper, Compass, Settings } from 'lucide-svelte';

  export let icon: string = 'newspaper';
  export let title: string;
  export let description: string;
  export let actionLabel: string | undefined = undefined;
  export let onAction: (() => void) | undefined = undefined;

  const iconMap: Record<string, any> = {
    bookmark: Bookmark,
    newspaper: Newspaper,
    compass: Compass,
    settings: Settings
  };

  $: Icon = iconMap[icon] || Newspaper;
</script>

<div class="flex flex-col items-center justify-center py-20 px-6 text-center">
  <div class="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-4">
    <Icon class="w-8 h-8 text-muted-foreground" />
  </div>
  <h3 class="text-lg font-semibold mb-2">{title}</h3>
  <p class="text-sm text-muted-foreground max-w-xs">{description}</p>

  {#if actionLabel && onAction}
    <button class="action-btn mt-6" on:click={onAction}>
      {actionLabel}
    </button>
  {/if}
</div>

<style>
  .action-btn {
    padding: 10px 24px;
    border-radius: 100px;
    background: rgba(255, 255, 255, 0.1);
    color: white;
    font-size: 14px;
    font-weight: 500;
    border: none;
    cursor: pointer;
    transition: background 0.2s;
  }
  .action-btn:active {
    background: rgba(255, 255, 255, 0.2);
  }
</style>
