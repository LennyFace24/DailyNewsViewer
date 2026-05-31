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
  aiProvider: 'openai' | 'anthropic' | 'custom';
}

/** AI提供商配置 */
export interface AIProviderConfig {
  name: string;
  baseUrlPlaceholder: string;
  endpoint: string;
  headers: (apiKey: string) => Record<string, string>;
  body: (text: string, model: string) => object;
  parseResponse: (response: any) => string;
}

/** AI提供商列表 */
export const AI_PROVIDERS: Record<string, AIProviderConfig> = {
  openai: {
    name: 'OpenAI Compatible',
    baseUrlPlaceholder: 'https://api.openai.com/v1',
    endpoint: '/chat/completions',
    headers: (apiKey) => ({
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    }),
    body: (text, model) => ({
      model: model || 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'You are a translator. Translate the following text to Chinese. Only return the translation, nothing else.' },
        { role: 'user', content: text }
      ],
      temperature: 0.3
    }),
    parseResponse: (res) => res.choices?.[0]?.message?.content || ''
  },
  anthropic: {
    name: 'Anthropic Claude',
    baseUrlPlaceholder: 'https://api.anthropic.com/v1',
    endpoint: '/messages',
    headers: (apiKey) => ({
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'Content-Type': 'application/json'
    }),
    body: (text, model) => ({
      model: model || 'claude-3-haiku-20240307',
      max_tokens: 1024,
      messages: [
        { role: 'user', content: `Translate the following text to Chinese. Only return the translation, nothing else.\n\n${text}` }
      ]
    }),
    parseResponse: (res) => res.content?.[0]?.text || ''
  }
};
