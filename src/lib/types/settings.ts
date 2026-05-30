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
}
