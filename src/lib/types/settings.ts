/** 应用设置 */
export interface AppSettings {
  theme: 'dark' | 'light';
  primaryColor: string; // 点缀色
  backgroundImage?: string;
  backgroundBlur: boolean;
  fontSize: 'small' | 'medium' | 'large';
  cardStyle: 'compact' | 'comfortable' | 'spacious';
  showImages: boolean;
  markAsReadOnView: boolean;
  // 系统代理设置
  proxyEnabled: boolean;
  proxyHost: string;
  proxyPort: string;
  proxyType: 'http' | 'https' | 'socks5';
}

/** 预设主题色（点缀色） */
export const THEME_COLORS = [
  { name: '极光蓝', value: '200 80% 55%' },
  { name: '薄荷绿', value: '160 60% 45%' },
  { name: '琥珀橙', value: '35 90% 55%' },
  { name: '玫瑰红', value: '350 75% 55%' },
  { name: '薰衣紫', value: '270 60% 55%' },
  { name: '冰川白', value: '0 0% 90%' },
];
