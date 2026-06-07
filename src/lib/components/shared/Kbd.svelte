<script lang="ts">
  export let key: string = '';
</script>

<kbd class="kbd">
  {#if key}
    {key}
  {:else}
    <slot />
  {/if}
</kbd>

<style>
  .kbd {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 24px;
    height: 24px;
    padding: 0 6px;
    border-radius: 6px;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-bottom-width: 2px;
    font-family: 'SF Mono', monospace;
    font-size: 11px;
    color: rgba(255, 255, 255, 0.6);
    white-space: nowrap;
  }
</style>
