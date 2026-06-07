<script lang="ts">
  import { page } from '$app/stores';
  import { Home, Bookmark, Compass, Settings, Clock } from 'lucide-svelte';
  import { queueCount } from '$lib/stores/queue';

  $: currentPath = $page.url.pathname;

  const navItems = [
    { path: '/', icon: Home, label: '首页' },
    { path: '/discover', icon: Compass, label: '发现' },
    { path: '/queue', icon: Clock, label: '稍后' },
    { path: '/bookmarks', icon: Bookmark, label: '收藏' },
    { path: '/settings', icon: Settings, label: '设置' }
  ];
</script>

<nav class="bottom-nav">
  <div class="nav-items">
    {#each navItems as item}
      <a
        href={item.path}
        class="nav-item {currentPath === item.path ? 'active' : ''}"
      >
        <svelte:component this={item.icon} class="w-5 h-5" />
        <span>{item.label}</span>
      </a>
    {/each}
  </div>
</nav>

<style>
  .bottom-nav {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 50;
    /* 毛玻璃效果 */
    background: rgba(15, 15, 15, 0.85);
    backdrop-filter: blur(20px) saturate(180%);
    -webkit-backdrop-filter: blur(20px) saturate(180%);
    border-top: 1px solid rgba(255, 255, 255, 0.06);
    /* 安全区域 - 让系统手势指示器在上面 */
    padding-bottom: env(safe-area-inset-bottom, 0px);
  }

  .nav-items {
    display: flex;
    align-items: center;
    justify-content: space-around;
    height: 56px;
    max-width: 512px;
    margin: 0 auto;
    padding: 0 16px;
  }

  .nav-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    padding: 8px 16px;
    border-radius: 12px;
    color: rgba(255, 255, 255, 0.4);
    text-decoration: none;
    transition: color 0.2s;
    -webkit-tap-highlight-color: transparent;
  }

  .nav-item:active,
  .nav-item.active {
    color: white;
  }

  .nav-item span {
    font-size: 10px;
    font-weight: 500;
  }
</style>
