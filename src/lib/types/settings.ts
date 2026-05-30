/** 应用设置 */
export interface AppSettings {
  theme: 'dark' | 'light';
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
