<script lang="ts">
  export let orientation: 'vertical' | 'horizontal' = 'vertical';
  export let scrollbarClass = '';
</script>

<div class="scroll-area {orientation}">
  <div class="scroll-content">
    <slot />
  </div>
  <div class="scrollbar {orientation} {scrollbarClass}">
    <div class="scrollbar-thumb" />
  </div>
</div>

<style>
  .scroll-area {
    position: relative;
    overflow: hidden;
  }

  .scroll-content {
    overflow: auto;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;
  }
  .scroll-content::-webkit-scrollbar {
    display: none;
  }

  .scrollbar {
    position: absolute;
    pointer-events: none;
    opacity: 0;
    transition: opacity 0.2s;
  }
  .scroll-area:hover .scrollbar {
    opacity: 1;
  }

  .scrollbar.vertical {
    right: 2px;
    top: 2px;
    bottom: 2px;
    width: 6px;
  }

  .scrollbar.horizontal {
    bottom: 2px;
    left: 2px;
    right: 2px;
    height: 6px;
  }

  .scrollbar-thumb {
    background: rgba(255, 255, 255, 0.2);
    border-radius: 3px;
  }

  .scrollbar.vertical .scrollbar-thumb {
    width: 100%;
    min-height: 20px;
  }

  .scrollbar.horizontal .scrollbar-thumb {
    height: 100%;
    min-width: 20px;
  }
</style>
