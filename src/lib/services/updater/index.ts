import { Capacitor } from '@capacitor/core';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { FileOpener } from '@capacitor-community/file-opener';
import { Http } from '@capacitor-community/http';

const GITHUB_OWNER = 'LennyFace24';
const GITHUB_REPO = 'DailyNewsViewer';
const GITHUB_API = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/releases/latest`;

// CORS代理
const CORS_PROXIES = [
  'https://api.allorigins.win/raw?url=',
  'https://corsproxy.io/?'
];

/** Release 信息 */
export interface ReleaseInfo {
  version: string;
  tagName: string;
  body: string;
  publishedAt: string;
  apkUrl: string;
  apkSize: number;
}

/** 下载进度 */
export interface DownloadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

/** 获取当前版本 */
export function getCurrentVersion(): string {
  const version = import.meta.env.VITE_APP_VERSION || '0.0.0';
  return version;
}

/** 比较版本号 */
export function compareVersions(current: string, latest: string): number {
  const parse = (v: string) => v.replace(/^v/, '').split('.').map(Number);
  const currentParts = parse(current);
  const latestParts = parse(latest);

  for (let i = 0; i < Math.max(currentParts.length, latestParts.length); i++) {
    const c = currentParts[i] || 0;
    const l = latestParts[i] || 0;
    if (l > c) return 1;
    if (l < c) return -1;
  }
  return 0;
}

/** 通过代理获取（带重试） */
async function fetchWithProxy(url: string, maxRetries: number = 3): Promise<any> {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    console.log(`[Updater] Attempt ${attempt}/${maxRetries}`);

    // 先尝试直接请求
    try {
      const response = await fetch(url, {
        headers: { 'Accept': 'application/vnd.github.v3+json' },
        signal: AbortSignal.timeout(10000)
      });
      if (response.ok) {
        return await response.json();
      }
    } catch (e) {
      console.log('[Updater] Direct fetch failed:', e);
    }

    // 尝试代理
    for (const proxy of CORS_PROXIES) {
      try {
        const response = await fetch(proxy + encodeURIComponent(url), {
          signal: AbortSignal.timeout(10000)
        });
        if (response.ok) {
          return await response.json();
        }
      } catch (e) {
        console.log('[Updater] Proxy failed:', proxy, e);
      }
    }

    // 等待后重试
    if (attempt < maxRetries) {
      await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
    }
  }

  throw new Error('无法获取更新信息（已重试' + maxRetries + '次）');
}

/** 检查更新 */
export async function checkForUpdate(): Promise<{ release: ReleaseInfo | null; hasUpdate: boolean; error?: string }> {
  try {
    const currentVersion = getCurrentVersion();
    console.log('[Updater] Current:', currentVersion);

    const data = await fetchWithProxy(GITHUB_API);

    const tagName = data.tag_name || '';
    const version = tagName.replace(/^v/, '');

    console.log('[Updater] Remote:', version);

    if (!version) {
      return { release: null, hasUpdate: false, error: '无法解析版本号' };
    }

    // 比较版本
    const hasUpdate = compareVersions(currentVersion, version) > 0;
    console.log('[Updater] Has update:', hasUpdate);

    // 查找 APK 下载链接
    const apkAsset = data.assets?.find((a: any) =>
      a.name?.endsWith('.apk') || a.content_type === 'application/vnd.android.package-archive'
    );

    const release: ReleaseInfo = {
      version,
      tagName,
      body: data.body || '暂无更新日志',
      publishedAt: data.published_at || '',
      apkUrl: apkAsset?.browser_download_url || data.html_url,
      apkSize: apkAsset?.size || 0
    };

    return { release, hasUpdate };
  } catch (error: any) {
    console.error('[Updater] Error:', error.message);
    return { release: null, hasUpdate: false, error: error.message };
  }
}

/** 下载 APK 并安装（应用内） */
export async function downloadAndInstall(
  url: string,
  onProgress?: (progress: DownloadProgress) => void
): Promise<void> {
  if (!Capacitor.isNativePlatform()) {
    window.open(url, '_blank');
    return;
  }

  try {
    // 使用 Capacitor HTTP 插件下载（绕过 CORS）
    const fileName = `DailyTech-${Date.now()}.apk`;
    const filePath = `${Filesystem.CacheDirectory}/${fileName}`;

    // 下载文件
    const response = await Http.downloadFile({
      url,
      filePath,
      method: 'GET',
      connectTimeout: 30000,
      readTimeout: 60000
    });

    if (response.status !== 200) {
      throw new Error(`下载失败: ${response.status}`);
    }

    // 打开安装
    await FileOpener.open({
      filePath: filePath.replace('file://', ''),
      contentType: 'application/vnd.android.package-archive'
    });
  } catch (error: any) {
    console.error('Download/install failed:', error);
    // 降级到浏览器下载
    window.open(url, '_blank');
  }
}

/** 格式化文件大小 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '未知大小';
  const mb = bytes / (1024 * 1024);
  return `${mb.toFixed(1)} MB`;
}

/** 格式化更新日志 */
export function formatChangelog(body: string): string {
  return body
    .replace(/#{1,6}\s/g, '')
    .replace(/\*\*/g, '')
    .replace(/\*/g, '')
    .replace(/`/g, '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .trim();
}
