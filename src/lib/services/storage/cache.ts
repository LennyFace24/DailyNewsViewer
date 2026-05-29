import type { Article } from '$lib/types/news';
import { isWithin7Days } from '$lib/utils/date';

const CACHE_KEY = 'dailytech_articles';
const BOOKMARKS_KEY = 'dailytech_bookmarks';
const MAX_CACHE_DAYS = 7;

/** 缓存存储服务 */
export class ArticleCache {
  /** 保存文章到缓存 */
  static save(articles: Article[]): void {
    try {
      const existing = this.loadAll();
      const merged = this.mergeArticles(existing, articles);
      const filtered = this.filterByDateRange(merged);

      localStorage.setItem(CACHE_KEY, JSON.stringify(filtered));
    } catch (error) {
      console.error('Failed to save articles:', error);
    }
  }

  /** 加载所有缓存文章 */
  static loadAll(): Article[] {
    try {
      const data = localStorage.getItem(CACHE_KEY);
      if (!data) return [];

      const articles = JSON.parse(data) as Article[];
      return articles.map(a => ({
        ...a,
        publishedAt: new Date(a.publishedAt),
        fetchedAt: new Date(a.fetchedAt)
      }));
    } catch (error) {
      console.error('Failed to load articles:', error);
      return [];
    }
  }

  /** 加载最近7天的文章 */
  static loadRecent(): Article[] {
    return this.loadAll().filter(a => isWithin7Days(a.publishedAt));
  }

  /** 合并文章（去重） */
  private static mergeArticles(existing: Article[], incoming: Article[]): Article[] {
    const map = new Map<string, Article>();

    for (const article of existing) {
      map.set(article.id, article);
    }

    for (const article of incoming) {
      const existingArticle = map.get(article.id);
      if (existingArticle) {
        map.set(article.id, {
          ...article,
          isRead: existingArticle.isRead,
          isBookmarked: existingArticle.isBookmarked
        });
      } else {
        map.set(article.id, article);
      }
    }

    return Array.from(map.values());
  }

  /** 按日期范围过滤 */
  private static filterByDateRange(articles: Article[]): Article[] {
    const bookmarked = articles.filter(a => a.isBookmarked);
    const recent = articles.filter(a => isWithin7Days(a.publishedAt) && !a.isBookmarked);

    return [...recent, ...bookmarked];
  }

  /** 清除过期缓存 */
  static clearExpired(): void {
    const articles = this.loadAll();
    const filtered = articles.filter(a =>
      isWithin7Days(a.publishedAt) || a.isBookmarked
    );
    localStorage.setItem(CACHE_KEY, JSON.stringify(filtered));
  }
}

/** 收藏存储服务 */
export class BookmarkStorage {
  private static key = BOOKMARKS_KEY;

  /** 保存收藏 */
  static save(article: Article): void {
    const bookmarks = this.loadAll();
    if (!bookmarks.find(a => a.id === article.id)) {
      bookmarks.push({ ...article, isBookmarked: true });
      localStorage.setItem(this.key, JSON.stringify(bookmarks));
    }
  }

  /** 移除收藏 */
  static remove(articleId: string): void {
    const bookmarks = this.loadAll().filter(a => a.id !== articleId);
    localStorage.setItem(this.key, JSON.stringify(bookmarks));
  }

  /** 加载所有收藏 */
  static loadAll(): Article[] {
    try {
      const data = localStorage.getItem(this.key);
      if (!data) return [];
      return JSON.parse(data) as Article[];
    } catch {
      return [];
    }
  }

  /** 检查是否已收藏 */
  static isBookmarked(articleId: string): boolean {
    return this.loadAll().some(a => a.id === articleId);
  }
}
