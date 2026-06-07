<script lang="ts">
  export let value: number = 0;
  export let max: number = 100;
  export let size: 'sm' | 'md' = 'md';
  export let showLabel: boolean = false;

  $: percentage = Math.min(100, Math.max(0, (value / max) * 100));

  const sizes = {
    sm: 'h-1',
    md: 'h-2'
  };
</script>

<div class="progress-container">
  <div class="progress-bar {sizes[size]}">
    <div
      class="progress-fill"
      style="width: {percentage}%"
    />
  </div>
  {#if showLabel}
    <span class="progress-label">{Math.round(percentage)}%</span>
  {/if}
</div>

<style>
  .progress-container {
    display: flex;
    align-items: center;
    gap: 8px;
    width: 100%;
  }

  .progress-bar {
    flex: 1;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 100px;
    overflow: hidden;
  }

  .progress-fill {
    height: 100%;
    background: rgba(255, 255, 255, 0.7);
    border-radius: 100px;
    transition: width 0.3s ease;
  }

  .progress-label {
    font-size: 12px;
    color: rgba(255, 255, 255, 0.5);
    min-width: 36px;
    text-align: right;
  }
</style>
