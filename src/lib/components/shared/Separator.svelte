<script lang="ts">
  export let orientation: 'horizontal' | 'vertical' = 'horizontal';
  export let label: string = '';
</script>

{#if label}
  <div class="separator with-label">
    <div class="line" />
    <span class="label">{label}</span>
    <div class="line" />
  </div>
{:else}
  <div class="separator {orientation}" />
{/if}

<style>
  .separator {
    background: rgba(255, 255, 255, 0.06);
  }

  .separator.horizontal {
    height: 1px;
    width: 100%;
    margin: 8px 0;
  }

  .separator.vertical {
    width: 1px;
    height: 100%;
    margin: 0 8px;
  }

  .with-label {
    display: flex;
    align-items: center;
    gap: 12px;
    margin: 12px 0;
  }

  .with-label .line {
    flex: 1;
    height: 1px;
    background: rgba(255, 255, 255, 0.06);
  }

  .label {
    font-size: 12px;
    color: rgba(255, 255, 255, 0.3);
    white-space: nowrap;
  }
</style>
