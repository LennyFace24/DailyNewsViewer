import { writable, derived, get } from 'svelte/store';
import type { Article, ArticleFilter, ArticleGroup } from '$lib/types/news';
import { ArticleCache } from '$lib/services/storage';
import { groupArticlesByDate, formatDateGroup } from '$lib/utils/date';

/** 文章列表 */
export const articles = writable<Article[]>([]);

/** 当前过滤器 */
export const filter = writable<ArticleFilter>({
  sortBy: 'newest'
});

/** 是否正在加载 */
export const isLoading = writable(false);

/** 最后刷新时间 */
export const lastRefreshTime = writable<Date | null>(null);

/** 已过滤的文章 */
export const filteredArticles = derived(
  [articles, filter],
  ([$articles, $filter]) => {
    let result = [...$articles];

    if ($filter.sourceId) {
      result = result.filter(a => a.sourceId === $filter.sourceId);
    }

    if ($filter.isRead !== undefined) {
      result = result.filter(a => a.isRead === $filter.isRead);
    }

    if ($filter.isBookmarked) {
      result = result.filter(a => a.isBookmarked);
    }

    switch ($filter.sortBy) {
      case 'newest':
        result.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
        break;
      case 'oldest':
        result.sort((a, b) => new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime());
        break;
    }

    return result;
  }
);

/** 按日期分组的文章 */
export const groupedArticles = derived(filteredArticles, ($articles) => {
  const groups = groupArticlesByDate($articles);
  const result: ArticleGroup[] = [];

  for (const [, dateArticles] of groups) {
    result.push({
      date: formatDateGroup(dateArticles[0].publishedAt),
      articles: dateArticles
    });
  }

  return result;
});

/** 未读数量 */
export const unreadCount = derived(articles, ($articles) =>
  $articles.filter(a => !a.isRead).length
);

/** 收藏数量 */
export const bookmarkCount = derived(articles, ($articles) =>
  $articles.filter(a => a.isBookmarked).length
);

/** 加载缓存 */
export function loadFromCache(): void {
  const cached = ArticleCache.loadRecent();
  if (cached.length > 0) {
    articles.set(cached);
  }
}

/** 添加文章（去重） */
export function addArticles(newArticles: Article[]): void {
  articles.update(current => {
    const map = new Map<string, Article>();

    // 先添加现有文章
    for (const article of current) {
      map.set(article.id, article);
    }

    // 添加新文章（跳过已存在的）
    for (const article of newArticles) {
      if (!map.has(article.id)) {
        map.set(article.id, article);
      }
    }

    // 按发布时间排序，保留最近7天
    const sorted = Array.from(map.values())
      .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

    // 限制总数量（防止内存溢出）
    const MAX_ARTICLES = 500;
    return sorted.slice(0, MAX_ARTICLES);
  });
}

/** 标记为已读 */
export function markAsRead(articleId: string): void {
  articles.update(list =>
    list.map(a => a.id === articleId ? { ...a, isRead: true } : a)
  );
}

/** 标记全部已读 */
export function markAllAsRead(): void {
  articles.update(list =>
    list.map(a => ({ ...a, isRead: true }))
  );
}

/** 切换收藏状态 */
export function toggleBookmark(articleId: string): void {
  articles.update(list =>
    list.map(a => a.id === articleId ? { ...a, isBookmarked: !a.isBookmarked } : a)
  );
}

/** 保存到缓存 */
export function saveToCache(): void {
  const current = get(articles);
  ArticleCache.save(current);
  lastRefreshTime.set(new Date());
}
