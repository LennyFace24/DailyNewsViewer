import { writable, derived, get } from 'svelte/store';
import type { Article, ArticleFilter, ArticleGroup } from '$lib/types/news';
import { ArticleCache } from '$lib/services/storage';
import { groupArticlesByDate, formatDateGroup } from '$lib/utils/date';

/** 所有文章池 */
export const articles = writable<Article[]>([]);

/** 当前显示的文章 */
export const displayedArticles = writable<Article[]>([]);

/** 当前过滤器 */
export const filter = writable<ArticleFilter>({ sortBy: 'newest' });

/** 是否正在加载 */
export const isLoading = writable(false);

/** 是否还有更多内容 */
export const hasMore = writable(true);

/** 最后刷新时间 */
export const lastRefreshTime = writable<Date | null>(null);

/** 已显示过的文章ID */
const displayedIds = new Set<string>();

/** 每次加载的数量 */
const LOAD_BATCH_SIZE = 20;

/** 只保留最近2天的文章 */
function filterRecentArticles(articles: Article[]): Article[] {
  const twoDaysAgo = new Date();
  twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
  return articles.filter(a => new Date(a.publishedAt) >= twoDaysAgo);
}

/** 过滤后的文章 */
export const filteredArticles = derived(
  [displayedArticles, filter],
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

/** 按日期分组 */
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
export const unreadCount = derived(displayedArticles, ($articles) =>
  $articles.filter(a => !a.isRead).length
);

/** 收藏数量 */
export const bookmarkCount = derived(displayedArticles, ($articles) =>
  $articles.filter(a => a.isBookmarked).length
);

/** 加载缓存 */
export function loadFromCache(): void {
  const cached = ArticleCache.loadRecent();
  // 只保留最近2天的
  const recent = filterRecentArticles(cached);
  if (recent.length > 0) {
    articles.set(recent);
    // 初始加载第一批
    loadMoreArticles();
  }
}

/** 添加新文章到池中 */
export function addArticlesToPool(newArticles: Article[]): void {
  articles.update(current => {
    const map = new Map<string, Article>();
    for (const a of current) map.set(a.id, a);
    for (const a of newArticles) {
      if (!map.has(a.id)) map.set(a.id, a);
    }
    // 只保留最近2天的
    const all = Array.from(map.values());
    return filterRecentArticles(all);
  });
}

/** 加载更多文章（渐进式） */
export function loadMoreArticles(): void {
  const all = get(articles);
  const current = get(displayedArticles);

  // 筛选未显示过的文章，按时间排序
  const unseen = all
    .filter(a => !displayedIds.has(a.id))
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

  if (unseen.length > 0) {
    const selected = unseen.slice(0, LOAD_BATCH_SIZE);
    selected.forEach(a => displayedIds.add(a.id));
    displayedArticles.set([...current, ...selected]);
    hasMore.set(unseen.length > LOAD_BATCH_SIZE);
  } else {
    hasMore.set(false);
  }
}

/** 刷新 - 拉取新内容并替换显示 */
export function refreshArticles(): void {
  const all = get(articles);

  // 清空已显示记录
  displayedIds.clear();

  // 按时间排序，取最新的
  const sorted = [...all].sort((a, b) =>
    new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );

  const selected = sorted.slice(0, LOAD_BATCH_SIZE);
  selected.forEach(a => displayedIds.add(a.id));
  displayedArticles.set(selected);
  hasMore.set(all.length > LOAD_BATCH_SIZE);
}

/** 标记为已读 */
export function markAsRead(articleId: string): void {
  displayedArticles.update(list =>
    list.map(a => a.id === articleId ? { ...a, isRead: true } : a)
  );
  articles.update(list =>
    list.map(a => a.id === articleId ? { ...a, isRead: true } : a)
  );
}

/** 标记全部已读 */
export function markAllAsRead(): void {
  displayedArticles.update(list => list.map(a => ({ ...a, isRead: true })));
  articles.update(list => list.map(a => ({ ...a, isRead: true })));
}

/** 切换收藏 */
export function toggleBookmark(articleId: string): void {
  displayedArticles.update(list =>
    list.map(a => a.id === articleId ? { ...a, isBookmarked: !a.isBookmarked } : a)
  );
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
