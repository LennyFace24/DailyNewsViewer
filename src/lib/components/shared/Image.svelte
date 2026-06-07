<script lang="ts">
  export let src: string;
  export let alt: string = '';
  export let fallback: string = '';

  let loaded = false;
  let error = false;

  function handleLoad() {
    loaded = true;
  }

  function handleError() {
    error = true;
    loaded = true;
  }
</script>

<div class="image-container">
  {#if !loaded}
    <div class="placeholder">
      <div class="shimmer" />
    </div>
  {/if}

  {#if !error}
    <img
      {src}
      {alt}
      loading="lazy"
      decoding="async"
      class="image {loaded ? 'loaded' : ''}"
      on:load={handleLoad}
      on:error={handleError}
    />
  {:else}
    <div class="error">
      <span>{fallback || alt?.[0] || '?'}</span>
    </div>
  {/if}
</div>

<style>
  .image-container {
    position: relative;
    overflow: hidden;
    background: rgba(255, 255, 255, 0.03);
  }

  .placeholder {
    position: absolute;
    inset: 0;
    z-index: 1;
  }

  .shimmer {
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      rgba(255, 255, 255, 0.03) 25%,
      rgba(255, 255, 255, 0.06) 50%,
      rgba(255, 255, 255, 0.03) 75%
    );
    background-size: 200% 100%;
    animation: shimmer 1.5s ease-in-out infinite;
  }

  @keyframes shimmer {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }

  .image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  .image.loaded {
    opacity: 1;
  }

  .error {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    background: rgba(255, 255, 255, 0.05);
    color: rgba(255, 255, 255, 0.3);
    font-size: 24px;
  }
</style>
