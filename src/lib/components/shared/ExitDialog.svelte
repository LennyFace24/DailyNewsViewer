<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { Button } from '$lib/components/ui/button/index.js';
  import { LogOut, X } from 'lucide-svelte';

  export let open = false;

  const dispatch = createEventDispatcher();

  let isClosing = false;

  function close() {
    isClosing = true;
    setTimeout(() => {
      open = false;
      isClosing = false;
    }, 200);
  }

  function confirm() {
    dispatch('confirm');
    close();
  }
</script>

{#if open}
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <div
    class="fixed inset-0 z-[100] flex items-center justify-center p-6 modal-backdrop"
    class:fade-out={isClosing}
    on:click={close}
  >
    <div
      class="glass-card w-full max-w-sm p-6 scale-in"
      class:scale-out={isClosing}
      on:click|stopPropagation
    >
      <!-- 图标 -->
      <div class="flex justify-center mb-4">
        <div class="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center">
          <LogOut class="w-8 h-8 text-muted-foreground" />
        </div>
      </div>

      <!-- 内容 -->
      <div class="text-center mb-6">
        <h3 class="text-lg font-semibold mb-2">退出应用</h3>
        <p class="text-sm text-muted-foreground">确定要退出 DailyTech 吗？</p>
      </div>

      <!-- 按钮 -->
      <div class="flex gap-3">
        <Button
          variant="outline"
          class="flex-1 bg-white/5 border-white/10 hover:bg-white/10"
          on:click={close}
        >
          取消
        </Button>
        <Button
          class="flex-1 bg-white/10 hover:bg-white/15"
          on:click={confirm}
        >
          退出
        </Button>
      </div>
    </div>
  </div>
{/if}

<style>
  .modal-backdrop {
    background: rgba(0, 0, 0, 0.7);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
  }

  .fade-out {
    animation: fadeOut 0.2s ease-out forwards;
  }

  .scale-out {
    animation: scaleOut 0.2s ease-out forwards;
  }

  @keyframes fadeOut {
    from { opacity: 1; }
    to { opacity: 0; }
  }

  @keyframes scaleOut {
    from { opacity: 1; transform: scale(1); }
    to { opacity: 0; transform: scale(0.95); }
  }
</style>
