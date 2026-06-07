<script lang="ts">
  import { onMount } from 'svelte';
  import { readingStats } from '$lib/stores/reading';

  export let data: { date: string; count: number }[] = [];

  let canvas: HTMLCanvasElement;
  let ctx: CanvasRenderingContext2D | null = null;

  $: if (canvas && data.length > 0) {
    drawChart();
  }

  onMount(() => {
    ctx = canvas?.getContext('2d');
    if (data.length > 0) drawChart();
  });

  function drawChart() {
    if (!ctx || !canvas) return;

    const width = canvas.width;
    const height = canvas.height;
    const padding = 40;
    const chartWidth = width - padding * 2;
    const chartHeight = height - padding * 2;

    // 清除画布
    ctx.clearRect(0, 0, width, height);

    // 计算数据范围
    const maxCount = Math.max(...data.map(d => d.count), 1);
    const barWidth = Math.max(20, (chartWidth / data.length) - 8);

    // 绘制背景网格
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
      const y = padding + (chartHeight / 4) * i;
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(width - padding, y);
      ctx.stroke();
    }

    // 绘制柱状图
    data.forEach((item, index) => {
      const x = padding + (chartWidth / data.length) * index + (chartWidth / data.length - barWidth) / 2;
      const barHeight = (item.count / maxCount) * chartHeight;
      const y = height - padding - barHeight;

      // 渐变色
      const gradient = ctx!.createLinearGradient(x, y, x, height - padding);
      gradient.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
      gradient.addColorStop(1, 'rgba(255, 255, 255, 0.3)');

      ctx!.fillStyle = gradient;
      ctx!.beginPath();
      ctx!.roundRect(x, y, barWidth, barHeight, 4);
      ctx!.fill();

      // 标签
      ctx!.fillStyle = 'rgba(255, 255, 255, 0.5)';
      ctx!.font = '10px sans-serif';
      ctx!.textAlign = 'center';
      ctx!.fillText(item.date, x + barWidth / 2, height - padding + 16);

      // 数值
      if (item.count > 0) {
        ctx!.fillStyle = 'rgba(255, 255, 255, 0.7)';
        ctx!.font = '11px sans-serif';
        ctx!.fillText(item.count.toString(), x + barWidth / 2, y - 8);
      }
    });
  }

  // 生成模拟数据（最近7天）
  function generateMockData() {
    const result = [];
    const days = ['日', '一', '二', '三', '四', '五', '六'];
    const now = new Date();

    for (let i = 6; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      result.push({
        date: days[date.getDay()],
        count: Math.floor(Math.random() * 20) + 1
      });
    }

    return result;
  }

  // 使用真实数据或模拟数据
  $: chartData = data.length > 0 ? data : generateMockData();
</script>

<div class="chart-container">
  <canvas bind:this={canvas} width="350" height="200" />
</div>

<style>
  .chart-container {
    width: 100%;
    max-width: 350px;
    margin: 0 auto;
    padding: 16px;
    background: rgba(255, 255, 255, 0.03);
    border-radius: 12px;
    border: 1px solid rgba(255, 255, 255, 0.05);
  }

  canvas {
    width: 100%;
    height: auto;
  }
</style>
