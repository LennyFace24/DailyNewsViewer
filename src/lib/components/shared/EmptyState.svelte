<script lang="ts">
  import { Button } from '$lib/components/ui/button/index.js';

  export let icon: string = '📭';
  export let title: string;
  export let description: string;
  export let actionLabel: string | undefined = undefined;
  export let onAction: (() => void) | undefined = undefined;
</script>

<div class="flex flex-col items-center justify-center py-16 px-6 text-center">
  <div class="text-6xl mb-4">{icon}</div>
  <h3 class="text-xl font-semibold text-foreground mb-2">{title}</h3>
  <p class="text-muted-foreground mb-6 max-w-sm">{description}</p>

  {#if actionLabel && onAction}
    <Button on:click={onAction}>
      {actionLabel}
    </Button>
  {/if}
</div>
