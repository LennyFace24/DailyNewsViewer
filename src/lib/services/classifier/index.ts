import { ContentTag, TAG_INFO } from '$lib/types/source';
import type { Article } from '$lib/types/news';
import type { SourceConfig } from '$lib/types/source';
import { PRESET_SOURCES } from '$lib/config/sources';

/** 源分类缓存 */
const sourceCategoryMap = new Map<string, ContentTag>();

/** 初始化源分类映射 */
function initSourceMap() {
  for (const source of PRESET_SOURCES) {
    if (source.category) {
      sourceCategoryMap.set(source.id, source.category);
    }
  }
  console.log('[Classifier] Initialized with', sourceCategoryMap.size, 'sources');
}

initSourceMap();

/** 添加自定义源的分类 */
export function setSourceCategory(sourceId: string, category: ContentTag): void {
  sourceCategoryMap.set(sourceId, category);
}

/** 根据源获取文章分类 */
export function getArticleCategory(article: Article): ContentTag {
  // 1. 先从源的分类获取
  const sourceCategory = sourceCategoryMap.get(article.sourceId);
  if (sourceCategory) {
    return sourceCategory;
  }

  // 2. 如果源没有分类，尝试从文章内容推断
  return inferCategoryFromContent(article);
}

/** 从内容推断分类 */
function inferCategoryFromContent(article: Article): ContentTag {
  const text = `${article.title} ${article.summary}`.toLowerCase();

  // AI/ML 关键词
  if (matchKeywords(text, ['ai', 'machine learning', 'deep learning', 'gpt', 'llm', 'neural', 'openai', 'chatgpt', 'ml', 'transformer'])) {
    return ContentTag.AI;
  }

  // 安全关键词
  if (matchKeywords(text, ['security', 'vulnerability', 'hack', 'exploit', 'malware', 'cve', 'privacy', 'encryption'])) {
    return ContentTag.SECURITY;
  }

  // Web 开发关键词
  if (matchKeywords(text, ['javascript', 'typescript', 'react', 'vue', 'angular', 'css', 'html', 'frontend', 'backend', 'node'])) {
    return ContentTag.WEB;
  }

  // 移动端关键词
  if (matchKeywords(text, ['android', 'ios', 'flutter', 'react native', 'swift', 'kotlin', 'mobile'])) {
    return ContentTag.MOBILE;
  }

  // 游戏开发关键词
  if (matchKeywords(text, ['game', 'unity', 'unreal', 'godot', 'gamedev', 'shader', 'rendering'])) {
    return ContentTag.GAME_DEV;
  }

  // DevOps 关键词
  if (matchKeywords(text, ['docker', 'kubernetes', 'k8s', 'ci/cd', 'jenkins', 'terraform', 'aws', 'cloud', 'devops'])) {
    return ContentTag.DEVOPS;
  }

  // 数据库关键词
  if (matchKeywords(text, ['database', 'sql', 'postgres', 'mysql', 'mongodb', 'redis', 'elasticsearch'])) {
    return ContentTag.DATABASE;
  }

  // 编程语言关键词
  if (matchKeywords(text, ['rust', 'golang', 'python', 'java', 'c++', 'swift', 'kotlin', 'programming', 'compiler'])) {
    return ContentTag.LANGUAGES;
  }

  // 学术关键词
  if (matchKeywords(text, ['paper', 'research', 'arxiv', 'conference', 'journal', 'study'])) {
    return ContentTag.RESEARCH;
  }

  // 开源关键词
  if (matchKeywords(text, ['open source', 'github', 'gitlab', 'foss', 'mit license'])) {
    return ContentTag.OPEN_SOURCE;
  }

  // 创业关键词
  if (matchKeywords(text, ['startup', 'funding', 'vc', 'venture', 'seed', 'series a'])) {
    return ContentTag.STARTUP;
  }

  // 默认返回科技新闻
  return ContentTag.TECH_NEWS;
}

/** 关键词匹配 */
function matchKeywords(text: string, keywords: string[]): boolean {
  return keywords.some(keyword => text.includes(keyword));
}

/** 获取所有可用的分类 */
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
