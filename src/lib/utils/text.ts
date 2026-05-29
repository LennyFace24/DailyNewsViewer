/** 截断文本 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '...';
}

/** 清理HTML标签 */
export function stripHtml(html: string): string {
  const tmp = document.createElement('div');
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || '';
}

/** 提取第一张图片URL */
export function extractFirstImage(html: string): string | undefined {
  const match = html.match(/<img[^>]+src="([^"]+)"/);
  return match ? match[1] : undefined;
}

/** 生成摘要 */
export function generateSummary(content: string, maxLength: number = 150): string {
  const plainText = stripHtml(content);
  return truncateText(plainText, maxLength);
}
