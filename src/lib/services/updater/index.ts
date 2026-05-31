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
  // 从构建时注入的版本号获取，或者使用默认值
  return import.meta.env.VITE_APP_VERSION || '0.7.1';
}

/** 比较版本号 */
export function compareVersions(current: string, latest: string): number {
  const parse = (v: string) => v.replace(/^v/, '').split('.').map(Number);
  const currentParts = parse(current);
  const latestParts = parse(latest);

  for (let i = 0; i < Math.max(currentParts.length, latestParts.length); i++) {
    const c = currentParts[i] || 0;
    const l = latestParts[i] || 0;
    if (l > c) return 1;  // latest 更新
    if (l < c) return -1; // current 更新
  }
  return 0;
}

/** 检查更新 */
export async function checkForUpdate(): Promise<ReleaseInfo | null> {
  try {
    const response = await fetch(GITHUB_API, {
      headers: {
        'Accept': 'application/vnd.github.v3+json'
      },
      signal: AbortSignal.timeout(10000)
    });

    if (!response.ok) {
      console.error('Failed to check update:', response.status);
      return null;
    }

    const data = await response.json();
    const tagName = data.tag_name || '';
    const version = tagName.replace(/^v/, '');

    // 查找 APK 下载链接
    const apkAsset = data.assets?.find((a: any) =>
      a.name?.endsWith('.apk') || a.content_type === 'application/vnd.android.package-archive'
    );

    return {
      version,
      tagName,
      body: data.body || '暂无更新日志',
      publishedAt: data.published_at || '',
      apkUrl: apkAsset?.browser_download_url || data.html_url,
      apkSize: apkAsset?.size || 0
    };
  } catch (error) {
    console.error('Check update failed:', error);
    return null;
  }
}

/** 下载 APK */
export async function downloadApk(url: string, onProgress?: (progress: number) => void): Promise<Blob | null> {
  try {
    const response = await fetch(url);
    if (!response.ok) return null;

    const contentLength = response.headers.get('content-length');
    const total = contentLength ? parseInt(contentLength) : 0;
    let loaded = 0;

    const reader = response.body?.getReader();
    if (!reader) return null;

    const chunks: Uint8Array[] = [];

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      chunks.push(value);
      loaded += value.length;

      if (total > 0 && onProgress) {
        onProgress(loaded / total);
      }
    }

    return new Blob(chunks, { type: 'application/vnd.android.package-archive' });
  } catch (error) {
    console.error('Download failed:', error);
    return null;
  }
}

/** 安装 APK（需要 FileOpener 插件或使用系统 intent） */
export function installApk(blob: Blob): void {
  // 在浏览器中触发下载
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'DailyTech-latest.apk';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/** 格式化文件大小 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '未知大小';
  const mb = bytes / (1024 * 1024);
  return `${mb.toFixed(1)} MB`;
}

/** 格式化更新日志 */
export function formatChangelog(body: string): string {
  // 清理 markdown 格式，保留纯文本
  return body
    .replace(/#{1,6}\s/g, '')  // 移除标题标记
    .replace(/\*\*/g, '')      // 移除加粗
    .replace(/\*/g, '')        // 移除斜体
    .replace(/`/g, '')         // 移除代码标记
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')  // 链接只保留文字
    .trim();
}
