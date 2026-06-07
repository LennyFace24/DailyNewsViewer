import { writable, derived } from 'svelte/store';

/** 阅读进度 */
export interface ReadingProgress {
  articleId: string;
  scrollPosition: number;
  percentage: number;
  lastReadAt: Date;
}

/** 阅读进度缓存 */
const progressMap = writable<Map<string, ReadingProgress>>(new Map());

/** 加载阅读进度 */
export function loadReadingProgress(): void {
  try {
    const saved = localStorage.getItem('dailytech_reading_progress');
    if (saved) {
      const data = JSON.parse(saved);
      const map = new Map<string, ReadingProgress>();
      for (const [key, value] of Object.entries(data)) {
        map.set(key, { ...value as ReadingProgress, lastReadAt: new Date((value as ReadingProgress).lastReadAt) });
      }
      progressMap.set(map);
    }
  } catch {}
}

/** 保存阅读进度 */
export function saveReadingProgress(articleId: string, scrollPosition: number, percentage: number): void {
  progressMap.update(map => {
    map.set(articleId, {
      articleId,
      scrollPosition,
      percentage,
      lastReadAt: new Date()
    });

    // 只保留最近100条
    if (map.size > 100) {
      const entries = Array.from(map.entries())
        .sort((a, b) => b[1].lastReadAt.getTime() - a[1].lastReadAt.getTime())
        .slice(0, 100);
      map = new Map(entries);
    }

    // 保存到localStorage
    const obj: Record<string, ReadingProgress> = {};
    map.forEach((value, key) => {
      obj[key] = value;
    });
    localStorage.setItem('dailytech_reading_progress', JSON.stringify(obj));

    return map;
  });
}

/** 获取文章阅读进度 */
export function getReadingProgress(articleId: string): ReadingProgress | undefined {
  let result: ReadingProgress | undefined;
  progressMap.subscribe(map => {
    result = map.get(articleId);
  })();
  return result;
}

/** 清除阅读进度 */
export function clearReadingProgress(): void {
  progressMap.set(new Map());
  localStorage.removeItem('dailytech_reading_progress');
}

/** 阅读统计 */
export const readingStats = derived(progressMap, ($map) => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

  let todayCount = 0;
  let weekCount = 0;
  let totalCount = $map.size;

  $map.forEach(progress => {
    const readDate = new Date(progress.lastReadAt);
    if (readDate >= today) todayCount++;
    if (readDate >= weekAgo) weekCount++;
  });

  return { todayCount, weekCount, totalCount };
});
