<script lang="ts">
  export let orientation: 'horizontal' | 'vertical' = 'horizontal';
  export let label: string = '';
</script>

{#if label}
  <div class="divider with-label">
    <div class="divider-line" />
    <span class="divider-label">{label}</span>
    <div class="divider-line" />
  </div>
{:else}
  <div class="divider {orientation}">
    <div class="divider-line" />
  </div>
{/if}

<style>
  .divider {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .divider.horizontal {
    width: 100%;
    padding: 8px 0;
  }

  .divider.vertical {
    height: 100%;
    flex-direction: column;
    padding: 0 8px;
  }

  .divider-line {
    flex: 1;
    height: 1px;
    background: rgba(255, 255, 255, 0.06);
  }

  .divider.vertical .divider-line {
    width: 1px;
    height: 100%;
  }

  .divider-label {
    font-size: 12px;
    color: rgba(255, 255, 255, 0.3);
    white-space: nowrap;
  }
</style>
