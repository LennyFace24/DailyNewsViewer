<script lang="ts">
  import { cn } from "$lib/utils/shadcn";
  import { badgeVariants, type Props } from ".";

  type $$Props = Props;

  let className: $$Props["class"] = undefined;
  export let variant: $$Props["variant"] = "default";
  export let href: $$Props["href"] = undefined;
  export { className as class };
</script>

<svelte:element
  this={href ? "a" : "span"}
  {href}
  class={cn(badgeVariants({ variant, className }))}
  {...$$restProps}
>
  <slot />
</svelte:element>
