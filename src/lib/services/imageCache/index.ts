/** 图片缓存管理 */
export class ImageCache {
  private static cache = new Map<string, string>();
  private static readonly MAX_CACHE = 100;

  /** 获取缓存的图片URL */
  static get(url: string): string | null {
    return this.cache.get(url) || null;
  }

  /** 缓存图片 */
  static set(url: string, blob: Blob): void {
    if (this.cache.size >= this.MAX_CACHE) {
      // 删除最旧的
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }

    const objectUrl = URL.createObjectURL(blob);
    this.cache.set(url, objectUrl);
  }

  /** 预加载图片 */
  static async preload(url: string): Promise<string> {
    const cached = this.get(url);
    if (cached) return cached;

    try {
      const response = await fetch(url);
      const blob = await response.blob();
      this.set(url, blob);
      return this.get(url)!;
    } catch {
      return url; // 返回原始URL
    }
  }

  /** 清除缓存 */
  static clear(): void {
    this.cache.forEach((url) => URL.revokeObjectURL(url));
    this.cache.clear();
  }

  /** 获取缓存大小 */
  static get size(): number {
    return this.cache.size;
  }
}

/** 图片懒加载指令 */
export function lazyLoad(node: HTMLElement, src: string) {
  let observer: IntersectionObserver;

  const load = async () => {
    if (src) {
      node.setAttribute('src', src);
    }
  };

  observer = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting) {
        load();
        observer.unobserve(node);
      }
    },
    { rootMargin: '200px' }
  );

  observer.observe(node);

  return {
    destroy() {
      observer?.unobserve(node);
    },
    update(newSrc: string) {
      src = newSrc;
    }
  };
}
