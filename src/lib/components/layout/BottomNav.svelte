<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { page } from '$app/stores';
  import { Home, Bookmark, Compass, Settings, ChevronLeft } from 'lucide-svelte';

  const dispatch = createEventDispatcher();

  $: currentPath = $page.url.pathname;
  $: showBack = currentPath !== '/';

  const navItems = [
    { path: '/', icon: Home, label: '首页' },
    { path: '/discover', icon: Compass, label: '发现' },
    { path: '/bookmarks', icon: Bookmark, label: '收藏' },
    { path: '/settings', icon: Settings, label: '设置' }
  ];

  function handleBack() {
    dispatch('back');
  }
</script>

<nav class="fixed bottom-0 left-0 right-0 z-50 glass safe-area-bottom">
  <div class="flex items-center justify-around h-16 max-w-lg mx-auto px-2">
    <!-- 返回按钮 -->
    {#if showBack}
      <button
        class="flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-colors text-muted-foreground hover:text-foreground"
        on:click={handleBack}
      >
        <ChevronLeft class="w-5 h-5" />
        <span class="text-[10px] font-medium">返回</span>
      </button>
    {/if}

    {#each navItems as item}
      <a
        href={item.path}
        class="flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all duration-200
               {currentPath === item.path
                 ? 'text-foreground'
                 : 'text-muted-foreground hover:text-foreground'}"
      >
        <svelte:component this={item.icon} class="w-5 h-5 {currentPath === item.path ? 'accent-glow' : ''}" />
        <span class="text-[10px] font-medium">{item.label}</span>
        {#if currentPath === item.path}
          <div class="w-1 h-1 rounded-full bg-accent mt-0.5" />
        {/if}
      </a>
    {/each}
  </div>
</nav>
