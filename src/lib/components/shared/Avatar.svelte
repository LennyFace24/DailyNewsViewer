<script lang="ts">
  export let src: string | undefined = undefined;
  export let alt: string = '';
  export let size: 'sm' | 'md' | 'lg' = 'md';
  export let fallback: string = '?';

  const sizes = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base'
  };

  let imgError = false;

  function handleError() {
    imgError = true;
  }
</script>

<div class="avatar {sizes[size]}">
  {#if src && !imgError}
    <img {src} {alt} on:error={handleError} class="avatar-img" />
  {:else}
    <span class="avatar-fallback">{fallback}</span>
  {/if}
</div>

<style>
  .avatar {
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.1);
    overflow: hidden;
    flex-shrink: 0;
  }

  .avatar-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .avatar-fallback {
    font-weight: 600;
    color: rgba(255, 255, 255, 0.7);
  }
</style>
