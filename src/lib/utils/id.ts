/** 生成唯一ID */
export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

/** 从URL生成文章ID */
export function generateArticleId(sourceId: string, url: string): string {
  const urlHash = hashCode(url).toString(36);
  return `${sourceId}-${urlHash}`;
}

/** 简单哈希函数 */
function hashCode(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
}
