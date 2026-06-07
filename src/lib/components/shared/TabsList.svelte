<script lang="ts">
</script>

<div class="tabs-list">
  <slot />
</div>

<style>
  .tabs-list {
    display: flex;
    gap: 4px;
    padding: 4px;
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.06);
    border-radius: 10px;
    margin-bottom: 16px;
  }
</style>
