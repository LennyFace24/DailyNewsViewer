import type { Article } from '$lib/types/news';
import type { SourceConfig } from '$lib/types/source';
import { parseRSSFeed } from './parser';
import { get } from 'svelte/store';
import { settings } from '$lib/stores/settings';

/** 默认 CORS 代理列表（后备） */
const DEFAULT_PROXIES = [
  'https://api.allorigins.win/raw?url=',
  'https://corsproxy.io/?',
  'https://api.codetabs.com/v1/proxy?quest='
];

/**
 * 获取用户配置的代理 URL 前缀
 * HTTP/HTTPS 代理：通过代理服务器转发请求
 * SOCKS5 代理：浏览器不支持直接使用，返回 null
 */
function getUserProxyPrefix(): string | null {
  const $settings = get(settings);
  if (!$settings.proxyEnabled) return null;

  const { proxyHost, proxyPort, proxyType } = $settings;

  if (proxyType === 'socks5') {
    console.warn('SOCKS5 代理在浏览器环境中不可用，请使用 HTTP/HTTPS 代理');
    return null;
  }

  // HTTP/HTTPS 代理：构造代理 URL，请求时附加目标 URL
  return `${proxyType}://${proxyHost}:${proxyPort}/`;
}

/** 获取RSS源内容 */
export async function fetchRSSFeed(
  source: SourceConfig,
  limit: number = 20
): Promise<Article[]> {
  // 1. 优先使用用户配置的代理
  const userProxy = getUserProxyPrefix();
  if (userProxy) {
    try {
      const articles = await fetchWithUserProxy(source, userProxy, limit);
      if (articles.length > 0) {
        return articles;
      }
    } catch {
      console.warn(`用户代理请求失败，回退到 CORS 代理: ${source.name}`);
    }
  }

  // 2. 使用默认 CORS 代理列表
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

  // 3. 尝试直接请求
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

/**
 * 通过用户配置的代理获取 RSS 内容
 * 对于 HTTP/HTTPS 代理，将目标 URL 拼接到代理地址后
 */
async function fetchWithUserProxy(
  source: SourceConfig,
  proxyPrefix: string,
  limit: number
): Promise<Article[]> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);

  try {
    const proxyUrl = proxyPrefix + encodeURIComponent(source.url);
    const response = await fetch(proxyUrl, {
      signal: controller.signal,
      headers: {
        'Accept': 'application/rss+xml, application/xml, text/xml, */*',
        // 设置目标主机头，帮助代理正确转发
        'X-Target-Host': new URL(source.url).host
      }
    });

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
