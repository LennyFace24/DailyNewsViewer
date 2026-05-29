<script lang="ts">
  import { Dialog as SheetPrimitive } from "bits-ui";

  type $$Props = SheetPrimitive.Props;

  export let open: $$Props["open"] = undefined;
  export let onOpenChange: $$Props["onOpenChange"] = undefined;
</script>

<SheetPrimitive.Root bind:open {onOpenChange} {...$$restProps}>
  <slot />
</SheetPrimitive.Root>
