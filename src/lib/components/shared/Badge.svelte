<script lang="ts">
  export let variant: 'default' | 'secondary' | 'outline' | 'success' | 'warning' | 'error' = 'default';
  export let size: 'sm' | 'md' = 'md';

  const variants = {
    default: 'bg-primary/20 text-primary border-primary/30',
    secondary: 'bg-white/10 text-white/70 border-white/10',
    outline: 'bg-transparent text-white/60 border-white/20',
    success: 'bg-green-500/20 text-green-400 border-green-500/30',
    warning: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    error: 'bg-red-500/20 text-red-400 border-red-500/30'
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-[10px]',
    md: 'px-2.5 py-1 text-xs'
  };
</script>

<span class="badge {variants[variant]} {sizes[size]}">
  <slot />
</span>

<style>
  .badge {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    border-radius: 100px;
    font-weight: 500;
    border: 1px solid;
    white-space: nowrap;
  }
</style>
