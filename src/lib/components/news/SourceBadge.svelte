<script lang="ts">
  export let name: string;
  export let icon: string | undefined = undefined;
  export let size: 'sm' | 'md' | 'lg' = 'md';
</script>

<span
  class="inline-flex items-center gap-1.5 font-medium rounded-full
         {size === 'sm' ? 'px-2 py-0.5 text-xs' : size === 'lg' ? 'px-4 py-1.5 text-base' : 'px-3 py-1 text-sm'}
         bg-slate-800/80 text-slate-300 border border-slate-700/50"
>
  {#if icon}
    <img src={icon} alt={name} class="w-4 h-4 rounded-full" />
  {/if}
  {name}
</span>
