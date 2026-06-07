<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { ChevronRight, ChevronLeft, Check } from 'lucide-svelte';

  export let open = false;

  const dispatch = createEventDispatcher();

  let currentStep = 0;

  const steps = [
    {
      icon: '📰',
      title: '欢迎使用 DailyTech',
      description: '一站式技术资讯聚合阅读器，让你随时掌握最新技术动态'
    },
    {
      icon: '🔍',
      title: '多源聚合',
      description: '支持 RSS、API 等多种数据源，自动分类整理'
    },
    {
      icon: '📊',
      title: '阅读统计',
      description: '追踪你的阅读习惯，了解阅读偏好'
    },
    {
      icon: '🎨',
      title: '个性化定制',
      description: '自定义主题、卡片样式、阅读模式等'
    }
  ];

  function next() {
    if (currentStep < steps.length - 1) {
      currentStep++;
    } else {
      complete();
    }
  }

  function prev() {
    if (currentStep > 0) {
      currentStep--;
    }
  }

  function complete() {
    localStorage.setItem('dailytech_onboarding', 'done');
    open = false;
    dispatch('complete');
  }

  function skip() {
    complete();
  }
</script>

{#if open}
  <div class="onboarding-overlay">
    <div class="onboarding-content">
      <!-- 跳过按钮 -->
      <button class="skip-btn" on:click={skip}>
        跳过
      </button>

      <!-- 步骤内容 -->
      <div class="step-content">
        <div class="step-icon">{steps[currentStep].icon}</div>
        <h2 class="step-title">{steps[currentStep].title}</h2>
        <p class="step-desc">{steps[currentStep].description}</p>
      </div>

      <!-- 指示器 -->
      <div class="indicators">
        {#each steps as _, i}
          <div class="indicator" class:active={i === currentStep} />
        {/each}
      </div>

      <!-- 按钮 -->
      <div class="actions">
        {#if currentStep > 0}
          <button class="prev-btn" on:click={prev}>
            <ChevronLeft class="w-5 h-5" />
          </button>
        {/if}

        <button class="next-btn" on:click={next}>
          {#if currentStep === steps.length - 1}
            <Check class="w-5 h-5" />
            开始使用
          {:else}
            下一步
            <ChevronRight class="w-5 h-5" />
          {/if}
        </button>
      </div>
    </div>
  </div>
{/if}

<style>
  .onboarding-overlay {
    position: fixed;
    inset: 0;
    z-index: 1000;
    background: linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    animation: fadeIn 0.5s ease;
  }

  .onboarding-content {
    width: 100%;
    max-width: 400px;
    padding: 40px 24px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 40px;
    position: relative;
  }

  .skip-btn {
    position: absolute;
    top: 0;
    right: 0;
    padding: 8px 16px;
    border-radius: 8px;
    background: transparent;
    color: rgba(255, 255, 255, 0.5);
    font-size: 14px;
    border: none;
    cursor: pointer;
    transition: all 0.2s;
  }
  .skip-btn:hover {
    color: white;
    background: rgba(255, 255, 255, 0.1);
  }

  .step-content {
    text-align: center;
    animation: slideIn 0.3s ease;
  }

  .step-icon {
    font-size: 64px;
    margin-bottom: 24px;
  }

  .step-title {
    font-size: 24px;
    font-weight: 700;
    color: white;
    margin-bottom: 12px;
  }

  .step-desc {
    font-size: 15px;
    color: rgba(255, 255, 255, 0.6);
    line-height: 1.6;
    max-width: 300px;
  }

  .indicators {
    display: flex;
    gap: 8px;
  }

  .indicator {
    width: 8px;
    height: 8px;
    border-radius: 4px;
    background: rgba(255, 255, 255, 0.2);
    transition: all 0.3s;
  }

  .indicator.active {
    width: 24px;
    background: white;
  }

  .actions {
    display: flex;
    gap: 12px;
    width: 100%;
    max-width: 300px;
  }

  .prev-btn {
    width: 48px;
    height: 48px;
    border-radius: 14px;
    background: rgba(255, 255, 255, 0.1);
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    border: none;
    cursor: pointer;
    transition: all 0.2s;
  }
  .prev-btn:active {
    background: rgba(255, 255, 255, 0.2);
    transform: scale(0.95);
  }

  .next-btn {
    flex: 1;
    height: 48px;
    border-radius: 14px;
    background: white;
    color: #0f0f0f;
    font-size: 15px;
    font-weight: 600;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    border: none;
    cursor: pointer;
    transition: all 0.2s;
  }
  .next-btn:active {
    transform: scale(0.98);
    opacity: 0.9;
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateX(20px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
</style>
