<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { X, Github, Heart, ExternalLink } from 'lucide-svelte';

  export let open = false;
  export let version = '0.0.0';

  const dispatch = createEventDispatcher();

  let isClosing = false;

  function close() {
    isClosing = true;
    setTimeout(() => {
      open = false;
      isClosing = false;
    }, 200);
  }

  const features = [
    '多源聚合阅读',
    '智能内容分类',
    'AI翻译支持',
    '阅读统计分析',
    '数据导出备份',
    '手势操作',
    '阅读模式'
  ];
</script>

{#if open}
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <div class="modal-overlay" class:fade-out={isClosing} on:click={close}>
    <div class="modal-box glass-card" class:scale-out={isClosing} on:click|stopPropagation>
      <div class="modal-header">
        <div class="app-icon">
          <span class="text-2xl">📰</span>
        </div>
        <button class="close-btn" on:click={close}>
          <X class="w-5 h-5" />
        </button>
      </div>

      <div class="app-info">
        <h2 class="app-name">DailyTech</h2>
        <p class="app-version">v{version}</p>
        <p class="app-desc">技术资讯聚合阅读器</p>
      </div>

      <div class="features-list">
        <h3 class="features-title">功能特性</h3>
        <ul>
          {#each features as feature}
            <li>{feature}</li>
          {/each}
        </ul>
      </div>

      <div class="links">
        <a href="https://github.com/LennyFace24/DailyNewsViewer" target="_blank" class="link-item">
          <Github class="w-4 h-4" />
          <span>GitHub</span>
          <ExternalLink class="w-3 h-3" />
        </a>
      </div>

      <div class="footer">
        <p class="made-with">Made with <Heart class="w-3 h-3 inline text-red-400" /> by LennyFace24</p>
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
    max-width: 360px;
    text-align: center;
    animation: scaleIn 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  }

  .fade-out {
    animation: fadeOut 0.2s ease-out forwards;
  }

  .scale-out {
    animation: scaleOut 0.2s ease-out forwards;
  }

  .modal-header {
    position: relative;
    padding: 24px 20px 0;
  }

  .app-icon {
    width: 64px;
    height: 64px;
    border-radius: 16px;
    background: rgba(255, 255, 255, 0.1);
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 16px;
  }

  .close-btn {
    position: absolute;
    top: 12px;
    right: 12px;
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

  .app-info {
    padding: 0 20px 20px;
  }

  .app-name {
    font-size: 24px;
    font-weight: 700;
    margin-bottom: 4px;
  }

  .app-version {
    font-size: 14px;
    color: rgba(255, 255, 255, 0.5);
    margin-bottom: 8px;
  }

  .app-desc {
    font-size: 14px;
    color: rgba(255, 255, 255, 0.7);
  }

  .features-list {
    padding: 0 20px 20px;
    text-align: left;
  }

  .features-title {
    font-size: 12px;
    font-weight: 500;
    color: rgba(255, 255, 255, 0.4);
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin-bottom: 12px;
  }

  .features-list ul {
    list-style: none;
    padding: 0;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 8px;
  }

  .features-list li {
    font-size: 13px;
    color: rgba(255, 255, 255, 0.7);
    padding: 8px 12px;
    background: rgba(255, 255, 255, 0.03);
    border-radius: 8px;
  }

  .links {
    padding: 0 20px 20px;
  }

  .link-item {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 12px;
    border-radius: 12px;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.08);
    color: rgba(255, 255, 255, 0.7);
    text-decoration: none;
    font-size: 14px;
    transition: all 0.2s;
  }
  .link-item:active {
    background: rgba(255, 255, 255, 0.1);
  }

  .footer {
    padding: 16px 20px;
    border-top: 1px solid rgba(255, 255, 255, 0.05);
  }

  .made-with {
    font-size: 12px;
    color: rgba(255, 255, 255, 0.3);
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
