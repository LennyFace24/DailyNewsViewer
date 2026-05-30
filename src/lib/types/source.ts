/** 数据源类型 */
export enum SourceType {
  RSS = 'rss',
  API = 'api'
}

/** 内容分类标签 */
export enum ContentTag {
  AI = 'ai',
  SECURITY = 'security',
  WEB = 'web',
  MOBILE = 'mobile',
  GAME_DEV = 'gamedev',
  DEVOPS = 'devops',
  DATABASE = 'database',
  LANGUAGES = 'languages',
  OPEN_SOURCE = 'opensource',
  STARTUP = 'startup',
  CAREER = 'career',
  RESEARCH = 'research',
  GENERAL = 'general'
}

/** 标签显示信息（使用 Lucide 图标名称） */
export const TAG_INFO: Record<ContentTag, { label: string; icon: string; keywords: string[] }> = {
  [ContentTag.AI]: { label: 'AI / ML', icon: 'brain', keywords: ['ai', 'ml', 'machine learning', 'deep learning', 'gpt', 'llm', 'neural', 'transformer', 'openai', 'chatgpt', 'artificial intelligence', '模型', '训练', '推理'] },
  [ContentTag.SECURITY]: { label: '安全', icon: 'shield', keywords: ['security', 'vulnerability', 'hack', 'exploit', 'malware', 'ransomware', 'cve', 'zero-day', 'encryption', 'privacy', '漏洞', '安全', '加密'] },
  [ContentTag.WEB]: { label: 'Web', icon: 'globe', keywords: ['javascript', 'typescript', 'react', 'vue', 'angular', 'nextjs', 'nuxt', 'css', 'html', 'frontend', 'backend', 'node', 'deno', 'bun', 'web'] },
  [ContentTag.MOBILE]: { label: '移动端', icon: 'smartphone', keywords: ['android', 'ios', 'flutter', 'react native', 'swift', 'kotlin', 'mobile', 'app store'] },
  [ContentTag.GAME_DEV]: { label: '游戏', icon: 'gamepad-2', keywords: ['game', 'unity', 'unreal', 'godot', 'gamedev', 'rendering', 'shader', '游戏'] },
  [ContentTag.DEVOPS]: { label: 'DevOps', icon: 'settings', keywords: ['docker', 'kubernetes', 'k8s', 'ci/cd', 'jenkins', 'github actions', 'terraform', 'aws', 'cloud', 'devops', '部署', '运维'] },
  [ContentTag.DATABASE]: { label: '数据库', icon: 'database', keywords: ['database', 'sql', 'postgres', 'mysql', 'mongodb', 'redis', 'elasticsearch', '数据库'] },
  [ContentTag.LANGUAGES]: { label: '编程语言', icon: 'code', keywords: ['rust', 'go', 'python', 'java', 'c++', 'swift', 'kotlin', 'programming language', 'compiler', '编程'] },
  [ContentTag.OPEN_SOURCE]: { label: '开源', icon: 'package', keywords: ['open source', 'github', 'gitlab', 'foss', 'mit license', 'apache', '开源'] },
  [ContentTag.STARTUP]: { label: '创业', icon: 'rocket', keywords: ['startup', 'funding', 'vc', 'venture', 'seed', 'series a', 'ipo', '创业', '融资'] },
  [ContentTag.CAREER]: { label: '职场', icon: 'briefcase', keywords: ['career', 'job', 'interview', 'salary', 'hiring', 'remote work', '职场', '面试', '招聘'] },
  [ContentTag.RESEARCH]: { label: '学术', icon: 'book-open', keywords: ['paper', 'research', 'arxiv', 'conference', 'journal', 'peer review', '论文', '研究'] },
  [ContentTag.GENERAL]: { label: '综合', icon: 'newspaper', keywords: [] }
};

/** 数据源配置 */
export interface SourceConfig {
  id: string;
  name: string;
  description: string;
  type: SourceType;
  url: string;
  category?: ContentTag;
}
