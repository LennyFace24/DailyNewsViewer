import type { Article } from '$lib/types/news';

interface TrendingRepo {
  author: string;
  name: string;
  url: string;
  description: string;
  language: string;
  stars: number;
  forks: number;
  currentPeriodStars: number;
}

/** 获取 GitHub Trending 仓库 */
export async function fetchGitHubTrending(
  language: string = '',
  since: string = 'daily'
): Promise<Article[]> {
  try {
    const langPath = language ? `/${language}` : '';
    const url = `https://api.gitterapp.com/repositories?language=${language}&since=${since}`;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);

    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timeout);

    if (!response.ok) {
      throw new Error(`GitHub Trending API error: ${response.status}`);
    }

    const repos: TrendingRepo[] = await response.json();

    return repos.slice(0, 25).map((repo) => ({
      id: `github-trending-${repo.author}-${repo.name}`,
      title: `${repo.author}/${repo.name}`,
      url: repo.url,
      content: repo.description || '',
      summary: repo.description || 'No description available',
      thumbnail: `https://opengraph.githubassets.com/1/${repo.author}/${repo.name}`,
      author: repo.author,
      sourceId: 'github-trending',
      sourceName: 'GitHub Trending',
      publishedAt: new Date(),
      fetchedAt: new Date(),
      isRead: false,
      isBookmarked: false,
      tags: [
        repo.language,
        repo.currentPeriodStars ? `+${repo.currentPeriodStars} today` : '',
        repo.stars ? `${formatStars(repo.stars)} stars` : ''
      ].filter(Boolean)
    }));
  } catch (error) {
    console.warn('GitHub Trending fetch failed:', error);
    return [];
  }
}

function formatStars(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return n.toString();
}
