<script lang="ts">
  export let as: string = 'span';
</script>

<svelte:element this={as} class="visually-hidden">
  <slot />
</svelte:element>

<style>
  .visually-hidden {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }
</style>
