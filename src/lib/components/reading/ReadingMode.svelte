<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { X, Minus, Plus, Sun, Moon } from 'lucide-svelte';
  import { settings, updateSetting } from '$lib/stores/settings';
  import Switch from '$lib/components/shared/Switch.svelte';

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

  function adjustFontSize(delta: number) {
    const sizes = ['small', 'medium', 'large'];
    const currentIndex = sizes.indexOf($settings.fontSize);
    const newIndex = Math.max(0, Math.min(sizes.length - 1, currentIndex + delta));
    updateSetting('fontSize', sizes[newIndex]);
  }

  function toggleTheme() {
    updateSetting('theme', $settings.theme === 'dark' ? 'light' : 'dark');
  }
</script>

{#if open}
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <div class="modal-overlay" class:fade-out={isClosing} on:click={close}>
    <div class="modal-box glass-card" class:scale-out={isClosing} on:click|stopPropagation>
      <div class="modal-header">
        <h3>阅读设置</h3>
        <button class="close-btn" on:click={close}>
          <X class="w-5 h-5" />
        </button>
      </div>

      <div class="settings-list">
        <!-- 字体大小 -->
        <div class="setting-item">
          <div class="setting-label">字体大小</div>
          <div class="font-size-controls">
            <button class="control-btn" on:click={() => adjustFontSize(-1)}>
              <Minus class="w-4 h-4" />
            </button>
            <span class="font-size-display">
              {$settings.fontSize === 'small' ? '小' : $settings.fontSize === 'medium' ? '中' : '大'}
            </span>
            <button class="control-btn" on:click={() => adjustFontSize(1)}>
              <Plus class="w-4 h-4" />
            </button>
          </div>
        </div>

        <!-- 主题 -->
        <div class="setting-item">
          <div class="setting-label">主题</div>
          <button class="theme-btn" on:click={toggleTheme}>
            {#if $settings.theme === 'dark'}
              <Moon class="w-4 h-4" />
              <span>深色</span>
            {:else}
              <Sun class="w-4 h-4" />
              <span>浅色</span>
            {/if}
          </button>
        </div>

        <!-- 图片显示 -->
        <div class="setting-item">
          <div class="setting-label">显示图片</div>
          <Switch
            checked={$settings.showImages}
            on:click={() => updateSetting('showImages', !$settings.showImages)}
          />
        </div>
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

  .settings-list {
    padding: 16px 20px 24px;
  }

  .setting-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 14px 0;
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  }
  .setting-item:last-child {
    border-bottom: none;
  }

  .setting-label {
    font-size: 14px;
    font-weight: 500;
  }

  .font-size-controls {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .control-btn {
    width: 32px;
    height: 32px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(255, 255, 255, 0.08);
    color: rgba(255, 255, 255, 0.7);
    border: none;
    cursor: pointer;
    transition: all 0.2s;
  }
  .control-btn:active {
    background: rgba(255, 255, 255, 0.15);
    transform: scale(0.95);
  }

  .font-size-display {
    font-size: 14px;
    min-width: 24px;
    text-align: center;
  }

  .theme-btn {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 16px;
    border-radius: 8px;
    background: rgba(255, 255, 255, 0.08);
    color: rgba(255, 255, 255, 0.7);
    font-size: 13px;
    border: none;
    cursor: pointer;
    transition: all 0.2s;
  }
  .theme-btn:active {
    background: rgba(255, 255, 255, 0.15);
  }

  .toggle {
    width: 48px;
    height: 28px;
    border-radius: 14px;
    background: rgba(255, 255, 255, 0.1);
    padding: 2px;
    cursor: pointer;
    transition: background 0.2s;
  }
  .toggle.active {
    background: rgba(255, 255, 255, 0.25);
  }

  .toggle-thumb {
    width: 24px;
    height: 24px;
    border-radius: 12px;
    background: white;
    transition: transform 0.2s;
  }
  .toggle-thumb.active {
    transform: translateX(20px);
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
