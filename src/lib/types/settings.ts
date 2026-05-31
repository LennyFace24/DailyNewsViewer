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
}

/** AI提供商类型 */
export type AIProviderType = 'chat_completion' | 'response' | 'anthropic';

/** AI提供商配置 */
export interface AIProviderConfig {
  name: string;
  description: string;
  baseUrlPlaceholder: string;
  endpoint: string;
  headers: (apiKey: string) => Record<string, string>;
  body: (text: string) => object;
  parseResponse: (response: any) => string;
}

/** AI提供商列表 */
export const AI_PROVIDERS: Record<AIProviderType, AIProviderConfig> = {
  // OpenAI Chat Completion 格式
  chat_completion: {
    name: 'Chat Completion',
    description: 'OpenAI / DeepSeek / 通义千问等',
    baseUrlPlaceholder: 'https://api.openai.com/v1',
    endpoint: '/chat/completions',
    headers: (apiKey) => ({
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    }),
    body: (text) => ({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: '你是翻译助手。将用户提供的英文内容翻译成中文。只返回翻译结果，不要添加任何解释。' },
        { role: 'user', content: text }
      ],
      temperature: 0.3
    }),
    parseResponse: (res) => res.choices?.[0]?.message?.content || ''
  },

  // OpenAI Response 格式（新版API）
  response: {
    name: 'Response',
    description: 'OpenAI Response API (新版)',
    baseUrlPlaceholder: 'https://api.openai.com/v1',
    endpoint: '/responses',
    headers: (apiKey) => ({
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    }),
    body: (text) => ({
      model: 'gpt-4o-mini',
      input: `将以下内容翻译成中文，只返回翻译结果：\n\n${text}`,
      temperature: 0.3
    }),
    parseResponse: (res) => {
      // Response API 格式
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

  // Anthropic Claude 格式
  anthropic: {
    name: 'Anthropic',
    description: 'Claude 系列模型',
    baseUrlPlaceholder: 'https://api.anthropic.com/v1',
    endpoint: '/messages',
    headers: (apiKey) => ({
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'Content-Type': 'application/json'
    }),
    body: (text) => ({
      model: 'claude-3-haiku-20240307',
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
