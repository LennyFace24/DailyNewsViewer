<script lang="ts">
  export let ratio: number = 16 / 9;
</script>

<div class="aspect-ratio" style="padding-bottom: {(1 / ratio) * 100}%">
  <div class="aspect-content">
    <slot />
  </div>
</div>

<style>
  .aspect-ratio {
    position: relative;
    width: 100%;
  }

  .aspect-content {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>
