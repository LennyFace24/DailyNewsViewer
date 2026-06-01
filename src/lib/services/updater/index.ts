import { Capacitor } from '@capacitor/core';

const GITHUB_OWNER = 'LennyFace24';
const GITHUB_REPO = 'DailyNewsViewer';
const GITHUB_API = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/releases/latest`;

/** Release 信息 */
export interface ReleaseInfo {
  version: string;
  tagName: string;
  body: string;
  publishedAt: string;
  apkUrl: string;
  apkSize: number;
}

/** 获取当前版本 */
export function getCurrentVersion(): string {
  const version = import.meta.env.VITE_APP_VERSION || '0.0.0';
  console.log('[Updater] Current version:', version);
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

/** 检查更新 */
export async function checkForUpdate(): Promise<{ release: ReleaseInfo | null; error?: string }> {
  try {
    console.log('[Updater] Checking:', GITHUB_API);

    const response = await fetch(GITHUB_API, {
      headers: {
        'Accept': 'application/vnd.github.v3+json'
      },
      signal: AbortSignal.timeout(15000)
    });

    console.log('[Updater] Response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text().catch(() => '');
      console.error('[Updater] API error:', response.status, errorText);
      return { release: null, error: `API错误: ${response.status}` };
    }

    const data = await response.json();
    console.log('[Updater] Release data:', { tag: data.tag_name, assets: data.assets?.length });

    const tagName = data.tag_name || '';
    const version = tagName.replace(/^v/, '');

    if (!version) {
      return { release: null, error: '无法解析版本号' };
    }

    // 查找 APK 下载链接
    const apkAsset = data.assets?.find((a: any) =>
      a.name?.endsWith('.apk') || a.content_type === 'application/vnd.android.package-archive'
    );

    console.log('[Updater] APK asset:', apkAsset?.name || 'not found');

    const release: ReleaseInfo = {
      version,
      tagName,
      body: data.body || '暂无更新日志',
      publishedAt: data.published_at || '',
      apkUrl: apkAsset?.browser_download_url || data.html_url,
      apkSize: apkAsset?.size || 0
    };

    return { release };
  } catch (error: any) {
    console.error('[Updater] Failed:', error.message);
    return { release: null, error: `网络错误: ${error.message}` };
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
