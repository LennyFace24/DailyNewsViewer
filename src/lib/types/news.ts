/** 新闻文章统一接口 */
export interface Article {
  id: string;
  title: string;
  url: string;
  content: string;
  summary: string;
  thumbnail?: string;
  author: string;
  sourceId: string;
  sourceName: string;
  sourceIcon?: string;
  publishedAt: Date;
  fetchedAt: Date;
  isRead: boolean;
  isBookmarked: boolean;
  tags: string[];
}

/** 文章列表响应 */
export interface ArticleListResponse {
  articles: Article[];
  total: number;
  hasMore: boolean;
}

/** 文章过滤器 */
export interface ArticleFilter {
  sourceId?: string;
  isRead?: boolean;
  isBookmarked?: boolean;
  tags?: string[];
  sortBy: 'newest' | 'oldest' | 'popular';
}

/** 日期分组的文章 */
export interface ArticleGroup {
  date: string;
  articles: Article[];
}
