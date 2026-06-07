<script lang="ts">
  import { Check } from 'lucide-svelte';

  export let steps: string[] = [];
  export let current: number = 0;
</script>

<div class="stepper">
  {#each steps as step, i}
    <div class="step {i < current ? 'completed' : i === current ? 'active' : 'pending'}">
      <div class="indicator">
        {#if i < current}
          <Check class="w-4 h-4" />
        {:else}
          <span>{i + 1}</span>
        {/if}
      </div>
      <span class="label">{step}</span>
    </div>

    {#if i < steps.length - 1}
      <div class="connector {i < current ? 'completed' : ''}" />
    {/if}
  {/each}
</div>

<style>
  .stepper {
    display: flex;
    align-items: center;
    width: 100%;
  }

  .step {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .indicator {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    font-weight: 600;
    flex-shrink: 0;
    transition: all 0.2s;
  }

  .step.completed .indicator {
    background: rgba(34, 197, 94, 0.2);
    color: rgb(34, 197, 94);
  }

  .step.active .indicator {
    background: rgba(255, 255, 255, 0.15);
    color: white;
  }

  .step.pending .indicator {
    background: rgba(255, 255, 255, 0.05);
    color: rgba(255, 255, 255, 0.3);
  }

  .label {
    font-size: 13px;
    color: rgba(255, 255, 255, 0.5);
  }

  .step.active .label {
    color: white;
    font-weight: 500;
  }

  .connector {
    flex: 1;
    height: 2px;
    margin: 0 12px;
    background: rgba(255, 255, 255, 0.08);
  }

  .connector.completed {
    background: rgba(34, 197, 94, 0.3);
  }
</style>
