<script lang="ts">
  export let variant: 'text' | 'circular' | 'rectangular' = 'text';
  export let width: string | undefined = undefined;
  export let height: string | undefined = undefined;
</script>

<div
  class="skeleton {variant}"
  style:width={width}
  style:height={height}
/>

<style>
  .skeleton {
    background: linear-gradient(
      90deg,
      rgba(255, 255, 255, 0.04) 25%,
      rgba(255, 255, 255, 0.08) 50%,
      rgba(255, 255, 255, 0.04) 75%
    );
    background-size: 200% 100%;
    animation: shimmer 1.5s ease-in-out infinite;
  }

  .text {
    height: 16px;
    border-radius: 4px;
    width: 100%;
  }

  .circular {
    border-radius: 50%;
    width: 40px;
    height: 40px;
  }

  .rectangular {
    border-radius: 8px;
    width: 100%;
    height: 120px;
  }

  @keyframes shimmer {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }
</style>
