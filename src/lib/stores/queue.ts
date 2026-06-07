import { writable, derived } from 'svelte/store';
import type { Article } from '$lib/types/news';

const QUEUE_KEY = 'dailytech_reading_queue';

/** 阅读队列 */
function createQueueStore() {
  const { subscribe, set, update } = writable<Article[]>(loadQueue());

  function loadQueue(): Article[] {
    try {
      const data = localStorage.getItem(QUEUE_KEY);
      if (data) {
        const parsed = JSON.parse(data);
        return parsed.map((item: any) => ({
          ...item,
          publishedAt: new Date(item.publishedAt),
          fetchedAt: new Date(item.fetchedAt)
        }));
      }
    } catch {}
    return [];
  }

  function saveQueue(queue: Article[]) {
    localStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
  }

  return {
    subscribe,
    set,
    update,

    /** 添加到队列 */
    add(article: Article) {
      update(queue => {
        if (queue.some(a => a.id === article.id)) return queue;
        const updated = [article, ...queue];
        saveQueue(updated);
        return updated;
      });
    },

    /** 从队列移除 */
    remove(articleId: string) {
      update(queue => {
        const updated = queue.filter(a => a.id !== articleId);
        saveQueue(updated);
        return updated;
      });
    },

    /** 清空队列 */
    clear() {
      set([]);
      localStorage.removeItem(QUEUE_KEY);
    },

    /** 检查是否在队列中 */
    isInQueue(articleId: string): boolean {
      let result = false;
      update(queue => {
        result = queue.some(a => a.id === articleId);
        return queue;
      });
      return result;
    },

    /** 获取队列长度 */
    get length(): number {
      let len = 0;
      update(queue => {
        len = queue.length;
        return queue;
      });
      return len;
    }
  };
}

export const readingQueue = createQueueStore();

/** 队列长度 */
export const queueCount = derived(readingQueue, ($queue) => $queue.length);
