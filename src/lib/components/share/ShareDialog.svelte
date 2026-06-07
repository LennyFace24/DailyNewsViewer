<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { X, Copy, Twitter, MessageCircle, Link, Check } from 'lucide-svelte';
  import type { Article } from '$lib/types/news';

  export let open = false;
  export let article: Article | null = null;

  const dispatch = createEventDispatcher();

  let isClosing = false;
  let copied = false;

  function close() {
    isClosing = true;
    setTimeout(() => {
      open = false;
      isClosing = false;
    }, 200);
  }

  function copyLink() {
    if (!article) return;
    navigator.clipboard.writeText(article.url);
    copied = true;
    setTimeout(() => copied = false, 2000);
  }

  function shareToTwitter() {
    if (!article) return;
    const text = encodeURIComponent(article.title);
    const url = encodeURIComponent(article.url);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank');
    close();
  }

  function shareToWeibo() {
    if (!article) return;
    const text = encodeURIComponent(`${article.title} ${article.url}`);
    window.open(`https://service.weibo.com/share/share.php?title=${text}`, '_blank');
    close();
  }

  function shareNative() {
    if (!article || !navigator.share) return;
    navigator.share({
      title: article.title,
      url: article.url,
      text: article.summary
    });
    close();
  }
</script>

{#if open && article}
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <div class="modal-overlay" class:fade-out={isClosing} on:click={close}>
    <div class="modal-box glass-card" class:scale-out={isClosing} on:click|stopPropagation>
      <div class="modal-header">
        <h3>分享文章</h3>
        <button class="close-btn" on:click={close}>
          <X class="w-5 h-5" />
        </button>
      </div>

      <div class="article-preview">
        <h4 class="article-title">{article.title}</h4>
        <p class="article-source">{article.sourceName}</p>
      </div>

      <div class="share-options">
        <button class="share-option" on:click={copyLink}>
          <div class="option-icon">
            {#if copied}
              <Check class="w-5 h-5 text-green-400" />
            {:else}
              <Copy class="w-5 h-5" />
            {/if}
          </div>
          <span>{copied ? '已复制' : '复制链接'}</span>
        </button>

        <button class="share-option" on:click={shareToTwitter}>
          <div class="option-icon twitter">
            <Twitter class="w-5 h-5" />
          </div>
          <span>Twitter</span>
        </button>

        <button class="share-option" on:click={shareToWeibo}>
          <div class="option-icon weibo">
            <MessageCircle class="w-5 h-5" />
          </div>
          <span>微博</span>
        </button>

        {#if typeof navigator.share !== 'undefined'}
          <button class="share-option" on:click={shareNative}>
            <div class="option-icon">
              <Link class="w-5 h-5" />
            </div>
            <span>更多</span>
          </button>
        {/if}
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
    align-items: flex-end;
    justify-content: center;
    background: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    animation: fadeIn 0.2s ease-out;
  }

  .modal-box {
    width: 100%;
    max-width: 500px;
    border-radius: 20px 20px 0 0;
    animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  }

  .fade-out {
    animation: fadeOut 0.2s ease-out forwards;
  }

  .scale-out {
    animation: slideDown 0.2s ease-out forwards;
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

  .article-preview {
    padding: 16px 20px;
    margin: 12px 20px;
    background: rgba(255, 255, 255, 0.03);
    border-radius: 12px;
    border: 1px solid rgba(255, 255, 255, 0.05);
  }

  .article-title {
    font-size: 14px;
    font-weight: 500;
    margin-bottom: 4px;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .article-source {
    font-size: 12px;
    color: rgba(255, 255, 255, 0.4);
  }

  .share-options {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 12px;
    padding: 16px 20px 24px;
  }

  .share-option {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    padding: 12px 8px;
    border-radius: 12px;
    background: transparent;
    border: none;
    color: rgba(255, 255, 255, 0.7);
    cursor: pointer;
    transition: all 0.2s;
  }
  .share-option:active {
    background: rgba(255, 255, 255, 0.05);
    transform: scale(0.95);
  }

  .option-icon {
    width: 48px;
    height: 48px;
    border-radius: 14px;
    background: rgba(255, 255, 255, 0.08);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .option-icon.twitter {
    background: rgba(29, 161, 242, 0.2);
    color: rgb(29, 161, 242);
  }

  .option-icon.weibo {
    background: rgba(230, 22, 45, 0.2);
    color: rgb(230, 22, 45);
  }

  .share-option span {
    font-size: 12px;
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @keyframes fadeOut {
    from { opacity: 1; }
    to { opacity: 0; }
  }

  @keyframes slideUp {
    from { transform: translateY(100%); }
    to { transform: translateY(0); }
  }

  @keyframes slideDown {
    from { transform: translateY(0); }
    to { transform: translateY(100%); }
  }
</style>
