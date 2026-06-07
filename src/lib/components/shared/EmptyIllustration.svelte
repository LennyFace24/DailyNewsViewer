<script lang="ts">
  export let type: 'empty' | 'error' | 'no-results' = 'empty';
  export let size: 'sm' | 'md' | 'lg' = 'md';

  const sizes = {
    sm: 'w-24 h-24',
    md: 'w-32 h-32',
    lg: 'w-40 h-40'
  };

  const illustrations = {
    empty: {
      icon: '📭',
      title: '暂无内容',
      desc: '下拉刷新获取最新资讯'
    },
    error: {
      icon: '😵',
      title: '出错了',
      desc: '请检查网络连接后重试'
    },
    'no-results': {
      icon: '🔍',
      title: '未找到结果',
      desc: '尝试其他关键词'
    }
  };

  $: config = illustrations[type];
</script>

<div class="empty-container">
  <div class="illustration {sizes[size]}">
    <span class="emoji">{config.icon}</span>
  </div>
  <h3 class="title">{config.title}</h3>
  <p class="desc">{config.desc}</p>
  <slot />
</div>

<style>
  .empty-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 48px 24px;
    text-align: center;
  }

  .illustration {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 20px;
    animation: float 3s ease-in-out infinite;
  }

  .emoji {
    font-size: 64px;
  }

  .title {
    font-size: 18px;
    font-weight: 600;
    color: rgba(255, 255, 255, 0.9);
    margin-bottom: 8px;
  }

  .desc {
    font-size: 14px;
    color: rgba(255, 255, 255, 0.5);
    max-width: 280px;
    line-height: 1.5;
  }

  @keyframes float {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
  }
</style>
