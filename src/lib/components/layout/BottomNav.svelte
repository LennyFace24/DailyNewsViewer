<script lang="ts">
  import { page } from '$app/stores';
  import { Home, Bookmark, Compass, Settings } from 'lucide-svelte';

  $: currentPath = $page.url.pathname;

  const navItems = [
    { path: '/', icon: Home, label: '首页' },
    { path: '/discover', icon: Compass, label: '发现' },
    { path: '/bookmarks', icon: Bookmark, label: '收藏' },
    { path: '/settings', icon: Settings, label: '设置' }
  ];
</script>

<nav class="fixed bottom-0 left-0 right-0 z-50 glass safe-area-bottom">
  <div class="flex items-center justify-around h-16 max-w-lg mx-auto px-4">
    {#each navItems as item}
      <a
        href={item.path}
        class="flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-colors
               {currentPath === item.path
                 ? 'text-foreground'
                 : 'text-muted-foreground hover:text-foreground'}"
      >
        <svelte:component this={item.icon} class="w-5 h-5" />
        <span class="text-[10px] font-medium">{item.label}</span>
      </a>
    {/each}
  </div>
</nav>
