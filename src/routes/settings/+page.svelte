<script lang="ts">
  import { goto } from '$app/navigation';
  import { Globe, Layout, Eye, CheckCheck, Trash2, RotateCcw, Info, Languages } from 'lucide-svelte';
  import { settings, updateSetting, resetSettings } from '$lib/stores/settings';
  import { articles, markAllAsRead } from '$lib/stores/articles';
  import { ArticleCache } from '$lib/services/storage';

  $: unreadCount = $articles.filter(a => !a.isRead).length;
  $: bookmarkCount = $articles.filter(a => a.isBookmarked).length;

  let showClearDialog = false;
  let showResetDialog = false;

  function clearCache() {
    ArticleCache.clearExpired();
    showClearDialog = false;
    window.location.reload();
  }
</script>

<div class="min-h-screen pb-20">
  <div class="px-4 py-6">
    <h1 class="text-2xl font-bold mb-6">设置</h1>

    <!-- 代理设置 -->
    <section class="mb-6">
      <h2 class="section-title"><Globe class="w-3.5 h-3.5" /> 网络代理</h2>
      <div class="glass-card overflow-hidden">
        <div class="setting-row">
          <div>
            <div class="setting-label">启用代理</div>
            <div class="setting-desc">通过代理服务器访问网络</div>
          </div>
          <div class="toggle" class:active={$settings.proxyEnabled} on:click={() => updateSetting('proxyEnabled', !$settings.proxyEnabled)}>
            <div class="toggle-thumb" class:active={$settings.proxyEnabled} />
          </div>
        </div>

        {#if $settings.proxyEnabled}
          <div class="p-4 space-y-3 border-t border-white/5">
            <div>
              <label class="input-label">代理类型</label>
              <div class="flex gap-2">
                {#each ['http', 'https', 'socks5'] as type}
                  <button
                    class="option-btn {$settings.proxyType === type ? 'active' : ''}"
                    on:click={() => updateSetting('proxyType', type)}
                  >
                    {type.toUpperCase()}
                  </button>
                {/each}
              </div>
            </div>
            <div class="flex gap-3">
              <div class="flex-1">
                <label class="input-label">主机</label>
                <input
                  value={$settings.proxyHost}
                  on:change={(e) => updateSetting('proxyHost', e.currentTarget.value)}
                  placeholder="127.0.0.1"
                  class="input-field"
                />
              </div>
              <div class="w-24">
                <label class="input-label">端口</label>
                <input
                  value={$settings.proxyPort}
                  on:change={(e) => updateSetting('proxyPort', e.currentTarget.value)}
                  placeholder="7890"
                  class="input-field"
                />
              </div>
            </div>
          </div>
        {/if}
      </div>
    </section>

    <!-- AI翻译 -->
    <section class="mb-6">
      <h2 class="section-title"><Languages class="w-3.5 h-3.5" /> AI 翻译</h2>
      <div class="glass-card overflow-hidden">
        <div class="setting-row" on:click={() => goto('/settings/translate')}>
          <div>
            <div class="setting-label">翻译设置</div>
            <div class="setting-desc">{$settings.aiTranslateEnabled ? '已开启' : '未开启'}</div>
          </div>
          <div class="text-white/30">›</div>
        </div>
      </div>
    </section>

    <!-- 外观 -->
    <section class="mb-6">
      <h2 class="section-title"><Layout class="w-3.5 h-3.5" /> 外观</h2>
      <div class="glass-card overflow-hidden">
        <div class="setting-row">
          <div class="setting-label">卡片样式</div>
          <div class="flex gap-2">
            {#each ['compact', 'comfortable', 'spacious'] as style}
              <button
                class="option-btn {$settings.cardStyle === style ? 'active' : ''}"
                on:click={() => updateSetting('cardStyle', style)}
              >
                {style === 'compact' ? '紧凑' : style === 'comfortable' ? '舒适' : '宽松'}
              </button>
            {/each}
          </div>
        </div>
      </div>
    </section>

    <!-- 阅读 -->
    <section class="mb-6">
      <h2 class="section-title"><Eye class="w-3.5 h-3.5" /> 阅读</h2>
      <div class="glass-card overflow-hidden">
        <div class="setting-row">
          <div class="setting-label">显示图片</div>
          <div class="toggle" class:active={$settings.showImages} on:click={() => updateSetting('showImages', !$settings.showImages)}>
            <div class="toggle-thumb" class:active={$settings.showImages} />
          </div>
        </div>
        <div class="setting-row">
          <div class="setting-label">自动标记已读</div>
          <div class="toggle" class:active={$settings.markAsReadOnView} on:click={() => updateSetting('markAsReadOnView', !$settings.markAsReadOnView)}>
            <div class="toggle-thumb" class:active={$settings.markAsReadOnView} />
          </div>
        </div>
      </div>
    </section>

    <!-- 数据 -->
    <section class="mb-6">
      <h2 class="section-title"><Info class="w-3.5 h-3.5" /> 数据</h2>
      <div class="glass-card overflow-hidden">
        <div class="setting-row">
          <div class="setting-label">未读</div>
          <div class="setting-value">{unreadCount}</div>
        </div>
        <div class="setting-row">
          <div class="setting-label">收藏</div>
          <div class="setting-value">{bookmarkCount}</div>
        </div>
        <div class="action-row" on:click={markAllAsRead}>
          <CheckCheck class="w-4 h-4 text-muted-foreground" />
          <span>全部标为已读</span>
        </div>
        <div class="action-row" on:click={() => showClearDialog = true}>
          <Trash2 class="w-4 h-4 text-muted-foreground" />
          <span>清除缓存</span>
        </div>
      </div>
    </section>

    <button class="reset-btn" on:click={() => showResetDialog = true}>
      <RotateCcw class="w-4 h-4" /> 恢复默认
    </button>

    <p class="text-center text-xs text-muted-foreground/40 mt-6">DailyTech v0.7.0</p>
  </div>
</div>

<!-- 清除缓存弹窗 -->
{#if showClearDialog}
  <div class="modal-overlay" on:click={() => showClearDialog = false}>
    <div class="modal-box glass-card" on:click|stopPropagation>
      <div class="modal-icon-box">
        <Trash2 class="w-8 h-8 text-muted-foreground" />
      </div>
      <div class="modal-text">
        <h3>清除缓存</h3>
        <p>确定要清除缓存吗？收藏内容不会丢失。</p>
      </div>
      <div class="modal-actions">
        <button class="secondary-btn" on:click={() => showClearDialog = false}>取消</button>
        <button class="primary-btn" on:click={clearCache}>确定</button>
      </div>
    </div>
  </div>
{/if}

<!-- 恢复默认弹窗 -->
{#if showResetDialog}
  <div class="modal-overlay" on:click={() => showResetDialog = false}>
    <div class="modal-box glass-card" on:click|stopPropagation>
      <div class="modal-icon-box">
        <RotateCcw class="w-8 h-8 text-muted-foreground" />
      </div>
      <div class="modal-text">
        <h3>恢复默认设置</h3>
        <p>确定要恢复所有设置为默认值吗？</p>
      </div>
      <div class="modal-actions">
        <button class="secondary-btn" on:click={() => showResetDialog = false}>取消</button>
        <button class="primary-btn" on:click={() => { resetSettings(); showResetDialog = false; }}>确定</button>
      </div>
    </div>
  </div>
{/if}

<style>
  .section-title {
    font-size: 12px;
    font-weight: 500;
    color: rgba(255, 255, 255, 0.4);
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin-bottom: 12px;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .setting-row {
    padding: 16px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    cursor: pointer;
  }

  .setting-label {
    font-size: 14px;
    font-weight: 500;
  }

  .setting-desc {
    font-size: 12px;
    color: rgba(255, 255, 255, 0.4);
    margin-top: 2px;
  }

  .setting-value {
    font-size: 14px;
    color: rgba(255, 255, 255, 0.5);
  }

  .input-label {
    font-size: 12px;
    color: rgba(255, 255, 255, 0.4);
    margin-bottom: 4px;
    display: block;
  }

  .input-field {
    width: 100%;
    padding: 10px 12px;
    border-radius: 8px;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    color: white;
    font-size: 14px;
    outline: none;
  }
  .input-field:focus {
    border-color: rgba(255, 255, 255, 0.2);
  }

  .toggle {
    width: 48px;
    height: 28px;
    border-radius: 14px;
    background: rgba(255, 255, 255, 0.1);
    padding: 2px;
    cursor: pointer;
    transition: background 0.2s;
    flex-shrink: 0;
  }
  .toggle.active {
    background: rgba(255, 255, 255, 0.25);
  }
  .toggle:active {
    background: rgba(255, 255, 255, 0.2);
  }

  .toggle-thumb {
    width: 24px;
    height: 24px;
    border-radius: 12px;
    background: white;
    transition: transform 0.2s;
  }
  .toggle-thumb.active {
    transform: translateX(20px);
  }

  .option-btn {
    flex: 1;
    padding: 8px 12px;
    border-radius: 8px;
    background: rgba(255, 255, 255, 0.05);
    color: rgba(255, 255, 255, 0.5);
    font-size: 12px;
    font-weight: 500;
    border: none;
    cursor: pointer;
    transition: all 0.2s;
  }
  .option-btn.active {
    background: rgba(255, 255, 255, 0.2);
    color: white;
  }
  .option-btn:active {
    background: rgba(255, 255, 255, 0.15);
  }

  .action-row {
    padding: 16px;
    display: flex;
    align-items: center;
    gap: 12px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    font-size: 14px;
    color: rgba(255, 255, 255, 0.7);
    cursor: pointer;
    transition: background 0.2s;
  }
  .action-row:active {
    background: rgba(255, 255, 255, 0.05);
  }

  .reset-btn {
    width: 100%;
    padding: 12px;
    border-radius: 12px;
    background: rgba(255, 255, 255, 0.08);
    color: white;
    font-size: 14px;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    transition: background 0.2s;
  }
  .reset-btn:active {
    background: rgba(255, 255, 255, 0.15);
  }

  /* 弹窗 */
  .modal-overlay {
    position: fixed;
    inset: 0;
    z-index: 100;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 24px;
    background: rgba(0, 0, 0, 0.7);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
  }

  .modal-box {
    width: 100%;
    max-width: 384px;
    padding: 24px;
  }

  .modal-icon-box {
    display: flex;
    justify-content: center;
    margin-bottom: 16px;
  }

  .modal-text {
    text-align: center;
    margin-bottom: 24px;
  }
  .modal-text h3 {
    font-size: 18px;
    font-weight: 600;
    margin-bottom: 8px;
  }
  .modal-text p {
    font-size: 14px;
    color: rgba(255, 255, 255, 0.5);
  }

  .modal-actions {
    display: flex;
    gap: 12px;
  }

  .primary-btn {
    flex: 1;
    padding: 12px;
    border-radius: 12px;
    background: rgba(255, 255, 255, 0.15);
    color: white;
    font-size: 14px;
    font-weight: 500;
    border: none;
    cursor: pointer;
    transition: background 0.2s;
  }
  .primary-btn:active {
    background: rgba(255, 255, 255, 0.25);
  }

  .secondary-btn {
    flex: 1;
    padding: 12px;
    border-radius: 12px;
    background: rgba(255, 255, 255, 0.08);
    color: white;
    font-size: 14px;
    border: none;
    cursor: pointer;
    transition: background 0.2s;
  }
  .secondary-btn:active {
    background: rgba(255, 255, 255, 0.15);
  }
</style>
