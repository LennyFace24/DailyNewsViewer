<script lang="ts">
  import { toast } from '$lib/stores/toast';
  import Toast from './Toast.svelte';

  let currentToast: any = null;
  let show = false;

  $: if ($toast.length > 0 && !show) {
    currentToast = $toast[0];
    show = true;
  }

  function handleDismiss() {
    if (currentToast) {
      toast.dismiss(currentToast.id);
    }
    show = false;
    currentToast = null;
  }
</script>

{#if currentToast}
  <Toast
    bind:show
    message={currentToast.message}
    type={currentToast.type}
    duration={currentToast.duration}
  />
{/if}
