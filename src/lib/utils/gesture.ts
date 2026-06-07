/** 手势方向 */
export type GestureDirection = 'left' | 'right' | 'up' | 'down';

/** 手势事件 */
export interface GestureEvent {
  direction: GestureDirection;
  distance: number;
  velocity: number;
}

/** 手势配置 */
export interface GestureConfig {
  threshold?: number;      // 最小滑动距离
  velocityThreshold?: number; // 最小速度
  timeThreshold?: number;  // 最大时间
}

const DEFAULT_CONFIG: GestureConfig = {
  threshold: 50,
  velocityThreshold: 0.3,
  timeThreshold: 300
};

/** 检测手势 */
export function detectGesture(
  startX: number,
  startY: number,
  endX: number,
  endY: number,
  startTime: number,
  endTime: number,
  config: GestureConfig = {}
): GestureEvent | null {
  const { threshold, velocityThreshold, timeThreshold } = { ...DEFAULT_CONFIG, ...config };

  const deltaX = endX - startX;
  const deltaY = endY - startY;
  const deltaTime = endTime - startTime;

  // 时间太长，忽略
  if (deltaTime > timeThreshold!) return null;

  const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
  const velocity = distance / deltaTime;

  // 距离或速度不够
  if (distance < threshold! || velocity < velocityThreshold!) return null;

  // 确定方向
  const absX = Math.abs(deltaX);
  const absY = Math.abs(deltaY);

  let direction: GestureDirection;
  if (absX > absY) {
    direction = deltaX > 0 ? 'right' : 'left';
  } else {
    direction = deltaY > 0 ? 'down' : 'up';
  }

  return { direction, distance, velocity };
}

/** 创建手势监听器 */
export function createGestureHandler(
  element: HTMLElement,
  callbacks: {
    onSwipeLeft?: () => void;
    onSwipeRight?: () => void;
    onSwipeUp?: () => void;
    onSwipeDown?: () => void;
  },
  config: GestureConfig = {}
) {
  let startX = 0;
  let startY = 0;
  let startTime = 0;

  function handleTouchStart(e: TouchEvent) {
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
    startTime = Date.now();
  }

  function handleTouchEnd(e: TouchEvent) {
    const endX = e.changedTouches[0].clientX;
    const endY = e.changedTouches[0].clientY;
    const endTime = Date.now();

    const gesture = detectGesture(startX, startY, endX, endY, startTime, endTime, config);

    if (gesture) {
      switch (gesture.direction) {
        case 'left':
          callbacks.onSwipeLeft?.();
          break;
        case 'right':
          callbacks.onSwipeRight?.();
          break;
        case 'up':
          callbacks.onSwipeUp?.();
          break;
        case 'down':
          callbacks.onSwipeDown?.();
          break;
      }
    }
  }

  element.addEventListener('touchstart', handleTouchStart, { passive: true });
  element.addEventListener('touchend', handleTouchEnd, { passive: true });

  return {
    destroy() {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchend', handleTouchEnd);
    }
  };
}
