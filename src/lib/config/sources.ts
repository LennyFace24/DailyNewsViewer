import type { SourceConfig } from '$lib/types/source';
import { SourceType, ContentCategory } from '$lib/types/source';

/** 高质量预设数据源（按板块分类） */
export const PRESET_SOURCES: SourceConfig[] = [
  // ============ AI / ML ============
  {
    id: 'openai-blog',
    name: 'OpenAI Blog',
    description: 'OpenAI 官方博客',
    type: SourceType.RSS,
    url: 'https://openai.com/blog/rss.xml',
    category: ContentCategory.AI,
    quality: 'high',
    fullContent: true
  },
  {
    id: 'google-ai',
    name: 'Google AI Blog',
    description: 'Google AI 研究博客',
    type: SourceType.RSS,
    url: 'https://blog.google/technology/ai/rss/',
    category: ContentCategory.AI,
    quality: 'high'
  },
  {
    id: 'huggingface',
    name: 'Hugging Face Blog',
    description: 'Hugging Face 官方博客',
    type: SourceType.RSS,
    url: 'https://huggingface.co/blog/feed.xml',
    category: ContentCategory.AI,
    quality: 'high',
    fullContent: true
  },
  {
    id: 'deepmind',
    name: 'DeepMind Blog',
    description: 'DeepMind 研究博客',
    type: SourceType.RSS,
    url: 'https://deepmind.google/blog/rss.xml',
    category: ContentCategory.AI,
    quality: 'high'
  },

  // ============ CS 研究 ============
  {
    id: 'arxiv-cs-ai',
    name: 'ArXiv AI',
    description: 'ArXiv 人工智能论文',
    type: SourceType.RSS,
    url: 'https://rss.arxiv.org/rss/cs.AI',
    category: ContentCategory.CS_RESEARCH,
    quality: 'high'
  },
  {
    id: 'arxiv-cs-lg',
    name: 'ArXiv ML',
    description: 'ArXiv 机器学习论文',
    type: SourceType.RSS,
    url: 'https://rss.arxiv.org/rss/cs.LG',
    category: ContentCategory.CS_RESEARCH,
    quality: 'high'
  },
  {
    id: 'paperswithcode',
    name: 'Papers With Code',
    description: '最新 ML 论文与代码',
    type: SourceType.RSS,
    url: 'https://paperswithcode.com/latest.rss',
    category: ContentCategory.CS_RESEARCH,
    quality: 'high'
  },

  // ============ 安全 ============
  {
    id: 'krebsonsecurity',
    name: 'Krebs on Security',
    description: '网络安全深度报道',
    type: SourceType.RSS,
    url: 'https://krebsonsecurity.com/feed/',
    category: ContentCategory.SECURITY,
    quality: 'high',
    fullContent: true
  },
  {
    id: 'thehackernews',
    name: 'The Hacker News',
    description: '最新安全资讯',
    type: SourceType.RSS,
    url: 'https://feeds.feedburner.com/TheHackersNews',
    category: ContentCategory.SECURITY,
    quality: 'high'
  },
  {
    id: 'schneier',
    name: 'Schneier on Security',
    description: 'Bruce Schneier 安全博客',
    type: SourceType.RSS,
    url: 'https://www.schneier.com/feed/',
    category: ContentCategory.SECURITY,
    quality: 'high',
    fullContent: true
  },

  // ============ Web 开发 ============
  {
    id: 'webdev',
    name: 'web.dev',
    description: 'Google Web 开发指南',
    type: SourceType.RSS,
    url: 'https://web.dev/feed.xml',
    category: ContentCategory.WEB_DEV,
    quality: 'high',
    fullContent: true
  },
  {
    id: 'css-tricks',
    name: 'CSS-Tricks',
    description: 'CSS 技巧与教程',
    type: SourceType.RSS,
    url: 'https://css-tricks.com/feed/',
    category: ContentCategory.WEB_DEV,
    quality: 'high'
  },
  {
    id: 'react-blog',
    name: 'React Blog',
    description: 'React 官方博客',
    type: SourceType.RSS,
    url: 'https://react.dev/blog/rss.xml',
    category: ContentCategory.WEB_DEV,
    quality: 'high'
  },

  // ============ 游戏开发 ============
  {
    id: 'gamedeveloper',
    name: 'Game Developer',
    description: '游戏开发行业资讯',
    type: SourceType.RSS,
    url: 'https://www.gamedeveloper.com/rss.xml',
    category: ContentCategory.GAME_DEV,
    quality: 'high'
  },
  {
    id: 'unity-blog',
    name: 'Unity Blog',
    description: 'Unity 官方博客',
    type: SourceType.RSS,
    url: 'https://unity.com/blog/feed',
    category: ContentCategory.GAME_DEV,
    quality: 'high'
  },
  {
    id: 'unreal-engine',
    name: 'Unreal Engine Blog',
    description: '虚幻引擎博客',
    type: SourceType.RSS,
    url: 'https://www.unrealengine.com/en-US/feed',
    category: ContentCategory.GAME_DEV,
    quality: 'high'
  },

  // ============ 开源 ============
  {
    id: 'github-blog',
    name: 'GitHub Blog',
    description: 'GitHub 官方博客',
    type: SourceType.RSS,
    url: 'https://github.blog/feed/',
    category: ContentCategory.OPEN_SOURCE,
    quality: 'high'
  },
  {
    id: 'hackernews',
    name: 'Hacker News',
    description: '硅谷顶级科技社区',
    type: SourceType.API,
    url: 'https://hacker-news.firebaseio.com/v0',
    category: ContentCategory.OPEN_SOURCE,
    quality: 'high'
  },

  // ============ 科技新闻 ============
  {
    id: 'techcrunch',
    name: 'TechCrunch',
    description: '科技创业新闻',
    type: SourceType.RSS,
    url: 'https://techcrunch.com/feed/',
    category: ContentCategory.TECH_NEWS,
    quality: 'high'
  },
  {
    id: 'theverge',
    name: 'The Verge',
    description: '消费科技资讯',
    type: SourceType.RSS,
    url: 'https://www.theverge.com/rss/index.xml',
    category: ContentCategory.TECH_NEWS,
    quality: 'high'
  },
  {
    id: 'arstechnica',
    name: 'Ars Technica',
    description: '深度技术报道',
    type: SourceType.RSS,
    url: 'https://feeds.arstechnica.com/arstechnica/index',
    category: ContentCategory.TECH_NEWS,
    quality: 'high'
  },
  {
    id: 'wired',
    name: 'WIRED',
    description: '科技与文化',
    type: SourceType.RSS,
    url: 'https://www.wired.com/feed/rss',
    category: ContentCategory.TECH_NEWS,
    quality: 'high'
  }
];
