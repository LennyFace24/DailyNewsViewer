import type { Article } from '$lib/types/news';

/** 获取 GitHub Trending 仓库 */
export async function fetchGitHubTrending(
  language: string = '',
  since: string = 'daily'
): Promise<Article[]> {
  try {
    const langPath = language ? `/${language}` : '';
    const targetUrl = `https://github.com/trending${langPath}?since=${since}`;
    const url = `https://r.jina.ai/${targetUrl}`;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 20000);

    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        'Accept': 'text/plain',
        'X-Return-Format': 'text',
        'X-No-Cache': 'true'
      }
    });
    clearTimeout(timeout);

    if (!response.ok) {
      throw new Error(`Jina Reader error: ${response.status}`);
    }

    const text = await response.text();
    return parseTrendingContent(text);
  } catch (error) {
    console.warn('GitHub Trending fetch failed:', error);
    return [];
  }
}

/** 解析 Trending 内容 */
function parseTrendingContent(text: string): Article[] {
  const repos: Article[] = [];

  // 匹配 author/name 模式
  const repoRegex = /(?:^|\n)\s*([a-zA-Z0-9_-]+)\s*\/\s*([a-zA-Z0-9_.-]+)\s*(?:\n|$)/g;
  const matches = [...text.matchAll(repoRegex)];

  for (const match of matches) {
    const author = match[1];
    const name = match[2].replace(/\s+/g, '');
    const url = `https://github.com/${author}/${name}`;

    // 提取描述（在 author/name 后面的文本）
    const afterMatch = text.substring(match.index! + match[0].length);
    const descMatch = afterMatch.match(/^([^\n]+)/);
    const description = descMatch ? descMatch[1].trim().substring(0, 200) : '';

    // 提取星数
    const starsMatch = afterMatch.match(/([\d,]+)\s*(?:stars?|⭐)/i);
    const stars = starsMatch ? starsMatch[1].replace(/,/g, '') : '';

    // 提取今日星数
    const todayMatch = afterMatch.match(/([\d,]+)\s*(?:today|stars?\s*today)/i);
    const todayStars = todayMatch ? todayMatch[1].replace(/,/g, '') : '';

    // 提取语言
    const langMatch = afterMatch.match(/\n\s*([A-Z][a-z+#]+)\s*\n/);
    const language = langMatch ? langMatch[1] : '';

    if (author && name) {
      repos.push({
        id: `github-trending-${author}-${name}`,
        title: `${author}/${name}`,
        url,
        content: description,
        summary: description || 'No description available',
        thumbnail: `https://opengraph.githubassets.com/1/${author}/${name}`,
        author,
        sourceId: 'github-trending',
        sourceName: 'GitHub Trending',
        publishedAt: new Date(),
        fetchedAt: new Date(),
        isRead: false,
        isBookmarked: false,
        tags: [
          language,
          todayStars ? `+${todayStars} today` : '',
          stars ? `${formatStars(parseInt(stars))} stars` : ''
        ].filter(Boolean)
      });
    }
  }

  return repos.slice(0, 25);
}

function formatStars(n: number): string {
  if (isNaN(n)) return '';
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return n.toString();
}
