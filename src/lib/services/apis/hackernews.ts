import type { Article } from '$lib/types/news';
import { generateArticleId } from '$lib/utils/id';

const HN_API = 'https://hacker-news.firebaseio.com/v0';

interface HNItem {
  id: number;
  title: string;
  url?: string;
  text?: string;
  by: string;
  time: number;
  score: number;
  descendants?: number;
}

/** 获取热门故事 */
export async function fetchHackerNewsTopStories(limit: number = 15): Promise<Article[]> {
  try {
    // 获取ID列表
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    const res = await fetch(`${HN_API}/topstories.json`, {
      signal: controller.signal
    });
    clearTimeout(timeout);

    if (!res.ok) {
      throw new Error(`HN API error: ${res.status}`);
    }

    const ids: number[] = await res.json();
    const topIds = ids.slice(0, limit);

    // 并行获取详情
    const items = await Promise.allSettled(
      topIds.map(id => fetchItem(id))
    );

    return items
      .filter((r): r is PromiseFulfilledResult<HNItem | null> => r.status === 'fulfilled')
      .map(r => r.value)
      .filter((item): item is HNItem => item !== null)
      .map(item => ({
        id: generateArticleId('hackernews', `https://news.ycombinator.com/item?id=${item.id}`),
        title: item.title,
        url: item.url || `https://news.ycombinator.com/item?id=${item.id}`,
        content: item.text || '',
        summary: item.text?.substring(0, 150) || `Score: ${item.score}`,
        thumbnail: undefined,
        author: item.by,
        sourceId: 'hackernews',
        sourceName: 'Hacker News',
        publishedAt: new Date(item.time * 1000),
        fetchedAt: new Date(),
        isRead: false,
        isBookmarked: false,
        tags: []
      }));
  } catch (error) {
    console.warn('HackerNews fetch failed:', error);
    return [];
  }
}

/** 获取单个故事 */
async function fetchItem(id: number): Promise<HNItem | null> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3000);

    const res = await fetch(`${HN_API}/item/${id}.json`, {
      signal: controller.signal
    });
    clearTimeout(timeout);

    return await res.json();
  } catch {
    return null;
  }
}
