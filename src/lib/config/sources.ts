import type { SourceConfig } from '$lib/types/source';
import { SourceType, ContentTag } from '$lib/types/source';

/** 预设数据源 - 每个源绑定一个分类 */
export const PRESET_SOURCES: SourceConfig[] = [
  // ===== AI / ML =====
  { id: 'openai-blog', name: 'OpenAI Blog', description: 'OpenAI 官方博客', type: SourceType.RSS, url: 'https://openai.com/blog/rss.xml', category: ContentTag.AI },
  { id: 'google-ai', name: 'Google AI', description: 'Google AI 研究', type: SourceType.RSS, url: 'https://blog.google/technology/ai/rss/', category: ContentTag.AI },
  { id: 'huggingface', name: 'Hugging Face', description: 'HF 官方博客', type: SourceType.RSS, url: 'https://huggingface.co/blog/feed.xml', category: ContentTag.AI },
  { id: 'deepmind', name: 'DeepMind', description: 'DeepMind 研究博客', type: SourceType.RSS, url: 'https://deepmind.google/blog/rss.xml', category: ContentTag.AI },

  // ===== 安全 =====
  { id: 'krebsonsecurity', name: 'Krebs on Security', description: '网络安全深度报道', type: SourceType.RSS, url: 'https://krebsonsecurity.com/feed/', category: ContentTag.SECURITY },
  { id: 'thehackernews', name: 'The Hacker News', description: '最新安全资讯', type: SourceType.RSS, url: 'https://feeds.feedburner.com/TheHackersNews', category: ContentTag.SECURITY },
  { id: 'schneier', name: 'Schneier on Security', description: 'Bruce Schneier 安全博客', type: SourceType.RSS, url: 'https://www.schneier.com/feed/', category: ContentTag.SECURITY },

  // ===== Web 开发 =====
  { id: 'webdev', name: 'web.dev', description: 'Google Web 开发指南', type: SourceType.RSS, url: 'https://web.dev/feed.xml', category: ContentTag.WEB },
  { id: 'css-tricks', name: 'CSS-Tricks', description: 'CSS 技巧与教程', type: SourceType.RSS, url: 'https://css-tricks.com/feed/', category: ContentTag.WEB },
  { id: 'react-blog', name: 'React Blog', description: 'React 官方博客', type: SourceType.RSS, url: 'https://react.dev/blog/rss.xml', category: ContentTag.WEB },
  { id: 'vue-blog', name: 'Vue Blog', description: 'Vue.js 官方博客', type: SourceType.RSS, url: 'https://blog.vuejs.org/feed.rss', category: ContentTag.WEB },

  // ===== 移动端 =====
  { id: 'android-dev', name: 'Android Developers', description: 'Android 开发博客', type: SourceType.RSS, url: 'https://android-developers.googleblog.com/feeds/posts/default', category: ContentTag.MOBILE },
  { id: 'swift-org', name: 'Swift.org', description: 'Swift 官方博客', type: SourceType.RSS, url: 'https://www.swift.org/blog/feed.xml', category: ContentTag.MOBILE },

  // ===== 游戏开发 =====
  { id: 'gamedeveloper', name: 'Game Developer', description: '游戏开发行业资讯', type: SourceType.RSS, url: 'https://www.gamedeveloper.com/rss.xml', category: ContentTag.GAME_DEV },
  { id: 'unity-blog', name: 'Unity Blog', description: 'Unity 官方博客', type: SourceType.RSS, url: 'https://unity.com/blog/feed', category: ContentTag.GAME_DEV },
  { id: 'unreal-engine', name: 'Unreal Engine', description: '虚幻引擎博客', type: SourceType.RSS, url: 'https://www.unrealengine.com/en-US/feed', category: ContentTag.GAME_DEV },

  // ===== DevOps =====
  { id: 'github-blog', name: 'GitHub Blog', description: 'GitHub 官方博客', type: SourceType.RSS, url: 'https://github.blog/feed/', category: ContentTag.DEVOPS },
  { id: 'docker-blog', name: 'Docker Blog', description: 'Docker 官方博客', type: SourceType.RSS, url: 'https://www.docker.com/blog/feed/', category: ContentTag.DEVOPS },

  // ===== 数据库 =====
  { id: 'postgres-blog', name: 'PostgreSQL', description: 'PostgreSQL 官方新闻', type: SourceType.RSS, url: 'https://www.postgresql.org/about/newsarchive/', category: ContentTag.DATABASE },

  // ===== 编程语言 =====
  { id: 'rust-blog', name: 'Rust Blog', description: 'Rust 官方博客', type: SourceType.RSS, url: 'https://blog.rust-lang.org/feed.xml', category: ContentTag.LANGUAGES },
  { id: 'go-blog', name: 'Go Blog', description: 'Go 官方博客', type: SourceType.RSS, url: 'https://go.dev/blog/feed.atom', category: ContentTag.LANGUAGES },
  { id: 'python-blog', name: 'Python Blog', description: 'Python 官方博客', type: SourceType.RSS, url: 'https://blog.python.org/feeds/posts/default', category: ContentTag.LANGUAGES },

  // ===== 学术 =====
  { id: 'arxiv-cs', name: 'ArXiv CS', description: '计算机科学论文', type: SourceType.RSS, url: 'https://rss.arxiv.org/rss/cs', category: ContentTag.RESEARCH },
  { id: 'arxiv-ai', name: 'ArXiv AI', description: 'AI 论文', type: SourceType.RSS, url: 'https://rss.arxiv.org/rss/cs.AI', category: ContentTag.RESEARCH },
  { id: 'arxiv-ml', name: 'ArXiv ML', description: '机器学习论文', type: SourceType.RSS, url: 'https://rss.arxiv.org/rss/cs.LG', category: ContentTag.RESEARCH },

  // ===== 科技新闻 =====
  { id: 'hackernews', name: 'Hacker News', description: '硅谷顶级科技社区', type: SourceType.API, url: 'https://hacker-news.firebaseio.com/v0', category: ContentTag.TECH_NEWS },
  { id: 'techcrunch', name: 'TechCrunch', description: '科技创业新闻', type: SourceType.RSS, url: 'https://techcrunch.com/feed/', category: ContentTag.TECH_NEWS },
  { id: 'theverge', name: 'The Verge', description: '消费科技资讯', type: SourceType.RSS, url: 'https://www.theverge.com/rss/index.xml', category: ContentTag.TECH_NEWS },
  { id: 'arstechnica', name: 'Ars Technica', description: '深度技术报道', type: SourceType.RSS, url: 'https://feeds.arstechnica.com/arstechnica/index', category: ContentTag.TECH_NEWS },
  { id: 'wired', name: 'WIRED', description: '科技与文化', type: SourceType.RSS, url: 'https://www.wired.com/feed/rss', category: ContentTag.TECH_NEWS },

  // ===== 开源 =====
  { id: 'hnrss', name: 'HN RSS', description: 'Hacker News RSS', type: SourceType.RSS, url: 'https://hnrss.org/frontpage', category: ContentTag.OPEN_SOURCE },
  { id: 'reddit-programming', name: 'r/programming', description: 'Reddit 编程社区', type: SourceType.RSS, url: 'https://www.reddit.com/r/programming/.rss', category: ContentTag.OPEN_SOURCE },

  // ===== 创业 =====
  { id: 'techcrunch-startup', name: 'TC Startup', description: 'TechCrunch 创业板块', type: SourceType.RSS, url: 'https://techcrunch.com/category/startups/feed/', category: ContentTag.STARTUP },
];
