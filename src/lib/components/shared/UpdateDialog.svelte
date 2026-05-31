<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { Download, X, ExternalLink } from 'lucide-svelte';
  import type { ReleaseInfo } from '$lib/services/updater';
  import { formatFileSize, formatChangelog } from '$lib/services/updater';

  export let open = false;
  export let release: ReleaseInfo | null = null;

  const dispatch = createEventDispatcher();

  let isDownloading = false;
  let downloadProgress = 0;
  let isClosing = false;

  function close() {
    isClosing = true;
    setTimeout(() => {
      open = false;
      isClosing = false;
      dispatch('close');
    }, 200);
  }

  async function handleDownload() {
    if (!release) return;

    // 直接打开下载链接
    window.open(release.apkUrl, '_blank');
    close();
  }
</script>

{#if open && release}
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <div class="modal-overlay" class:fade-out={isClosing} on:click={close}>
    <div class="modal-box glass-card" class:scale-out={isClosing} on:click|stopPropagation>
      <!-- 头部 -->
      <div class="modal-header">
        <div>
          <h3>发现新版本</h3>
          <span class="version-tag">{release.tagName}</span>
        </div>
        <button class="close-btn" on:click={close}>
          <X class="w-5 h-5" />
        </button>
      </div>

      <!-- 更新日志 -->
      <div class="changelog-box">
        <div class="changelog-label">更新日志</div>
        <div class="changelog-content">
          {formatChangelog(release.body)}
        </div>
      </div>

      <!-- 信息 -->
      <div class="release-info">
        <span>发布时间: {new Date(release.publishedAt).toLocaleDateString('zh-CN')}</span>
        {#if release.apkSize > 0}
          <span>大小: {formatFileSize(release.apkSize)}</span>
        {/if}
      </div>

      <!-- 按钮 -->
      <div class="modal-actions">
        <button class="secondary-btn" on:click={close}>
          稍后再说
        </button>
        <button class="primary-btn" on:click={handleDownload} disabled={isDownloading}>
          {#if isDownloading}
            <span class="animate-pulse">下载中... {Math.round(downloadProgress * 100)}%</span>
          {:else}
            <Download class="w-4 h-4 mr-2" />
            下载更新
          {/if}
        </button>
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
    align-items: center;
    justify-content: center;
    padding: 24px;
    background: rgba(0, 0, 0, 0.7);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    animation: fadeIn 0.2s ease-out;
  }

  .modal-box {
    width: 100%;
    max-width: 400px;
    max-height: 80vh;
    display: flex;
    flex-direction: column;
    animation: scaleIn 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  }

  .fade-out {
    animation: fadeOut 0.2s ease-out forwards;
  }

  .scale-out {
    animation: scaleOut 0.2s ease-out forwards;
  }

  .modal-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    padding: 20px 20px 0;
  }

  .modal-header h3 {
    font-size: 18px;
    font-weight: 600;
    margin-bottom: 4px;
  }

  .version-tag {
    display: inline-block;
    padding: 2px 8px;
    border-radius: 4px;
    background: rgba(34, 197, 94, 0.2);
    color: rgb(34, 197, 94);
    font-size: 12px;
    font-family: monospace;
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

  .changelog-box {
    margin: 16px 20px;
    padding: 12px;
    border-radius: 10px;
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.05);
    max-height: 200px;
    overflow-y: auto;
  }

  .changelog-label {
    font-size: 11px;
    font-weight: 500;
    color: rgba(255, 255, 255, 0.4);
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin-bottom: 8px;
  }

  .changelog-content {
    font-size: 13px;
    color: rgba(255, 255, 255, 0.7);
    line-height: 1.6;
    white-space: pre-wrap;
  }

  .release-info {
    display: flex;
    gap: 16px;
    padding: 0 20px;
    font-size: 11px;
    color: rgba(255, 255, 255, 0.3);
  }

  .modal-actions {
    display: flex;
    gap: 12px;
    padding: 20px;
  }

  .primary-btn {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 12px;
    border-radius: 10px;
    background: rgba(255, 255, 255, 0.15);
    color: white;
    font-size: 14px;
    font-weight: 500;
    border: none;
    cursor: pointer;
    transition: background 0.2s;
  }
  .primary-btn:active {
    background: rgba(255, 255, 255, 0.25);
  }
  .primary-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .secondary-btn {
    padding: 12px 16px;
    border-radius: 10px;
    background: rgba(255, 255, 255, 0.08);
    color: rgba(255, 255, 255, 0.7);
    font-size: 14px;
    border: none;
    cursor: pointer;
    transition: background 0.2s;
  }
  .secondary-btn:active {
    background: rgba(255, 255, 255, 0.15);
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @keyframes fadeOut {
    from { opacity: 1; }
    to { opacity: 0; }
  }

  @keyframes scaleIn {
    from { opacity: 0; transform: scale(0.95); }
    to { opacity: 1; transform: scale(1); }
  }

  @keyframes scaleOut {
    from { opacity: 1; transform: scale(1); }
    to { opacity: 0; transform: scale(0.95); }
  }
</style>
