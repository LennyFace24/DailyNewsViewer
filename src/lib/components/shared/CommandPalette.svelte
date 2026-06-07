<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { Search, X } from 'lucide-svelte';
  import { goto } from '$app/navigation';

  export let open = false;

  const dispatch = createEventDispatcher();

  let query = '';
  let selectedIndex = 0;

  const commands = [
    { id: 'home', label: '首页', icon: '🏠', action: () => goto('/') },
    { id: 'search', label: '搜索', icon: '🔍', action: () => goto('/search') },
    { id: 'discover', label: '发现', icon: '🧭', action: () => goto('/discover') },
    { id: 'trending', label: 'Trending', icon: '📈', action: () => goto('/trending') },
    { id: 'bookmarks', label: '收藏', icon: '📑', action: () => goto('/bookmarks') },
    { id: 'queue', label: '稍后阅读', icon: '⏱️', action: () => goto('/queue') },
    { id: 'settings', label: '设置', icon: '⚙️', action: () => goto('/settings') },
    { id: 'stats', label: '统计', icon: '📊', action: () => goto('/stats') },
  ];

  $: filteredCommands = query
    ? commands.filter(c => c.label.toLowerCase().includes(query.toLowerCase()))
    : commands;

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      selectedIndex = Math.min(selectedIndex + 1, filteredCommands.length - 1);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      selectedIndex = Math.max(selectedIndex - 1, 0);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      executeCommand(filteredCommands[selectedIndex]);
    } else if (e.key === 'Escape') {
      close();
    }
  }

  function executeCommand(cmd: typeof commands[0]) {
    cmd.action();
    close();
  }

  function close() {
    open = false;
    query = '';
    selectedIndex = 0;
    dispatch('close');
  }
</script>

{#if open}
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <div class="command-overlay" on:click={close}>
    <div class="command-box glass-card" on:click|stopPropagation>
      <div class="command-header">
        <Search class="w-5 h-5 text-muted-foreground" />
        <input
          bind:value={query}
          placeholder="输入命令..."
          class="command-input"
          on:keydown={handleKeydown}
          autofocus
        />
        <button class="close-btn" on:click={close}>
          <X class="w-5 h-5" />
        </button>
      </div>

      <div class="command-list">
        {#each filteredCommands as cmd, i}
          <button
            class="command-item {selectedIndex === i ? 'selected' : ''}"
            on:click={() => executeCommand(cmd)}
            on:mouseenter={() => selectedIndex = i}
          >
            <span class="command-icon">{cmd.icon}</span>
            <span class="command-label">{cmd.label}</span>
          </button>
        {/each}
      </div>
    </div>
  </div>
{/if}

<style>
  .command-overlay {
    position: fixed;
    inset: 0;
    z-index: 300;
    display: flex;
    align-items: flex-start;
    justify-content: center;
    padding-top: 20vh;
    background: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    animation: fadeIn 0.15s ease;
  }

  .command-box {
    width: 90%;
    max-width: 480px;
    max-height: 400px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    animation: scaleIn 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  }

  .command-header {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 16px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  }

  .command-input {
    flex: 1;
    background: transparent;
    border: none;
    outline: none;
    color: white;
    font-size: 15px;
  }
  .command-input::placeholder {
    color: rgba(255, 255, 255, 0.3);
  }

  .close-btn {
    width: 28px;
    height: 28px;
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: rgba(255, 255, 255, 0.4);
    background: transparent;
    border: none;
    cursor: pointer;
  }
  .close-btn:active {
    background: rgba(255, 255, 255, 0.1);
  }

  .command-list {
    overflow-y: auto;
    padding: 8px;
  }

  .command-item {
    display: flex;
    align-items: center;
    gap: 12px;
    width: 100%;
    padding: 10px 12px;
    border-radius: 8px;
    background: transparent;
    border: none;
    color: rgba(255, 255, 255, 0.7);
    cursor: pointer;
    transition: all 0.15s;
    text-align: left;
  }
  .command-item:hover,
  .command-item.selected {
    background: rgba(255, 255, 255, 0.08);
    color: white;
  }

  .command-icon {
    font-size: 18px;
  }

  .command-label {
    font-size: 14px;
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @keyframes scaleIn {
    from { opacity: 0; transform: scale(0.97); }
    to { opacity: 1; transform: scale(1); }
  }
</style>
