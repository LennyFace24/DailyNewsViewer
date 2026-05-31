<script lang="ts">
  import { goto } from '$app/navigation';
  import { ArrowLeft, Languages, RefreshCw, Check } from 'lucide-svelte';
  import { settings, updateSetting } from '$lib/stores/settings';
  import { AI_PROVIDERS, getProviderList, fetchModels } from '$lib/types/settings';

  let testResult = '';
  let isTesting = false;
  let models: string[] = [];
  let isLoadingModels = false;
  let showModelList = false;

  $: currentProvider = AI_PROVIDERS[$settings.aiProvider];
  $: providers = getProviderList();

  async function handleFetchModels() {
    if (!$settings.aiBaseUrl || !$settings.aiApiKey) {
      alert('请先填写 Base URL 和 API Key');
      return;
    }

    isLoadingModels = true;
    showModelList = false;

    try {
      models = await fetchModels($settings.aiProvider, $settings.aiBaseUrl, $settings.aiApiKey);
      showModelList = true;
    } catch (error) {
      console.error('Failed to fetch models:', error);
      alert('获取模型列表失败');
    } finally {
      isLoadingModels = false;
    }
  }

  function selectModel(model: string) {
    updateSetting('aiModel', model);
    showModelList = false;
  }

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
      const body = provider.body('Hello, how are you?', $settings.aiModel);

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
              on:click={() => { updateSetting('aiProvider', key); updateSetting('aiModel', ''); models = []; showModelList = false; }}
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

            <!-- 模型选择 -->
            <div>
              <div class="flex items-center justify-between mb-2">
                <label class="input-label mb-0">模型</label>
                <button
                  class="fetch-models-btn"
                  on:click={handleFetchModels}
                  disabled={isLoadingModels || !$settings.aiBaseUrl || !$settings.aiApiKey}
                >
                  <RefreshCw class="w-3.5 h-3.5 {isLoadingModels ? 'animate-spin' : ''}" />
                  {isLoadingModels ? '获取中...' : '获取模型列表'}
                </button>
              </div>

              <input
                value={$settings.aiModel}
                on:change={(e) => updateSetting('aiModel', e.currentTarget.value)}
                placeholder={currentProvider?.defaultModel || '模型名称'}
                class="input-field"
              />

              <!-- 模型列表 -->
              {#if showModelList && models.length > 0}
                <div class="model-list">
                  {#each models as model}
                    <button
                      class="model-item {$settings.aiModel === model ? 'active' : ''}"
                      on:click={() => selectModel(model)}
                    >
                      <span>{model}</span>
                      {#if $settings.aiModel === model}
                        <Check class="w-4 h-4 text-primary" />
                      {/if}
                    </button>
                  {/each}
                </div>
              {/if}
            </div>

            <div>
              <label class="input-label">端点</label>
              <div class="endpoint-display">{currentProvider?.endpoint || ''}</div>
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
              <p>OpenAI、DeepSeek、通义千问、Moonshot 等</p>
            </div>
            <div>
              <div class="text-white/70 font-medium mb-1">Response</div>
              <p>OpenAI 新版 Response API</p>
            </div>
            <div>
              <div class="text-white/70 font-medium mb-1">Anthropic</div>
              <p>Claude 系列模型</p>
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

  .fetch-models-btn {
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 4px 10px;
    border-radius: 6px;
    background: rgba(255, 255, 255, 0.08);
    color: rgba(255, 255, 255, 0.7);
    font-size: 12px;
    border: none;
    cursor: pointer;
    transition: all 0.2s;
  }
  .fetch-models-btn:active {
    background: rgba(255, 255, 255, 0.15);
  }
  .fetch-models-btn:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }

  .model-list {
    margin-top: 8px;
    max-height: 200px;
    overflow-y: auto;
    border-radius: 10px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.3);
  }

  .model-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 12px;
    font-size: 13px;
    font-family: monospace;
    color: rgba(255, 255, 255, 0.7);
    background: transparent;
    border: none;
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    cursor: pointer;
    width: 100%;
    text-align: left;
    transition: background 0.15s;
  }
  .model-item:last-child {
    border-bottom: none;
  }
  .model-item:active {
    background: rgba(255, 255, 255, 0.05);
  }
  .model-item.active {
    color: white;
    background: rgba(255, 255, 255, 0.08);
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

  .separator {
    height: 1px;
    background: rgba(255, 255, 255, 0.06);
    margin: 16px 0;
  }
</style>
