import { formatDistanceToNow, format, isToday, isYesterday, startOfDay, subDays } from 'date-fns';
import { zhCN } from 'date-fns/locale';

/** 格式化相对时间 */
export function formatRelativeTime(date: Date): string {
  return formatDistanceToNow(date, { addSuffix: true, locale: zhCN });
}

/** 格式化日期分组标题 */
export function formatDateGroup(date: Date): string {
  const d = new Date(date);
  if (isToday(d)) return '今天';
  if (isYesterday(d)) return '昨天';
  return format(d, 'M月d日 EEEE', { locale: zhCN });
}

/** 获取最近7天的日期范围 */
export function getLast7DaysRange(): { start: Date; end: Date } {
  const end = new Date();
  const start = startOfDay(subDays(end, 6));
  return { start, end };
}

/** 检查日期是否在7天内 */
export function isWithin7Days(date: Date): boolean {
  const { start } = getLast7DaysRange();
  return new Date(date) >= start;
}

/** 按日期分组文章 */
export function groupArticlesByDate<T extends { publishedAt: Date }>(articles: T[]): Map<string, T[]> {
  const groups = new Map<string, T[]>();

  for (const article of articles) {
    const dateKey = format(startOfDay(new Date(article.publishedAt)), 'yyyy-MM-dd');
    const existing = groups.get(dateKey) || [];
    existing.push(article);
    groups.set(dateKey, existing);
  }

  return groups;
}
