<script lang="ts">
  import { AlertTriangle, RefreshCw } from 'lucide-svelte';
  import { Button } from '$lib/components/ui/button/index.js';

  export let error: Error | null = null;
  export let onRetry: (() => void) | undefined = undefined;

  function handleRetry() {
    error = null;
    onRetry?.();
  }
</script>

{#if error}
  <div class="flex flex-col items-center justify-center py-16 px-6 text-center">
    <div class="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mb-4">
      <AlertTriangle class="w-8 h-8 text-destructive" />
    </div>

    <h3 class="text-xl font-semibold text-foreground mb-2">出错了</h3>
    <p class="text-muted-foreground mb-2 max-w-sm">{error.message}</p>

    {#if onRetry}
      <Button variant="outline" on:click={handleRetry}>
        <RefreshCw class="w-4 h-4 mr-2" />
        重试
      </Button>
    {/if}
  </div>
{:else}
  <slot />
{/if}
