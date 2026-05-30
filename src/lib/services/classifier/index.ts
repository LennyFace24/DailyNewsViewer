import { ContentTag, TAG_INFO } from '$lib/types/source';
import type { Article } from '$lib/types/news';

/** 根据文章内容自动分类 */
export function classifyArticle(article: Article): ContentTag {
  const text = `${article.title} ${article.summary} ${article.tags.join(' ')}`.toLowerCase();

  // 按优先级匹配关键词
  const scores: Record<ContentTag, number> = {} as any;

  for (const [tag, info] of Object.entries(TAG_INFO)) {
    if (tag === ContentTag.GENERAL) continue;

    let score = 0;
    for (const keyword of info.keywords) {
      if (text.includes(keyword.toLowerCase())) {
        score += keyword.length; // 长关键词权重更高
      }
    }
    scores[tag as ContentTag] = score;
  }

  // 找到得分最高的标签
  const bestTag = Object.entries(scores)
    .sort(([, a], [, b]) => b - a)
    .find(([, score]) => score > 0);

  return bestTag ? (bestTag[0] as ContentTag) : ContentTag.GENERAL;
}

/** 为文章列表批量分类 */
export function classifyArticles(articles: Article[]): Map<ContentTag, Article[]> {
  const groups = new Map<ContentTag, Article[]>();

  // 初始化所有标签
  for (const tag of Object.values(ContentTag)) {
    groups.set(tag, []);
  }

  for (const article of articles) {
    const tag = classifyArticle(article);
    groups.get(tag)!.push(article);
  }

  // 移除空分类
  for (const [tag, articles] of groups) {
    if (articles.length === 0) {
      groups.delete(tag);
    }
  }

  return groups;
}
