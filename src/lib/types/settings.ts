/** 应用设置 */
export interface AppSettings {
  theme: 'dark' | 'light';
  cardStyle: 'compact' | 'comfortable' | 'spacious';
  showImages: boolean;
  markAsReadOnView: boolean;
  proxyEnabled: boolean;
  proxyHost: string;
  proxyPort: string;
  proxyType: 'http' | 'https' | 'socks5';
  // AI翻译设置
  aiTranslateEnabled: boolean;
  aiBaseUrl: string;
  aiApiKey: string;
  aiProvider: 'chat_completion' | 'response' | 'anthropic';
  aiModel: string;
  // 通知设置
  notificationsEnabled: boolean;
  notificationFrequency: 'hourly' | 'daily';
  quietHoursEnabled: boolean;
  quietHoursStart: string;
  quietHoursEnd: string;
}

/** AI提供商类型 */
export type AIProviderType = 'chat_completion' | 'response' | 'anthropic';

/** AI提供商配置 */
export interface AIProviderConfig {
  name: string;
  description: string;
  baseUrlPlaceholder: string;
  endpoint: string;
  defaultModel: string;
  modelsEndpoint: string;
  parseModels: (response: any) => string[];
  headers: (apiKey: string) => Record<string, string>;
  body: (text: string, model: string) => object;
  parseResponse: (response: any) => string;
}

/** AI提供商列表 */
export const AI_PROVIDERS: Record<AIProviderType, AIProviderConfig> = {
  chat_completion: {
    name: 'Chat Completion',
    description: 'OpenAI / DeepSeek / 通义千问等',
    baseUrlPlaceholder: 'https://api.openai.com/v1',
    endpoint: '/chat/completions',
    defaultModel: 'gpt-4o-mini',
    modelsEndpoint: '/models',
    parseModels: (res) => {
      if (res.data && Array.isArray(res.data)) {
        return res.data
          .map((m: any) => m.id)
          .filter((id: string) => !id.includes('embedding') && !id.includes('dall'))
          .sort();
      }
      return [];
    },
    headers: (apiKey) => ({
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    }),
    body: (text, model) => ({
      model: model || 'gpt-4o-mini',
      messages: [
        { role: 'system', content: '你是翻译助手。将用户提供的英文内容翻译成中文。只返回翻译结果，不要添加任何解释。' },
        { role: 'user', content: text }
      ],
      temperature: 0.3
    }),
    parseResponse: (res) => res.choices?.[0]?.message?.content || ''
  },

  response: {
    name: 'Response',
    description: 'OpenAI Response API (新版)',
    baseUrlPlaceholder: 'https://api.openai.com/v1',
    endpoint: '/responses',
    defaultModel: 'gpt-4o-mini',
    modelsEndpoint: '/models',
    parseModels: (res) => {
      if (res.data && Array.isArray(res.data)) {
        return res.data
          .map((m: any) => m.id)
          .filter((id: string) => !id.includes('embedding') && !id.includes('dall'))
          .sort();
      }
      return [];
    },
    headers: (apiKey) => ({
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    }),
    body: (text, model) => ({
      model: model || 'gpt-4o-mini',
      input: `将以下内容翻译成中文，只返回翻译结果：\n\n${text}`,
      temperature: 0.3
    }),
    parseResponse: (res) => {
      if (res.output && Array.isArray(res.output)) {
        const message = res.output.find((o: any) => o.type === 'message');
        if (message?.content) {
          const textContent = message.content.find((c: any) => c.type === 'output_text');
          return textContent?.text || '';
        }
      }
      return res.output_text || res.text || '';
    }
  },

  anthropic: {
    name: 'Anthropic',
    description: 'Claude 系列模型',
    baseUrlPlaceholder: 'https://api.anthropic.com/v1',
    endpoint: '/messages',
    defaultModel: 'claude-3-haiku-20240307',
    modelsEndpoint: '/models',
    parseModels: (res) => {
      if (res.data && Array.isArray(res.data)) {
        return res.data.map((m: any) => m.id).sort();
      }
      // Anthropic 没有公开的模型列表API，返回默认模型
      return [
        'claude-3-opus-20240229',
        'claude-3-sonnet-20240229',
        'claude-3-haiku-20240307',
        'claude-3-5-sonnet-20241022',
        'claude-3-5-haiku-20241022'
      ];
    },
    headers: (apiKey) => ({
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'Content-Type': 'application/json'
    }),
    body: (text, model) => ({
      model: model || 'claude-3-haiku-20240307',
      max_tokens: 1024,
      system: '你是翻译助手。将用户提供的英文内容翻译成中文。只返回翻译结果，不要添加任何解释。',
      messages: [
        { role: 'user', content: text }
      ]
    }),
    parseResponse: (res) => res.content?.[0]?.text || ''
  }
};

/** 获取提供商列表 */
export function getProviderList(): Array<{ key: AIProviderType; config: AIProviderConfig }> {
  return Object.entries(AI_PROVIDERS).map(([key, config]) => ({
    key: key as AIProviderType,
    config
  }));
}

/** 获取模型列表 */
export async function fetchModels(provider: AIProviderType, baseUrl: string, apiKey: string): Promise<string[]> {
  const config = AI_PROVIDERS[provider];
  if (!config) return [];

  try {
    const url = `${baseUrl}${config.modelsEndpoint}`;
    const headers = config.headers(apiKey);

    const response = await fetch(url, {
      method: 'GET',
      headers,
      signal: AbortSignal.timeout(10000)
    });

    if (!response.ok) {
      console.error('Failed to fetch models:', response.status);
      return [];
    }

    const data = await response.json();
    return config.parseModels(data);
  } catch (error) {
    console.error('Fetch models failed:', error);
    // 返回默认模型列表
    return config.parseModels({});
  }
}
