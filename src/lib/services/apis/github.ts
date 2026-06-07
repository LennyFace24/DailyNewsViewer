import type { Article } from '$lib/types/news';

/** 使用 Jina Reader 获取 GitHub Trending */
export async function fetchGitHubTrending(
  language: string = '',
  since: string = 'daily'
): Promise<Article[]> {
  try {
    const langPath = language ? `/${language}` : '';
    const url = `https://r.jina.ai/https://github.com/trending${langPath}?since=${since}`;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);

    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        'Accept': 'text/plain'
      }
    });
    clearTimeout(timeout);

    if (!response.ok) {
      throw new Error(`Jina Reader error: ${response.status}`);
    }

    const text = await response.text();
    return parseTrendingText(text);
  } catch (error) {
    console.warn('GitHub Trending fetch failed:', error);
    return [];
  }
}

/** 解析 Trending 页面文本 */
function parseTrendingText(text: string): Article[] {
  const repos: Article[] = [];
  const blocks = text.split(/(?=\n[A-Za-z0-9_-]+\/[A-Za-z0-9_.-]+\n)/);

  for (const block of blocks) {
    if (!block.trim()) continue;

    const repoMatch = block.match(/([a-zA-Z0-9_-]+)\/([a-zA-Z0-9_.-]+)/);
    if (!repoMatch) continue;

    const author = repoMatch[1];
    const name = repoMatch[2];
    const url = `https://github.com/${author}/${name}`;

    // 提取描述
    const descMatch = block.match(/\n([^\n]+)\n/);
    const description = descMatch ? descMatch[1].trim() : '';

    // 提取语言
    const langMatch = block.match(/\n([A-Z][a-z+#]+)\n/);
    const language = langMatch ? langMatch[1] : '';

    // 提取今日星数
    const starsMatch = block.match(/([\d,]+)\s*stars?\s*today/i);
    const todayStars = starsMatch ? parseInt(starsMatch[1].replace(/,/g, '')) : 0;

    // 提取总星数
    const totalStarsMatch = block.match(/([\d,]+)\s*$/m);
    const totalStars = totalStarsMatch ? parseInt(totalStarsMatch[1].replace(/,/g, '')) : 0;

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
        totalStars ? `${formatStars(totalStars)} stars` : ''
      ].filter(Boolean)
    });
  }

  return repos.slice(0, 25);
}

function formatStars(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return n.toString();
}
