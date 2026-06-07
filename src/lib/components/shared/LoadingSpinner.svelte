<script lang="ts">
  export let size: 'sm' | 'md' | 'lg' = 'md';
  export let text = '';

  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };
</script>

<div class="loading-spinner">
  <div class="spinner {sizes[size]}" />
  {#if text}
    <span class="loading-text">{text}</span>
  {/if}
</div>

<style>
  .loading-spinner {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
  }

  .spinner {
    border: 2px solid rgba(255, 255, 255, 0.1);
    border-top: 2px solid rgba(255, 255, 255, 0.8);
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }

  .loading-text {
    font-size: 13px;
    color: rgba(255, 255, 255, 0.5);
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
</style>
