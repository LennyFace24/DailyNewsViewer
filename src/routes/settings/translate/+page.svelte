<script lang="ts">
  import { goto } from '$app/navigation';
  import { ArrowLeft, Languages } from 'lucide-svelte';
  import { settings, updateSetting } from '$lib/stores/settings';
  import { AI_PROVIDERS } from '$lib/types/settings';

  let testResult = '';
  let isTesting = false;

  async function testConnection() {
    if (!$settings.aiApiKey || !$settings.aiBaseUrl) {
      testResult = '请填写 Base URL 和 API Key';
      return;
    }

    isTesting = true;
    testResult = '';

    try {
      const provider = AI_PROVIDERS[$settings.aiProvider];
      const url = `${$settings.aiBaseUrl}${provider.endpoint}`;
      const headers = provider.headers($settings.aiApiKey);
      const body = provider.body('Hello, world!', '');

      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify(body),
        signal: AbortSignal.timeout(10000)
      });

      if (response.ok) {
        const data = await response.json();
        const translated = provider.parseResponse(data);
        testResult = translated ? `✅ 连接成功: ${translated}` : '❌ 响应格式错误';
      } else {
        testResult = `❌ 错误: ${response.status}`;
      }
    } catch (error) {
      testResult = `❌ 连接失败: ${error}`;
    } finally {
      isTesting = false;
    }
  }
</script>

<div class="min-h-screen pb-20">
  <!-- 顶部栏 -->
  <div class="sticky top-0 z-40 glass" style="padding-top: env(safe-area-inset-top, 0px);">
    <div class="flex items-center gap-3 px-4 h-14">
      <button class="back-btn" on:click={() => goto('/settings')}>
        <ArrowLeft class="w-5 h-5" />
      </button>
      <div class="flex items-center gap-2">
        <Languages class="w-5 h-5" />
        <span class="font-medium">AI 翻译设置</span>
      </div>
    </div>
  </div>

  <div class="px-4 py-6">
    <!-- 开关 -->
    <section class="mb-6">
      <div class="glass-card overflow-hidden">
        <div class="setting-row">
          <div>
            <div class="setting-label">启用 AI 翻译</div>
            <div class="setting-desc">翻译文章摘要为中文</div>
          </div>
          <div class="toggle" class:active={$settings.aiTranslateEnabled} on:click={() => updateSetting('aiTranslateEnabled', !$settings.aiTranslateEnabled)}>
            <div class="toggle-thumb" class:active={$settings.aiTranslateEnabled} />
          </div>
        </div>
      </div>
    </section>

    {#if $settings.aiTranslateEnabled}
      <!-- 提供商选择 -->
      <section class="mb-6">
        <h2 class="section-title">AI 提供商</h2>
        <div class="glass-card overflow-hidden">
          <div class="p-4">
            <div class="flex gap-2">
              {#each Object.entries(AI_PROVIDERS) as [key, provider]}
                <button
                  class="option-btn {$settings.aiProvider === key ? 'active' : ''}"
                  on:click={() => updateSetting('aiProvider', key)}
                >
                  {provider.name}
                </button>
              {/each}
            </div>
          </div>
        </div>
      </section>

      <!-- API配置 -->
      <section class="mb-6">
        <h2 class="section-title">API 配置</h2>
        <div class="glass-card overflow-hidden">
          <div class="p-4 space-y-4">
            <div>
              <label class="input-label">Base URL</label>
              <input
                value={$settings.aiBaseUrl}
                on:change={(e) => updateSetting('aiBaseUrl', e.currentTarget.value)}
                placeholder={AI_PROVIDERS[$settings.aiProvider]?.baseUrlPlaceholder || ''}
                class="input-field"
              />
              <p class="input-hint">例如: https://api.openai.com/v1</p>
            </div>

            <div>
              <label class="input-label">API Key</label>
              <input
                type="password"
                value={$settings.aiApiKey}
                on:change={(e) => updateSetting('aiApiKey', e.currentTarget.value)}
                placeholder="sk-..."
                class="input-field"
              />
            </div>

            <button class="test-btn" on:click={testConnection} disabled={isTesting}>
              {isTesting ? '测试中...' : '测试连接'}
            </button>

            {#if testResult}
              <div class="test-result" class:success={testResult.startsWith('✅')}>
                {testResult}
              </div>
            {/if}
          </div>
        </div>
      </section>

      <!-- 说明 -->
      <section>
        <div class="glass-card p-4">
          <h3 class="text-sm font-medium mb-2">使用说明</h3>
          <ul class="text-xs text-muted-foreground space-y-1">
            <li>• 翻译功能会自动翻译文章摘要</li>
            <li>• 支持 OpenAI 兼容 API 和 Anthropic Claude</li>
            <li>• 翻译结果会缓存，避免重复请求</li>
            <li>• 仅翻译前 500 个字符</li>
          </ul>
        </div>
      </section>
    {/if}
  </div>
</div>

<style>
  .back-btn {
    width: 36px;
    height: 36px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    background: transparent;
    border: none;
    cursor: pointer;
  }
  .back-btn:active {
    background: rgba(255, 255, 255, 0.1);
  }

  .section-title {
    font-size: 12px;
    font-weight: 500;
    color: rgba(255, 255, 255, 0.4);
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin-bottom: 12px;
  }

  .setting-row {
    padding: 16px;
    display: flex;
    align-items: center;
    justify-content: space-between;
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

  .input-label {
    font-size: 12px;
    color: rgba(255, 255, 255, 0.4);
    margin-bottom: 6px;
    display: block;
  }

  .input-field {
    width: 100%;
    padding: 12px;
    border-radius: 10px;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    color: white;
    font-size: 14px;
    outline: none;
    font-family: monospace;
  }
  .input-field:focus {
    border-color: rgba(255, 255, 255, 0.2);
  }

  .input-hint {
    font-size: 11px;
    color: rgba(255, 255, 255, 0.3);
    margin-top: 4px;
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
    padding: 10px 12px;
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

  .test-btn {
    width: 100%;
    padding: 12px;
    border-radius: 10px;
    background: rgba(255, 255, 255, 0.1);
    color: white;
    font-size: 14px;
    border: none;
    cursor: pointer;
    transition: background 0.2s;
  }
  .test-btn:active {
    background: rgba(255, 255, 255, 0.2);
  }
  .test-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .test-result {
    padding: 12px;
    border-radius: 10px;
    background: rgba(239, 68, 68, 0.1);
    font-size: 13px;
    color: rgba(255, 255, 255, 0.8);
  }
  .test-result.success {
    background: rgba(34, 197, 94, 0.1);
  }
</style>
