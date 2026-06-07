<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { X, Search, RefreshCw, Bookmark, Clock, Settings } from 'lucide-svelte';
  import { goto } from '$app/navigation';
  import { articles } from '$lib/stores/articles';
  import { readingQueue } from '$lib/stores/queue';

  export let open = false;

  const dispatch = createEventDispatcher();

  let isClosing = false;

  function close() {
    isClosing = true;
    setTimeout(() => {
      open = false;
      isClosing = false;
    }, 200);
  }

  function navigateTo(path: string) {
    goto(path);
    close();
  }

  $: unreadCount = $articles.filter(a => !a.isRead).length;
  $: bookmarkCount = $articles.filter(a => a.isBookmarked).length;
  $: queueCount = $readingQueue.length;

  const actions = [
    { icon: Search, label: '搜索', path: '/search' },
    { icon: Bookmark, label: '收藏', path: '/bookmarks', count: bookmarkCount },
    { icon: Clock, label: '稍后', path: '/queue', count: queueCount },
    { icon: Settings, label: '设置', path: '/settings' }
  ];
</script>

{#if open}
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <div class="modal-overlay" class:fade-out={isClosing} on:click={close}>
    <div class="modal-box glass-card" class:scale-out={isClosing} on:click|stopPropagation>
      <div class="modal-header">
        <h3>快捷操作</h3>
        <button class="close-btn" on:click={close}>
          <X class="w-5 h-5" />
        </button>
      </div>

      <!-- 统计信息 -->
      <div class="stats-bar">
        <div class="stat">
          <span class="stat-value">{unreadCount}</span>
          <span class="stat-label">未读</span>
        </div>
        <div class="stat">
          <span class="stat-value">{bookmarkCount}</span>
          <span class="stat-label">收藏</span>
        </div>
        <div class="stat">
          <span class="stat-value">{queueCount}</span>
          <span class="stat-label">稍后</span>
        </div>
      </div>

      <!-- 快捷操作 -->
      <div class="actions-grid">
        {#each actions as action}
          <button class="action-item" on:click={() => navigateTo(action.path)}>
            <div class="action-icon">
              <svelte:component this={action.icon} class="w-5 h-5" />
              {#if action.count}
                <span class="action-badge">{action.count}</span>
              {/if}
            </div>
            <span class="action-label">{action.label}</span>
          </button>
        {/each}
      </div>
    </div>
  </div>
{/if}

<style>
  .modal-overlay {
    position: fixed;
    inset: 0;
    z-index: 200;
    display: flex;
    align-items: flex-end;
    justify-content: center;
    background: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    animation: fadeIn 0.2s ease-out;
  }

  .modal-box {
    width: 100%;
    max-width: 500px;
    border-radius: 20px 20px 0 0;
    animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  }

  .fade-out {
    animation: fadeOut 0.2s ease-out forwards;
  }

  .scale-out {
    animation: slideDown 0.2s ease-out forwards;
  }

  .modal-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20px 20px 0;
  }

  .modal-header h3 {
    font-size: 18px;
    font-weight: 600;
  }

  .close-btn {
    width: 32px;
    height: 32px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: rgba(255, 255, 255, 0.5);
    background: transparent;
    border: none;
    cursor: pointer;
  }
  .close-btn:active {
    background: rgba(255, 255, 255, 0.1);
  }

  .stats-bar {
    display: flex;
    justify-content: space-around;
    padding: 20px;
    margin: 16px 20px;
    background: rgba(255, 255, 255, 0.03);
    border-radius: 12px;
    border: 1px solid rgba(255, 255, 255, 0.05);
  }

  .stat {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
  }

  .stat-value {
    font-size: 24px;
    font-weight: 700;
    color: white;
  }

  .stat-label {
    font-size: 12px;
    color: rgba(255, 255, 255, 0.4);
  }

  .actions-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 16px;
    padding: 16px 20px 24px;
  }

  .action-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    padding: 16px 8px;
    border-radius: 12px;
    background: transparent;
    border: none;
    color: rgba(255, 255, 255, 0.7);
    cursor: pointer;
    transition: all 0.2s;
  }
  .action-item:active {
    background: rgba(255, 255, 255, 0.05);
    transform: scale(0.95);
  }

  .action-icon {
    width: 48px;
    height: 48px;
    border-radius: 14px;
    background: rgba(255, 255, 255, 0.08);
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
  }

  .action-badge {
    position: absolute;
    top: -4px;
    right: -4px;
    min-width: 18px;
    height: 18px;
    border-radius: 9px;
    background: rgba(255, 255, 255, 0.2);
    color: white;
    font-size: 10px;
    font-weight: 600;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 4px;
  }

  .action-label {
    font-size: 12px;
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @keyframes fadeOut {
    from { opacity: 1; }
    to { opacity: 0; }
  }

  @keyframes slideUp {
    from { transform: translateY(100%); }
    to { transform: translateY(0); }
  }

  @keyframes slideDown {
    from { transform: translateY(0); }
    to { transform: translateY(100%); }
  }
</style>
