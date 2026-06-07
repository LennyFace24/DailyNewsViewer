<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { Download, X, FileText, Database } from 'lucide-svelte';
  import { articles } from '$lib/stores/articles';
  import { enabledSources } from '$lib/stores/sources';

  export let open = false;

  const dispatch = createEventDispatcher();

  let isClosing = false;
  let isExporting = false;

  function close() {
    isClosing = true;
    setTimeout(() => {
      open = false;
      isClosing = false;
    }, 200);
  }

  function exportAsJSON() {
    isExporting = true;
    try {
      const data = {
        exportDate: new Date().toISOString(),
        version: '1.0',
        articles: $articles.filter(a => a.isBookmarked).map(a => ({
          title: a.title,
          url: a.url,
          summary: a.summary,
          author: a.author,
          sourceName: a.sourceName,
          publishedAt: a.publishedAt,
          isBookmarked: a.isBookmarked
        }))
      };

      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      downloadBlob(blob, `dailytech-export-${formatDate()}.json`);
      close();
    } finally {
      isExporting = false;
    }
  }

  function exportAsOPML() {
    isExporting = true;
    try {
      const sources = $enabledSources;
      let opml = `<?xml version="1.0" encoding="UTF-8"?>
<opml version="2.0">
  <head>
    <title>DailyTech Subscriptions</title>
    <dateCreated>${new Date().toISOString()}</dateCreated>
  </head>
  <body>
    <outline text="DailyTech" title="DailyTech">
`;

      for (const source of sources) {
        opml += `      <outline type="rss" text="${escapeXml(source.name)}" title="${escapeXml(source.name)}" xmlUrl="${escapeXml(source.url)}" />\n`;
      }

      opml += `    </outline>
  </body>
</opml>`;

      const blob = new Blob([opml], { type: 'application/xml' });
      downloadBlob(blob, `dailytech-subscriptions-${formatDate()}.opml`);
      close();
    } finally {
      isExporting = false;
    }
  }

  function exportBookmarks() {
    isExporting = true;
    try {
      const bookmarks = $articles.filter(a => a.isBookmarked);
      let md = `# DailyTech 收藏导出\n\n导出时间: ${new Date().toLocaleString('zh-CN')}\n\n`;

      for (const article of bookmarks) {
        md += `## ${article.title}\n\n`;
        md += `- 来源: ${article.sourceName}\n`;
        md += `- 链接: [${article.url}](${article.url})\n`;
        md += `- 作者: ${article.author}\n`;
        md += `- 时间: ${new Date(article.publishedAt).toLocaleString('zh-CN')}\n\n`;
        if (article.summary) {
          md += `> ${article.summary}\n\n`;
        }
        md += `---\n\n`;
      }

      const blob = new Blob([md], { type: 'text/markdown' });
      downloadBlob(blob, `dailytech-bookmarks-${formatDate()}.md`);
      close();
    } finally {
      isExporting = false;
    }
  }

  function downloadBlob(blob: Blob, filename: string) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  function formatDate(): string {
    return new Date().toISOString().split('T')[0];
  }

  function escapeXml(str: string): string {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
</script>

{#if open}
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <div class="modal-overlay" class:fade-out={isClosing} on:click={close}>
    <div class="modal-box glass-card" class:scale-out={isClosing} on:click|stopPropagation>
      <div class="modal-header">
        <h3>导出数据</h3>
        <button class="close-btn" on:click={close}>
          <X class="w-5 h-5" />
        </button>
      </div>

      <div class="export-options">
        <button class="export-option" on:click={exportBookmarks} disabled={isExporting}>
          <div class="option-icon">
            <Bookmark class="w-5 h-5" />
          </div>
          <div class="option-info">
            <div class="option-title">收藏文章</div>
            <div class="option-desc">导出收藏的文章为 Markdown 格式</div>
          </div>
        </button>

        <button class="export-option" on:click={exportAsOPML} disabled={isExporting}>
          <div class="option-icon">
            <FileText class="w-5 h-5" />
          </div>
          <div class="option-info">
            <div class="option-title">订阅源</div>
            <div class="option-desc">导出 RSS 订阅源为 OPML 格式</div>
          </div>
        </button>

        <button class="export-option" on:click={exportAsJSON} disabled={isExporting}>
          <div class="option-icon">
            <Database class="w-5 h-5" />
          </div>
          <div class="option-info">
            <div class="option-title">完整备份</div>
            <div class="option-desc">导出所有数据为 JSON 格式</div>
          </div>
        </button>
      </div>
    </div>
  </div>
{/if}

<style>
  .modal-overlay {
    position: fixed;
    inset: 0;
    z-index: 200;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 24px;
    background: rgba(0, 0, 0, 0.7);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    animation: fadeIn 0.2s ease-out;
  }

  .modal-box {
    width: 100%;
    max-width: 400px;
    animation: scaleIn 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  }

  .fade-out {
    animation: fadeOut 0.2s ease-out forwards;
  }

  .scale-out {
    animation: scaleOut 0.2s ease-out forwards;
  }

  .modal-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20px 20px 0;
  }

  .modal-header h3 {
    font-size: 18px;
    font-weight: 600;
  }

  .close-btn {
    width: 32px;
    height: 32px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: rgba(255, 255, 255, 0.5);
    background: transparent;
    border: none;
    cursor: pointer;
  }
  .close-btn:active {
    background: rgba(255, 255, 255, 0.1);
  }

  .export-options {
    padding: 16px 20px 20px;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .export-option {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 14px;
    border-radius: 12px;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.08);
    cursor: pointer;
    transition: all 0.2s;
    text-align: left;
    width: 100%;
  }
  .export-option:active {
    background: rgba(255, 255, 255, 0.1);
    transform: scale(0.98);
  }
  .export-option:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .option-icon {
    width: 40px;
    height: 40px;
    border-radius: 10px;
    background: rgba(255, 255, 255, 0.08);
    display: flex;
    align-items: center;
    justify-content: center;
    color: rgba(255, 255, 255, 0.7);
    flex-shrink: 0;
  }

  .option-info {
    flex: 1;
  }

  .option-title {
    font-size: 14px;
    font-weight: 500;
    margin-bottom: 2px;
  }

  .option-desc {
    font-size: 12px;
    color: rgba(255, 255, 255, 0.4);
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @keyframes fadeOut {
    from { opacity: 1; }
    to { opacity: 0; }
  }

  @keyframes scaleIn {
    from { opacity: 0; transform: scale(0.95); }
    to { opacity: 1; transform: scale(1); }
  }

  @keyframes scaleOut {
    from { opacity: 1; transform: scale(1); }
    to { opacity: 0; transform: scale(0.95); }
  }
</style>
