import type { Article } from '$lib/types/news';

/** 推荐配置 */
export interface RecommendConfig {
  maxResults?: number;
  tags?: string[];
  excludeRead?: boolean;
}

/** 基于标签的文章推荐 */
export function recommendArticles(
  articles: Article[],
  config: RecommendConfig = {}
): Article[] {
  const { maxResults = 10, tags = [], excludeRead = true } = config;

  let filtered = [...articles];

  // 排除已读
  if (excludeRead) {
    filtered = filtered.filter(a => !a.isRead);
  }

  // 按标签筛选
  if (tags.length > 0) {
    filtered = filterByTags(filtered, tags);
  }

  // 计算推荐分数
  const scored = filtered.map(article => ({
    article,
    score: calculateScore(article, articles)
  }));

  // 按分数排序
  scored.sort((a, b) => b.score - a.score);

  return scored.slice(0, maxResults).map(s => s.article);
}

/** 按标签筛选文章 */
function filterByTags(articles: Article[], tags: string[]): Article[] {
  return articles.filter(article => {
    const text = `${article.title} ${article.summary}`.toLowerCase();
    return tags.some(tag => text.includes(tag.toLowerCase()));
  });
}

/** 计算推荐分数 */
function calculateScore(article: Article, allArticles: Article[]): number {
  let score = 0;

  // 1. 时间权重（越新越高）
  const ageInHours = (Date.now() - new Date(article.publishedAt).getTime()) / (1000 * 60 * 60);
  score += Math.max(0, 100 - ageInHours);

  // 2. 来源多样性（不同来源加分）
  const sourceCount = allArticles.filter(a => a.sourceId === article.sourceId).length;
  if (sourceCount < 5) score += 20;

  // 3. 内容长度（适中长度加分）
  const contentLength = article.summary.length;
  if (contentLength > 50 && contentLength < 300) score += 10;

  // 4. 有图片加分
  if (article.thumbnail) score += 5;

  // 5. 收藏文章高权重
  if (article.isBookmarked) score += 50;

  return score;
}

/** 获取热门话题 */
export function getTrendingTopics(articles: Article[]): string[] {
  const wordCount = new Map<string, number>();

  const stopWords = new Set([
    'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
    'of', 'with', 'by', 'from', 'is', 'it', 'that', 'this', 'was', 'are'
  ]);

  articles.forEach(article => {
    const words = `${article.title} ${article.summary}`
      .toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter(w => w.length > 3 && !stopWords.has(w));

    words.forEach(word => {
      wordCount.set(word, (wordCount.get(word) || 0) + 1);
    });
  });

  return Array.from(wordCount.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([word]) => word);
}
