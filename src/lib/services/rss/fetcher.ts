import type { Article } from '$lib/types/news';
import type { SourceConfig } from '$lib/types/source';
import { parseRSSFeed } from './parser';
import { get } from 'svelte/store';
import { settings } from '$lib/stores/settings';

/** 默认代理列表 */
const DEFAULT_PROXIES = [
  'https://api.allorigins.win/raw?url=',
  'https://corsproxy.io/?',
  'https://api.codetabs.com/v1/proxy?quest='
];

/** 获取RSS源内容 */
export async function fetchRSSFeed(
  source: SourceConfig,
  limit: number = 20
): Promise<Article[]> {
  for (const proxy of DEFAULT_PROXIES) {
    try {
      const articles = await fetchWithProxy(source, proxy, limit);
      if (articles.length > 0) {
        return articles;
      }
    } catch {
      continue;
    }
  }

  // 尝试直接请求
  try {
    return await fetchDirect(source, limit);
  } catch {
    console.warn(`Failed: ${source.name}`);
    return [];
  }
}

async function fetchWithProxy(
  source: SourceConfig,
  proxy: string,
  limit: number
): Promise<Article[]> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);

  try {
    const response = await fetch(
      proxy + encodeURIComponent(source.url),
      {
        signal: controller.signal,
        headers: { 'Accept': 'application/rss+xml, application/xml, text/xml, */*' }
      }
    );

    clearTimeout(timeout);

    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const xmlText = await response.text();
    if (!xmlText.includes('<')) throw new Error('Invalid content');

    return parseRSSFeed(xmlText, source).slice(0, limit);
  } catch (error) {
    clearTimeout(timeout);
    throw error;
  }
}

async function fetchDirect(source: SourceConfig, limit: number): Promise<Article[]> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000);

  try {
    const response = await fetch(source.url, { signal: controller.signal, mode: 'cors' });
    clearTimeout(timeout);

    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const xmlText = await response.text();
    return parseRSSFeed(xmlText, source).slice(0, limit);
  } catch (error) {
    clearTimeout(timeout);
    throw error;
  }
}

/** 获取单个源 */
export async function fetchSingleSource(source: SourceConfig, limit: number = 30): Promise<Article[]> {
  return fetchRSSFeed(source, limit);
}

/** 批量获取多个源 */
export async function fetchMultipleSources(
  sources: SourceConfig[],
  totalLimit: number = 50
): Promise<Map<string, Article[]>> {
  const results = new Map<string, Article[]>();
  const perSource = Math.ceil(totalLimit / sources.length);

  for (let i = 0; i < sources.length; i += 2) {
    const batch = sources.slice(i, i + 2);
    const promises = batch.map(async (source) => {
      const articles = await fetchRSSFeed(source, perSource);
      results.set(source.id, articles);
    });
    await Promise.allSettled(promises);
  }

  return results;
}
