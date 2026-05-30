import type { SourceConfig } from '$lib/types/source';
import { SourceType } from '$lib/types/source';

/** 预设高质量数据源 */
export const PRESET_SOURCES: SourceConfig[] = [
  // 科技新闻
  { id: 'hackernews', name: 'Hacker News', description: '硅谷顶级科技社区', type: SourceType.API, url: 'https://hacker-news.firebaseio.com/v0' },
  { id: 'techcrunch', name: 'TechCrunch', description: '科技创业新闻', type: SourceType.RSS, url: 'https://techcrunch.com/feed/' },
  { id: 'theverge', name: 'The Verge', description: '消费科技资讯', type: SourceType.RSS, url: 'https://www.theverge.com/rss/index.xml' },
  { id: 'arstechnica', name: 'Ars Technica', description: '深度技术报道', type: SourceType.RSS, url: 'https://feeds.arstechnica.com/arstechnica/index' },
  { id: 'wired', name: 'WIRED', description: '科技与文化', type: SourceType.RSS, url: 'https://www.wired.com/feed/rss' },

  // AI / ML
  { id: 'openai-blog', name: 'OpenAI Blog', description: 'OpenAI 官方博客', type: SourceType.RSS, url: 'https://openai.com/blog/rss.xml' },
  { id: 'google-ai', name: 'Google AI', description: 'Google AI 研究', type: SourceType.RSS, url: 'https://blog.google/technology/ai/rss/' },
  { id: 'huggingface', name: 'Hugging Face', description: 'HF 官方博客', type: SourceType.RSS, url: 'https://huggingface.co/blog/feed.xml' },

  // 学术
  { id: 'arxiv-cs', name: 'ArXiv CS', description: '计算机科学论文', type: SourceType.RSS, url: 'https://rss.arxiv.org/rss/cs' },

  // 安全
  { id: 'krebsonsecurity', name: 'Krebs on Security', description: '网络安全深度报道', type: SourceType.RSS, url: 'https://krebsonsecurity.com/feed/' },
  { id: 'thehackernews', name: 'The Hacker News', description: '最新安全资讯', type: SourceType.RSS, url: 'https://feeds.feedburner.com/TheHackersNews' },

  // Web 开发
  { id: 'webdev', name: 'web.dev', description: 'Google Web 开发指南', type: SourceType.RSS, url: 'https://web.dev/feed.xml' },
  { id: 'css-tricks', name: 'CSS-Tricks', description: 'CSS 技巧与教程', type: SourceType.RSS, url: 'https://css-tricks.com/feed/' },

  // 开源
  { id: 'github-blog', name: 'GitHub Blog', description: 'GitHub 官方博客', type: SourceType.RSS, url: 'https://github.blog/feed/' },

  // 游戏
  { id: 'gamedeveloper', name: 'Game Developer', description: '游戏开发资讯', type: SourceType.RSS, url: 'https://www.gamedeveloper.com/rss.xml' },

  // 社区
  { id: 'hnrss', name: 'HN RSS', description: 'Hacker News RSS', type: SourceType.RSS, url: 'https://hnrss.org/frontpage' },
  { id: 'reddit-programming', name: 'r/programming', description: 'Reddit 编程社区', type: SourceType.RSS, url: 'https://www.reddit.com/r/programming/.rss' },
];
