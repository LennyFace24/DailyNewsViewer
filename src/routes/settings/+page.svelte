<script lang="ts">
  import { goto } from '$app/navigation';
  import { Globe, Layout, Eye, CheckCheck, Trash2, RotateCcw, Info, Languages, Download, BookOpen, BarChart3, Bell } from 'lucide-svelte';
  import { settings, updateSetting, resetSettings } from '$lib/stores/settings';
  import { articles, markAllAsRead } from '$lib/stores/articles';
  import { ArticleCache } from '$lib/services/storage';
  import { checkForUpdate, getCurrentVersion, compareVersions } from '$lib/services/updater';
  import type { ReleaseInfo } from '$lib/services/updater';
  import { readingStats, clearReadingProgress, loadReadingProgress } from '$lib/stores/reading';
  import UpdateDialog from '$lib/components/shared/UpdateDialog.svelte';
  import ExportDialog from '$lib/components/shared/ExportDialog.svelte';
  import AboutDialog from '$lib/components/shared/AboutDialog.svelte';
  import ConfirmDialog from '$lib/components/shared/ConfirmDialog.svelte';
  import Progress from '$lib/components/shared/Progress.svelte';
  import Switch from '$lib/components/shared/Switch.svelte';
  import { onMount } from 'svelte';

  $: unreadCount = $articles.filter(a => !a.isRead).length;
  $: bookmarkCount = $articles.filter(a => a.isBookmarked).length;

  onMount(() => {
    loadReadingProgress();
  });

  let showClearDialog = false;
  let showResetDialog = false;
  let showUpdateDialog = false;
  let showExportDialog = false;
  let showAboutDialog = false;
  let latestRelease: ReleaseInfo | null = null;
  let isCheckingUpdate = false;
  let updateMessage = '';

  const currentVersion = getCurrentVersion();

  function clearCache() {
    ArticleCache.clearExpired();
    showClearDialog = false;
    window.location.reload();
  }

  async function handleCheckUpdate() {
    isCheckingUpdate = true;
    updateMessage = '';

    try {
      const { release, error } = await checkForUpdate();

      if (error) {
        updateMessage = error;
        return;
      }

      if (!release) {
        updateMessage = '无法获取更新信息';
        return;
      }

      const comparison = compareVersions(currentVersion, release.version);

      if (comparison > 0) {
        latestRelease = release;
        showUpdateDialog = true;
      } else {
        updateMessage = '已是最新版本';
      }
    } catch (error) {
      updateMessage = '检查更新失败';
    } finally {
      isCheckingUpdate = false;
    }
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
          <Switch
            checked={$settings.proxyEnabled}
            on:click={() => updateSetting('proxyEnabled', !$settings.proxyEnabled)}
          />
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

    <!-- 通知 -->
    <section class="mb-6">
      <h2 class="section-title"><Bell class="w-3.5 h-3.5" /> 通知</h2>
      <div class="glass-card overflow-hidden">
        <div class="setting-row">
          <div>
            <div class="setting-label">推送通知</div>
            <div class="setting-desc">新文章到达时通知</div>
          </div>
          <Switch
            checked={$settings.notificationsEnabled}
            on:click={() => updateSetting('notificationsEnabled', !$settings.notificationsEnabled)}
          />
        </div>

        {#if $settings.notificationsEnabled}
          <div class="p-4 space-y-3 border-t border-white/5">
            <div>
              <label class="input-label">通知频率</label>
              <div class="flex gap-2">
                <button
                  class="option-btn {$settings.notificationFrequency === 'hourly' ? 'active' : ''}"
                  on:click={() => updateSetting('notificationFrequency', 'hourly')}
                >
                  每小时
                </button>
                <button
                  class="option-btn {$settings.notificationFrequency === 'daily' ? 'active' : ''}"
                  on:click={() => updateSetting('notificationFrequency', 'daily')}
                >
                  每天
                </button>
              </div>
            </div>

            <div class="flex items-center justify-between">
              <div>
                <div class="text-sm">安静时间</div>
                <div class="text-xs text-muted-foreground">在此期间不发送通知</div>
              </div>
              <Switch
                checked={$settings.quietHoursEnabled}
                on:click={() => updateSetting('quietHoursEnabled', !$settings.quietHoursEnabled)}
              />
            </div>

            {#if $settings.quietHoursEnabled}
              <div class="flex gap-3">
                <div class="flex-1">
                  <label class="input-label">开始</label>
                  <input
                    type="time"
                    value={$settings.quietHoursStart}
                    on:change={(e) => updateSetting('quietHoursStart', e.currentTarget.value)}
                    class="input-field"
                  />
                </div>
                <div class="flex-1">
                  <label class="input-label">结束</label>
                  <input
                    type="time"
                    value={$settings.quietHoursEnd}
                    on:change={(e) => updateSetting('quietHoursEnd', e.currentTarget.value)}
                    class="input-field"
                  />
                </div>
              </div>
            {/if}
          </div>
        {/if}
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
          <Switch
            checked={$settings.showImages}
            on:click={() => updateSetting('showImages', !$settings.showImages)}
          />
        </div>
        <div class="setting-row">
          <div class="setting-label">自动标记已读</div>
          <Switch
            checked={$settings.markAsReadOnView}
            on:click={() => updateSetting('markAsReadOnView', !$settings.markAsReadOnView)}
          />
        </div>
      </div>
    </section>

    <!-- 阅读统计 -->
    <section class="mb-6">
      <h2 class="section-title"><BarChart3 class="w-3.5 h-3.5" /> 阅读统计</h2>
      <div class="glass-card overflow-hidden">
        <div class="stats-grid">
          <div class="stat-item">
            <div class="stat-value">{$readingStats.todayCount}</div>
            <div class="stat-label">今日阅读</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">{$readingStats.weekCount}</div>
            <div class="stat-label">本周阅读</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">{$readingStats.totalCount}</div>
            <div class="stat-label">总计阅读</div>
          </div>
        </div>
        <div class="p-4 border-t border-white/5">
          <div class="flex justify-between text-sm mb-2">
            <span>阅读进度</span>
            <span class="text-muted-foreground">{$readingStats.weekCount}/20 本周目标</span>
          </div>
          <Progress value={$readingStats.weekCount} max={20} showLabel />
        </div>
        <div class="action-row" on:click={() => goto('/stats')}>
          <BarChart3 class="w-4 h-4 text-muted-foreground" />
          <span>查看详细统计</span>
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
        <div class="action-row" on:click={() => showExportDialog = true}>
          <Download class="w-4 h-4 text-muted-foreground" />
          <span>导出数据</span>
        </div>
        <div class="action-row" on:click={() => showClearDialog = true}>
          <Trash2 class="w-4 h-4 text-muted-foreground" />
          <span>清除缓存</span>
        </div>
      </div>
    </section>

    <!-- 关于 -->
    <section class="mb-6">
      <h2 class="section-title"><Info class="w-3.5 h-3.5" /> 关于</h2>
      <div class="glass-card overflow-hidden">
        <div class="setting-row" on:click={() => showAboutDialog = true}>
          <div>
            <div class="setting-label">关于 DailyTech</div>
            <div class="setting-desc">v{currentVersion}</div>
          </div>
          <div class="text-white/30">›</div>
        </div>
        <div class="action-row" on:click={handleCheckUpdate}>
          <Download class="w-4 h-4 text-muted-foreground" />
          <span>{isCheckingUpdate ? '检查中...' : '检查更新'}</span>
        </div>
        {#if updateMessage}
          <div class="update-message">{updateMessage}</div>
        {/if}
      </div>
    </section>

    <button class="reset-btn" on:click={() => showResetDialog = true}>
      <RotateCcw class="w-4 h-4" /> 恢复默认
    </button>
  </div>
</div>

<!-- 清除缓存弹窗 -->
<ConfirmDialog
  bind:open={showClearDialog}
  title="清除缓存"
  message="确定要清除缓存吗？收藏内容不会丢失。"
  confirmText="清除"
  type="danger"
  on:confirm={clearCache}
/>

<!-- 恢复默认弹窗 -->
<ConfirmDialog
  bind:open={showResetDialog}
  title="恢复默认设置"
  message="确定要恢复所有设置为默认值吗？"
  confirmText="恢复"
  type="warning"
  on:confirm={resetSettings}
/>

<!-- 更新弹窗 -->
<UpdateDialog
  bind:open={showUpdateDialog}
  release={latestRelease}
  on:close={() => showUpdateDialog = false}
/>

<!-- 导出弹窗 -->
<ExportDialog bind:open={showExportDialog} />

<!-- 关于弹窗 -->
<AboutDialog bind:open={showAboutDialog} version={currentVersion} />

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

  .update-message {
    padding: 12px 16px;
    font-size: 13px;
    color: rgba(255, 255, 255, 0.5);
    text-align: center;
  }

  .stats-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1px;
    background: rgba(255, 255, 255, 0.05);
  }

  .stat-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 20px 16px;
    background: rgba(15, 15, 15, 0.8);
  }

  .stat-value {
    font-size: 28px;
    font-weight: 700;
    color: white;
    line-height: 1;
    margin-bottom: 6px;
  }

  .stat-label {
    font-size: 11px;
    color: rgba(255, 255, 255, 0.4);
    text-transform: uppercase;
    letter-spacing: 0.05em;
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
