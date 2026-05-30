import { ContentTag, TAG_INFO } from '$lib/types/source';
import type { Article } from '$lib/types/news';

/** 分类缓存 */
const classificationCache = new Map<string, ContentTag>();

/** 改进的分类算法 - 使用缓存和词边界匹配 */
export function classifyArticle(article: Article): ContentTag {
  // 检查缓存
  const cached = classificationCache.get(article.id);
  if (cached) return cached;

  const text = `${article.title} ${article.summary}`.toLowerCase();
  const words = text.split(/[\s,.\-_:;!?()[\]{}'"\/\\]+/).filter(w => w.length > 1);

  const scores: Record<ContentTag, number> = {} as any;

  for (const [tag, info] of Object.entries(TAG_INFO)) {
    if (tag === ContentTag.GENERAL) continue;

    let score = 0;

    for (const keyword of info.keywords) {
      const kw = keyword.toLowerCase();

      // 精确匹配标题中的关键词（权重最高）
      if (article.title.toLowerCase().includes(kw)) {
        score += kw.length * 3;
        continue;
      }

      // 词边界匹配（避免部分匹配）
      if (words.some(w => w === kw)) {
        score += kw.length * 2;
        continue;
      }

      // 包含匹配（权重较低）
      if (text.includes(kw)) {
        if (!isFalsePositive(kw, text, tag as ContentTag)) {
          score += kw.length;
        }
      }
    }

    scores[tag as ContentTag] = score;
  }

  const bestTag = Object.entries(scores)
    .sort(([, a], [, b]) => b - a)
    .find(([, score]) => score > 5);

  const result = bestTag ? (bestTag[0] as ContentTag) : ContentTag.GENERAL;

  // 缓存结果
  classificationCache.set(article.id, result);

  return result;
}

/** 误匹配检测 */
function isFalsePositive(keyword: string, text: string, tag: ContentTag): boolean {
  if (keyword === 'web' && (text.includes('car') || text.includes('汽车') || text.includes('auto'))) {
    return true;
  }
  if (keyword === 'go' && !text.includes('golang') && !text.includes('go语言')) {
    return true;
  }
  if (keyword === 'rust' && !text.includes('rust语言') && !text.includes('rust-lang')) {
    return true;
  }
  return false;
}

/** 清除缓存（文章更新时调用） */
export function clearClassificationCache(): void {
  classificationCache.clear();
}

/** 为文章列表批量分类 */
export function classifyArticles(articles: Article[]): Map<ContentTag, Article[]> {
  const groups = new Map<ContentTag, Article[]>();

  for (const tag of Object.values(ContentTag)) {
    groups.set(tag, []);
  }

  for (const article of articles) {
    const tag = classifyArticle(article);
    groups.get(tag)!.push(article);
  }

  for (const [tag, articles] of groups) {
    if (articles.length === 0) {
      groups.delete(tag);
    }
  }

  return groups;
}
