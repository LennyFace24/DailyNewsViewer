import { Capacitor } from '@capacitor/core';

/** 离线状态 */
export interface OfflineStatus {
  isOnline: boolean;
  lastOnline: Date | null;
  pendingSync: number;
}

/** 缓存策略 */
export type CacheStrategy = 'cache-first' | 'network-first' | 'cache-only';

/** 离线存储管理 */
export class OfflineStorage {
  private static readonly CACHE_KEY = 'dailytech_offline_cache';
  private static readonly MAX_CACHE_SIZE = 50 * 1024 * 1024; // 50MB

  /** 保存文章到离线缓存 */
  static async saveForOffline(articleId: string, content: string): Promise<void> {
    try {
      const cache = this.loadCache();
      cache.set(articleId, {
        content,
        savedAt: new Date().toISOString(),
        size: new Blob([content]).size
      });

      // 检查缓存大小
      this.cleanupCache(cache);

      localStorage.setItem(this.CACHE_KEY, JSON.stringify(Object.fromEntries(cache)));
    } catch (error) {
      console.error('Failed to save offline:', error);
    }
  }

  /** 获取离线内容 */
  static getOfflineContent(articleId: string): string | null {
    try {
      const cache = this.loadCache();
      const item = cache.get(articleId);
      return item?.content || null;
    } catch {
      return null;
    }
  }

  /** 加载缓存 */
  private static loadCache(): Map<string, { content: string; savedAt: string; size: number }> {
    try {
      const data = localStorage.getItem(this.CACHE_KEY);
      if (data) {
        return new Map(Object.entries(JSON.parse(data)));
      }
    } catch {}
    return new Map();
  }

  /** 清理旧缓存 */
  private static cleanupCache(cache: Map<string, { content: string; savedAt: string; size: number }>): void {
    let totalSize = 0;
    const entries = Array.from(cache.entries())
      .sort((a, b) => new Date(b[1].savedAt).getTime() - new Date(a[1].savedAt).getTime());

    // 计算总大小
    entries.forEach(([_, item]) => totalSize += item.size);

    // 如果超过限制，删除旧的
    while (totalSize > this.MAX_CACHE_SIZE && entries.length > 0) {
      const [key, item] = entries.pop()!;
      cache.delete(key);
      totalSize -= item.size;
    }
  }

  /** 获取缓存统计 */
  static getCacheStats(): { count: number; size: number } {
    const cache = this.loadCache();
    let size = 0;
    cache.forEach(item => size += item.size);
    return { count: cache.size, size };
  }

  /** 清除所有缓存 */
  static clearCache(): void {
    localStorage.removeItem(this.CACHE_KEY);
  }
}

/** 网络状态监控 */
export class NetworkMonitor {
  private static listeners: ((isOnline: boolean) => void)[] = [];
  private static isInitialized = false;

  /** 初始化监控 */
  static init(): void {
    if (this.isInitialized) return;
    this.isInitialized = true;

    window.addEventListener('online', () => this.notify(true));
    window.addEventListener('offline', () => this.notify(false));
  }

  /** 获取当前状态 */
  static isOnline(): boolean {
    return navigator.onLine;
  }

  /** 添加监听器 */
  static addListener(callback: (isOnline: boolean) => void): () => void {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(l => l !== callback);
    };
  }

  /** 通知监听器 */
  private static notify(isOnline: boolean): void {
    this.listeners.forEach(l => l(isOnline));
  }
}
