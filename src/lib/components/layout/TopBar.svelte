<script lang="ts">
  import { Search, Bell, RefreshCw } from 'lucide-svelte';
  import { Button } from '$lib/components/ui/button/index.js';
  import { isLoading } from '$lib/stores/articles';

  export let title = 'DailyTech';
  export let showRefresh = true;

  async function handleRefresh() {
    window.dispatchEvent(new CustomEvent('refresh'));
  }
</script>

<header class="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b safe-area-top">
  <div class="flex items-center justify-between px-4 h-14">
    <div class="flex items-center gap-3">
      <h1 class="text-xl font-bold bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent">
        {title}
      </h1>
    </div>

    <div class="flex items-center gap-1">
      {#if showRefresh}
        <Button
          variant="ghost"
          size="icon"
          disabled={$isLoading}
          on:click={handleRefresh}
        >
          <RefreshCw class="w-5 h-5 {$isLoading ? 'animate-spin' : ''}" />
        </Button>
      {/if}

      <Button variant="ghost" size="icon" class="relative">
        <Bell class="w-5 h-5" />
        <span class="absolute top-1.5 right-1.5 w-2 h-2 bg-destructive rounded-full" />
      </Button>
    </div>
  </div>
</header>
