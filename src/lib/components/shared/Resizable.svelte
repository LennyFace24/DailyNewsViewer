<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  export let direction: 'horizontal' | 'vertical' = 'horizontal';
  export let minSize = 100;
  export let maxSize = Infinity;
  export let initialSize = 200;

  const dispatch = createEventDispatcher();

  let size = initialSize;
  let isResizing = false;
  let startPos = 0;
  let startSize = 0;

  function handleMouseDown(e: MouseEvent) {
    isResizing = true;
    startPos = direction === 'horizontal' ? e.clientX : e.clientY;
    startSize = size;

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    document.body.style.cursor = direction === 'horizontal' ? 'col-resize' : 'row-resize';
    document.body.style.userSelect = 'none';
  }

  function handleMouseMove(e: MouseEvent) {
    if (!isResizing) return;

    const currentPos = direction === 'horizontal' ? e.clientX : e.clientY;
    const delta = currentPos - startPos;
    const newSize = Math.max(minSize, Math.min(maxSize, startSize + delta));

    size = newSize;
    dispatch('resize', { size });
  }

  function handleMouseUp() {
    isResizing = false;
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
  }
</script>

<div class="resizable {direction}" style="--size: {size}px">
  <div class="content">
    <slot />
  </div>
  <button
    class="handle {direction}"
    on:mousedown={handleMouseDown}
    aria-label="Resize"
  />
</div>

<style>
  .resizable {
    position: relative;
    display: flex;
  }

  .resizable.horizontal {
    width: var(--size);
    flex-direction: row;
  }

  .resizable.vertical {
    height: var(--size);
    flex-direction: column;
  }

  .content {
    flex: 1;
    overflow: hidden;
  }

  .handle {
    position: absolute;
    z-index: 10;
    background: transparent;
    border: none;
    cursor: col-resize;
    transition: background 0.2s;
  }

  .handle:hover,
  .handle:active {
    background: rgba(255, 255, 255, 0.1);
  }

  .handle.horizontal {
    top: 0;
    right: -3px;
    width: 6px;
    height: 100%;
    cursor: col-resize;
  }

  .handle.vertical {
    bottom: -3px;
    left: 0;
    width: 100%;
    height: 6px;
    cursor: row-resize;
  }
</style>
