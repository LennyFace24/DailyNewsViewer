<script lang="ts">
  import * as icons from 'lucide-svelte';

  export let name: string = '';
  export let size: 'sm' | 'md' | 'lg' = 'md';
  export let color: string = '';

  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  $: iconComponent = icons[name as keyof typeof icons] || icons.HelpCircle;
</script>

<svelte:component
  this={iconComponent}
  class="{sizes[size]} {color}"
  {...$$restProps}
/>
