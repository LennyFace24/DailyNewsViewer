<script lang="ts">
  import { Dialog as SheetPrimitive } from "bits-ui";
  import { cn } from "$lib/utils/shadcn";
  import SheetOverlay from "./sheet-overlay.svelte";
  import SheetPortal from "./sheet-porta.svelte";
  import { X } from "lucide-svelte";

  type $$Props = SheetPrimitive.ContentProps & {
    side?: "top" | "bottom" | "left" | "right";
  };

  let className: $$Props["class"] = undefined;
  export let side: $$Props["side"] = "right";
  export { className as class };
</script>

<SheetPortal>
  <SheetOverlay />
  <SheetPrimitive.Content
    class={cn(
      "fixed z-50 gap-4 bg-background p-6 shadow-lg transition ease-in-out data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:duration-300 data-[state=open]:duration-500",
      side === "right" && "inset-y-0 right-0 h-full w-3/4 border-l data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right sm:max-w-sm",
      side === "left" && "inset-y-0 left-0 h-full w-3/4 border-r data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left sm:max-w-sm",
      side === "top" && "inset-x-0 top-0 border-b data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top",
      side === "bottom" && "inset-x-0 bottom-0 border-t data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom",
      className
    )}
    {...$$restProps}
  >
    <slot />
    <SheetPrimitive.Close
      class="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary"
    >
      <X class="h-4 w-4" />
      <span class="sr-only">Close</span>
    </SheetPrimitive.Close>
  </SheetPrimitive.Content>
</SheetPortal>
