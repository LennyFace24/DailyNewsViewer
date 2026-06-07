<script lang="ts">
  export let value: number = 0;
  export let max: number = 100;
  export let size: number = 48;
  export let strokeWidth: number = 4;

  $: percentage = Math.min(100, Math.max(0, (value / max) * 100));
  $: radius = (size - strokeWidth) / 2;
  $: circumference = 2 * Math.PI * radius;
  $: offset = circumference - (percentage / 100) * circumference;
</script>

<div class="progress-circle" style="width: {size}px; height: {size}px">
  <svg viewBox="0 0 {size} {size}">
    <circle
      class="track"
      cx={size / 2}
      cy={size / 2}
      r={radius}
      fill="none"
      stroke-width={strokeWidth}
    />
    <circle
      class="fill"
      cx={size / 2}
      cy={size / 2}
      r={radius}
      fill="none"
      stroke-width={strokeWidth}
      stroke-dasharray={circumference}
      stroke-dashoffset={offset}
      stroke-linecap="round"
      transform="rotate(-90 {size / 2} {size / 2})"
    />
  </svg>
  <span class="label">{Math.round(percentage)}%</span>
</div>

<style>
  .progress-circle {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }

  svg {
    width: 100%;
    height: 100%;
    transform: rotate(0deg);
  }

  .track {
    stroke: rgba(255, 255, 255, 0.06);
  }

  .fill {
    stroke: rgba(255, 255, 255, 0.6);
    transition: stroke-dashoffset 0.5s ease;
  }

  .label {
    position: absolute;
    font-size: 11px;
    font-weight: 600;
    color: rgba(255, 255, 255, 0.7);
  }
</style>
