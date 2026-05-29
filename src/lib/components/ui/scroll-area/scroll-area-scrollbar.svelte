<script lang="ts">
  import { ScrollArea as ScrollAreaPrimitive } from "bits-ui";
  import { cn } from "$lib/utils/shadcn";

  type $$Props = ScrollAreaPrimitive.ScrollbarProps;

  let className: $$Props["class"] = undefined;
  export let orientation: $$Props["orientation"] = "vertical";
  export { className as class };
</script>

<ScrollAreaPrimitive.Scrollbar
  {orientation}
  class={cn(
    "flex touch-none select-none transition-colors",
    orientation === "vertical" && "h-full w-2.5 border-l border-l-transparent p-[1px]",
    orientation === "horizontal" && "h-2.5 border-t border-t-transparent p-[1px]",
    className
  )}
>
  <ScrollAreaPrimitive.Thumb
    class={cn(
      "relative rounded-full bg-border",
      orientation === "vertical" && "flex-1"
    )}
  />
</ScrollAreaPrimitive.Scrollbar>
