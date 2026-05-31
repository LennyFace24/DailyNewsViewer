import { ContentTag, TAG_INFO } from '$lib/types/source';
import type { Article } from '$lib/types/news';
import type { SourceConfig } from '$lib/types/source';
import { PRESET_SOURCES } from '$lib/config/sources';

/** 源分类缓存 */
const sourceCategoryMap = new Map<string, ContentTag>();

// 初始化源分类映射
function initSourceMap() {
  for (const source of PRESET_SOURCES) {
    if (source.category) {
      sourceCategoryMap.set(source.id, source.category);
    }
  }
}
initSourceMap();

/** 添加自定义源的分类 */
export function setSourceCategory(sourceId: string, category: ContentTag): void {
  sourceCategoryMap.set(sourceId, category);
}

/** 根据源获取文章分类（不是根据文章内容） */
export function getArticleCategory(article: Article): ContentTag {
  // 直接从源的分类获取
  return sourceCategoryMap.get(article.sourceId) || ContentTag.GENERAL;
}

/** 获取所有可用的分类（有文章的分类） */
export function getAvailableCategories(articles: Article[]): ContentTag[] {
  const categories = new Set<ContentTag>();
  for (const article of articles) {
    categories.add(getArticleCategory(article));
  }
  return Array.from(categories).sort();
}

/** 按分类分组文章 */
export function groupArticlesByCategory(articles: Article[]): Map<ContentTag, Article[]> {
  const groups = new Map<ContentTag, Article[]>();

  for (const tag of Object.values(ContentTag)) {
    groups.set(tag, []);
  }

  for (const article of articles) {
    const tag = getArticleCategory(article);
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
