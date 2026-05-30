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

/** 最后刷新时间 */
export const lastRefreshTime = writable<Date | null>(null);

/** 已显示过的文章ID */
const displayedIds = new Set<string>();

/** 每个分类每次显示的数量 */
const ARTICLES_PER_PAGE = 15;

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
  if (cached.length > 0) {
    articles.set(cached);
    // 初始显示第一批
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
    return Array.from(map.values());
  });
}

/** 加载更多文章（分页） */
export function loadMoreArticles(): void {
  const all = get(articles);
  const current = get(displayedArticles);

  // 筛选未显示过的文章
  const unseen = all.filter(a => !displayedIds.has(a.id));

  if (unseen.length >= ARTICLES_PER_PAGE) {
    // 随机选取一批
    const shuffled = shuffleArray(unseen);
    const selected = shuffled.slice(0, ARTICLES_PER_PAGE);
    selected.forEach(a => displayedIds.add(a.id));
    displayedArticles.set([...current, ...selected]);
  } else if (unseen.length > 0) {
    // 剩余的全部加入
    unseen.forEach(a => displayedIds.add(a.id));
    displayedArticles.set([...current, ...unseen]);
  } else {
    // 所有都显示过了，随机重复
    const shuffled = shuffleArray(all);
    const selected = shuffled.slice(0, ARTICLES_PER_PAGE);
    displayedArticles.set([...current, ...selected]);
  }
}

/** 刷新 - 拉取新内容并显示 */
export function refreshArticles(): void {
  const all = get(articles);
  const current = get(displayedArticles);

  // 优先显示最新的未显示内容
  const unseen = all
    .filter(a => !displayedIds.has(a.id))
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

  if (unseen.length > 0) {
    const selected = unseen.slice(0, ARTICLES_PER_PAGE);
    selected.forEach(a => displayedIds.add(a.id));
    // 替换当前显示的内容（刷新效果）
    displayedArticles.set(selected);
  } else {
    // 没有新内容，随机显示
    const shuffled = shuffleArray(all);
    const selected = shuffled.slice(0, ARTICLES_PER_PAGE);
    displayedArticles.set(selected);
  }
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

/** 打乱数组 */
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}
