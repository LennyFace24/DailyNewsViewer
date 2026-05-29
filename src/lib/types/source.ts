/** 数据源类型 */
export enum SourceType {
  RSS = 'rss',
  API = 'api'
}

/** 内容板块 */
export enum ContentCategory {
  AI = 'ai',
  GAME_DEV = 'game_dev',
  CS_RESEARCH = 'cs_research',
  SECURITY = 'security',
  WEB_DEV = 'web_dev',
  OPEN_SOURCE = 'open_source',
  TECH_NEWS = 'tech_news',
  CUSTOM = 'custom'
}

/** 板块显示名称 */
export const CATEGORY_LABELS: Record<ContentCategory, string> = {
  [ContentCategory.AI]: '🤖 AI / ML',
  [ContentCategory.GAME_DEV]: '🎮 游戏开发',
  [ContentCategory.CS_RESEARCH]: '📚 CS 研究',
  [ContentCategory.SECURITY]: '🔒 安全',
  [ContentCategory.WEB_DEV]: '🌐 Web 开发',
  [ContentCategory.OPEN_SOURCE]: '📦 开源',
  [ContentCategory.TECH_NEWS]: '📰 科技新闻',
  [ContentCategory.CUSTOM]: '⭐ 自定义'
};

/** 数据源配置 */
export interface SourceConfig {
  id: string;
  name: string;
  description: string;
  type: SourceType;
  url: string;
  category: ContentCategory;
  quality?: 'high' | 'medium'; // 内容质量标记
  fullContent?: boolean; // 是否提供完整内容
}
