<script lang="ts">
  import { ScrollArea as ScrollAreaPrimitive } from "bits-ui";
  import { cn } from "$lib/utils/shadcn";
  import Scrollbar from "./scroll-area-scrollbar.svelte";

  type $$Props = ScrollAreaPrimitive.Props & {
    orientation?: "vertical" | "horizontal";
  };

  let className: $$Props["class"] = undefined;
  export { className as class };
  export let orientation = "vertical";
</script>

<ScrollAreaPrimitive.Root {...$$restProps}>
  <ScrollAreaPrimitive.Viewport class={cn("h-full w-full rounded-[inherit]", className)}>
    <slot />
  </ScrollAreaPrimitive.Viewport>
  <Scrollbar {orientation} />
  <ScrollAreaPrimitive.Corner />
</ScrollAreaPrimitive.Root>
