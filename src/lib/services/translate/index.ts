import { get } from 'svelte/store';
import { settings } from '$lib/stores/settings';
import { AI_PROVIDERS } from '$lib/types/settings';

/** 翻译缓存 */
const translationCache = new Map<string, string>();

/** 翻译文本 */
export async function translateText(text: string): Promise<string> {
  const s = get(settings);

  if (!s.aiTranslateEnabled || !s.aiApiKey || !s.aiBaseUrl) {
    return text;
  }

  // 检查缓存
  const cacheKey = text.substring(0, 100);
  if (translationCache.has(cacheKey)) {
    return translationCache.get(cacheKey)!;
  }

  try {
    const provider = AI_PROVIDERS[s.aiProvider];
    if (!provider) {
      console.error('Unknown AI provider:', s.aiProvider);
      return text;
    }

    const url = `${s.aiBaseUrl}${provider.endpoint}`;
    const headers = provider.headers(s.aiApiKey);
    const body = provider.body(text, s.aiModel);

    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(15000)
    });

    if (!response.ok) {
      console.error('Translation API error:', response.status);
      return text;
    }

    const data = await response.json();
    const translated = provider.parseResponse(data);

    if (translated) {
      translationCache.set(cacheKey, translated);
      return translated;
    }

    return text;
  } catch (error) {
    console.error('Translation failed:', error);
    return text;
  }
}

/** 翻译文章摘要 */
export async function translateArticle(text: string): Promise<string> {
  if (!text || text.length < 10) return text;

  // 只翻译前500字符
  const toTranslate = text.substring(0, 500);
  const translated = await translateText(toTranslate);

  return translated;
}

/** 清除翻译缓存 */
export function clearTranslationCache(): void {
  translationCache.clear();
}
