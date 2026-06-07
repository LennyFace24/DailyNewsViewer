import type { Article } from '$lib/types/news';

interface GitHubRepo {
  full_name: string;
  html_url: string;
  description: string;
  stargazers_count: number;
  language: string;
  owner: {
    login: string;
    avatar_url: string;
  };
  topics: string[];
}

/** 使用 GitHub 搜索 API 获取热门仓库（模拟 Trending） */
export async function fetchGitHubTrending(
  language: string = '',
  since: string = 'daily'
): Promise<Article[]> {
  try {
    // 计算日期范围
    const now = new Date();
    let daysAgo = 1;
    if (since === 'weekly') daysAgo = 7;
    if (since === 'monthly') daysAgo = 30;
    const sinceDate = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);
    const dateStr = sinceDate.toISOString().split('T')[0];

    // 构建查询
    let query = `pushed:>${dateStr} stars:>100`;
    if (language) {
      query += ` language:${language}`;
    }

    const url = `https://api.github.com/search/repositories?q=${encodeURIComponent(query)}&sort=stars&order=desc&per_page=25`;

    const response = await fetch(url, {
      headers: {
        'Accept': 'application/vnd.github.v3+json'
      },
      signal: AbortSignal.timeout(15000)
    });

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }

    const data = await response.json();
    const repos: GitHubRepo[] = data.items || [];

    return repos.map((repo) => ({
      id: `github-trending-${repo.full_name}`,
      title: repo.full_name,
      url: repo.html_url,
      content: repo.description || '',
      summary: repo.description || 'No description available',
      thumbnail: repo.owner?.avatar_url || `https://opengraph.githubassets.com/1/${repo.full_name}`,
      author: repo.owner?.login || repo.full_name.split('/')[0],
      sourceId: 'github-trending',
      sourceName: 'GitHub Trending',
      publishedAt: new Date(),
      fetchedAt: new Date(),
      isRead: false,
      isBookmarked: false,
      tags: [
        repo.language,
        repo.topics?.slice(0, 3).join(', '),
        formatStars(repo.stargazers_count)
      ].filter(Boolean)
    }));
  } catch (error) {
    console.warn('GitHub Trending fetch failed:', error);
    return [];
  }
}

function formatStars(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k ⭐`;
  return `${n} ⭐`;
}
