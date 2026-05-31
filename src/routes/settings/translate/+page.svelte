<script lang="ts">
  import { goto } from '$app/navigation';
  import { ArrowLeft, Languages } from 'lucide-svelte';
  import { settings, updateSetting } from '$lib/stores/settings';
  import { AI_PROVIDERS, getProviderList } from '$lib/types/settings';

  let testResult = '';
  let isTesting = false;

  $: currentProvider = AI_PROVIDERS[$settings.aiProvider];
  $: providers = getProviderList();

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
      const body = provider.body('Hello, how are you?');

      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify(body),
        signal: AbortSignal.timeout(15000)
      });

      if (response.ok) {
        const data = await response.json();
        const translated = provider.parseResponse(data);
        testResult = translated ? `✅ 成功: ${translated}` : '❌ 响应格式解析失败';
      } else {
        const errorText = await response.text();
        testResult = `❌ 错误 ${response.status}: ${errorText.substring(0, 100)}`;
      }
    } catch (error: any) {
      testResult = `❌ 连接失败: ${error.message}`;
    } finally {
      isTesting = false;
    }
  }
</script>

<div class="min-h-screen pb-20">
  <!-- 顶部栏 -->
  <div class="sticky top-0 z-40 glass">
    <div class="flex items-center gap-3 px-4 h-14">
      <button class="back-btn" on:click={() => goto('/settings')}>
        <ArrowLeft class="w-5 h-5" />
      </button>
      <div class="flex items-center gap-2">
        <Languages class="w-5 h-5" />
        <span class="font-medium">AI 翻译</span>
      </div>
    </div>
  </div>

  <div class="px-4 py-6">
    <!-- 开关 -->
    <section class="mb-6">
      <div class="glass-card overflow-hidden">
        <div class="setting-row">
          <div>
            <div class="setting-label">启用翻译</div>
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
        <h2 class="section-title">API 格式</h2>
        <div class="space-y-2">
          {#each providers as { key, config }}
            <button
              class="provider-card glass-card {$settings.aiProvider === key ? 'active' : ''}"
              on:click={() => updateSetting('aiProvider', key)}
            >
              <div class="provider-header">
                <div class="provider-radio {$settings.aiProvider === key ? 'active' : ''}" />
                <div>
                  <div class="provider-name">{config.name}</div>
                  <div class="provider-desc">{config.description}</div>
                </div>
              </div>
            </button>
          {/each}
        </div>
      </section>

      <!-- API配置 -->
      <section class="mb-6">
        <h2 class="section-title">连接配置</h2>
        <div class="glass-card overflow-hidden">
          <div class="p-4 space-y-4">
            <div>
              <label class="input-label">Base URL</label>
              <input
                value={$settings.aiBaseUrl}
                on:change={(e) => updateSetting('aiBaseUrl', e.currentTarget.value)}
                placeholder={currentProvider?.baseUrlPlaceholder || ''}
                class="input-field"
              />
              <p class="input-hint">API 的基础地址，不包含端点路径</p>
            </div>

            <div>
              <label class="input-label">API Key</label>
              <input
                type="password"
                value={$settings.aiApiKey}
                on:change={(e) => updateSetting('aiApiKey', e.currentTarget.value)}
                placeholder="sk-... 或 API 密钥"
                class="input-field"
              />
            </div>

            <div>
              <label class="input-label">端点</label>
              <div class="endpoint-display">{currentProvider?.endpoint || ''}</div>
              <p class="input-hint">由选择的 API 格式自动决定</p>
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
          <h3 class="text-sm font-medium mb-3">支持的 API</h3>
          <div class="space-y-3 text-xs text-muted-foreground">
            <div>
              <div class="text-white/70 font-medium mb-1">Chat Completion</div>
              <p>OpenAI、DeepSeek、通义千问、Moonshot 等兼容 OpenAI 格式的 API</p>
            </div>
            <div>
              <div class="text-white/70 font-medium mb-1">Response</div>
              <p>OpenAI 新版 Response API 格式</p>
            </div>
            <div>
              <div class="text-white/70 font-medium mb-1">Anthropic</div>
              <p>Claude 系列模型的原生 API 格式</p>
            </div>
          </div>
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

  .provider-card {
    padding: 16px;
    cursor: pointer;
    transition: all 0.2s;
  }
  .provider-card.active {
    border-color: rgba(255, 255, 255, 0.3);
    background: rgba(255, 255, 255, 0.08);
  }
  .provider-card:active {
    background: rgba(255, 255, 255, 0.05);
  }

  .provider-header {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .provider-radio {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    border: 2px solid rgba(255, 255, 255, 0.2);
    flex-shrink: 0;
    position: relative;
  }
  .provider-radio.active {
    border-color: white;
  }
  .provider-radio.active::after {
    content: '';
    position: absolute;
    top: 3px;
    left: 3px;
    right: 3px;
    bottom: 3px;
    border-radius: 50%;
    background: white;
  }

  .provider-name {
    font-size: 14px;
    font-weight: 500;
  }

  .provider-desc {
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

  .endpoint-display {
    padding: 12px;
    border-radius: 10px;
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.05);
    font-family: monospace;
    font-size: 14px;
    color: rgba(255, 255, 255, 0.6);
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
    word-break: break-all;
  }
  .test-result.success {
    background: rgba(34, 197, 94, 0.1);
  }
</style>
