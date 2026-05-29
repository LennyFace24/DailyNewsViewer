import type { Article } from '$lib/types/news';
import type { SourceConfig } from '$lib/types/source';
import { generateArticleId } from '$lib/utils/id';

/** RSS解析器 - 提取完整内容 */
export function parseRSSFeed(xmlText: string, source: SourceConfig): Article[] {
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(xmlText, 'text/xml');

    if (doc.querySelector('parsererror')) {
      return [];
    }

    const items = doc.querySelectorAll('item, entry');
    const articles: Article[] = [];

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      const title = getText(item, 'title');
      const link = getText(item, 'link') || getHref(item);

      if (!title || !link) continue;

      // 提取完整内容（优先级：content:encoded > content > summary > description）
      const fullContent = getText(item, 'content\\:encoded') ||
                         getText(item, 'content') ||
                         getText(item, 'summary') ||
                         getText(item, 'description') || '';

      const author = getText(item, 'dc\\:creator') || getText(item, 'author') || source.name;
      const pubDate = getText(item, 'pubDate') || getText(item, 'published') || getText(item, 'updated') || '';

      // 提取图片
      const thumbnail = getThumbnail(item) || extractFirstImage(fullContent);

      // 生成摘要（取前200字符的纯文本）
      const plainText = stripHtml(fullContent);
      const summary = plainText.substring(0, 200).trim() + (plainText.length > 200 ? '...' : '');

      articles.push({
        id: generateArticleId(source.id, link),
        title: decode(title),
        url: link,
        content: fullContent, // 保存完整HTML内容
        summary,
        thumbnail,
        author: decode(author),
        sourceId: source.id,
        sourceName: source.name,
        publishedAt: pubDate ? new Date(pubDate) : new Date(),
        fetchedAt: new Date(),
        isRead: false,
        isBookmarked: false,
        tags: []
      });
    }

    return articles;
  } catch {
    return [];
  }
}

function getText(parent: Element, sel: string): string {
  return parent.querySelector(sel)?.textContent?.trim() || '';
}

function getHref(item: Element): string {
  const link = item.querySelector('link');
  return link?.getAttribute('href') || link?.textContent?.trim() || '';
}

function getThumbnail(item: Element): string | undefined {
  const media = item.querySelector('media\\:thumbnail, media\\:content, thumbnail, enclosure[type^="image"]');
  return media?.getAttribute('url') || undefined;
}

function extractFirstImage(html: string): string | undefined {
  const match = html.match(/<img[^>]+src="([^"]+)"/);
  return match?.[1];
}

function stripHtml(html: string): string {
  const tmp = document.createElement('div');
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || '';
}

function decode(text: string): string {
  const el = document.createElement('textarea');
  el.innerHTML = text;
  return el.value;
}
