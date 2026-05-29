/** 应用设置 */
export interface AppSettings {
  theme: 'dark' | 'light';
  primaryColor: string;
  backgroundImage?: string;
  backgroundBlur: boolean;
  fontSize: 'small' | 'medium' | 'large';
  cardStyle: 'compact' | 'comfortable' | 'spacious';
  showImages: boolean;
  markAsReadOnView: boolean;
  // 代理设置
  proxyEnabled: boolean;
  proxyUrl: string; // 如: https://corsproxy.io/?
}

/** 预设主题色 */
export const THEME_COLORS = [
  { name: '蓝色', value: '217 91% 60%' },
  { name: '紫色', value: '262 83% 58%' },
  { name: '绿色', value: '142 71% 45%' },
  { name: '红色', value: '0 84% 60%' },
  { name: '橙色', value: '25 95% 53%' },
  { name: '粉色', value: '330 81% 60%' },
  { name: '青色', value: '185 84% 42%' },
  { name: '黄色', value: '45 93% 47%' },
];

/** 预设代理 */
export const PROXY_PRESETS = [
  { name: 'AllOrigins', url: 'https://api.allorigins.win/raw?url=' },
  { name: 'CorsProxy.io', url: 'https://corsproxy.io/?' },
  { name: 'CodeTabs', url: 'https://api.codetabs.com/v1/proxy?quest=' },
  { name: 'ThingProxy', url: 'https://thingproxy.freeboard.io/fetch/' },
];
