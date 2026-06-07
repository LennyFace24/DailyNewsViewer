<script lang="ts">
  import { onMount } from 'svelte';

  let visible = false;
  let fadeOut = false;

  onMount(() => {
    // 触发进入动画
    requestAnimationFrame(() => {
      visible = true;
    });
  });
</script>

<div class="splash-screen" class:visible class:fade-out={fadeOut}>
  <div class="splash-content">
    <div class="logo-container">
      <div class="logo-icon">
        <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
          <rect width="64" height="64" rx="16" fill="rgba(255, 255, 255, 0.1)"/>
          <path d="M20 20h24v4H20zM20 28h20v4H20zM20 36h16v4H20zM20 44h12v4H20z" fill="rgba(255, 255, 255, 0.8)"/>
          <circle cx="44" cy="44" r="8" fill="rgba(255, 255, 255, 0.6)"/>
          <path d="M42 44l2 2 4-4" stroke="rgba(255, 255, 255, 0.9)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
      <h1 class="app-title">DailyTech</h1>
      <p class="app-subtitle">技术资讯聚合阅读器</p>
    </div>

    <div class="loading-indicator">
      <div class="loading-dots">
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>
  </div>
</div>

<style>
  .splash-screen {
    position: fixed;
    inset: 0;
    z-index: 1000;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 100%);
    opacity: 0;
    transition: opacity 0.5s ease;
  }

  .splash-screen.visible {
    opacity: 1;
  }

  .splash-screen.fade-out {
    opacity: 0;
  }

  .splash-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 48px;
  }

  .logo-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
    animation: fadeInUp 0.8s ease-out;
  }

  .logo-icon {
    width: 80px;
    height: 80px;
    display: flex;
    align-items: center;
    justify-content: center;
    animation: pulse 2s ease-in-out infinite;
  }

  .app-title {
    font-size: 32px;
    font-weight: 700;
    color: white;
    letter-spacing: -0.5px;
  }

  .app-subtitle {
    font-size: 14px;
    color: rgba(255, 255, 255, 0.5);
    letter-spacing: 0.5px;
  }

  .loading-indicator {
    animation: fadeIn 1s ease-out 0.5s both;
  }

  .loading-dots {
    display: flex;
    gap: 8px;
  }

  .loading-dots span {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.3);
    animation: dotPulse 1.5s ease-in-out infinite;
  }

  .loading-dots span:nth-child(2) {
    animation-delay: 0.2s;
  }

  .loading-dots span:nth-child(3) {
    animation-delay: 0.4s;
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.05); }
  }

  @keyframes dotPulse {
    0%, 100% {
      opacity: 0.3;
      transform: scale(1);
    }
    50% {
      opacity: 1;
      transform: scale(1.2);
    }
  }
</style>
