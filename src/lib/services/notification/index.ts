import { Capacitor } from '@capacitor/core';

/** 通知权限状态 */
export type NotificationPermission = 'default' | 'granted' | 'denied';

/** 通知配置 */
export interface NotificationConfig {
  enabled: boolean;
  frequency: 'realtime' | 'hourly' | 'daily';
  quietHoursStart?: string; // HH:mm
  quietHoursEnd?: string;   // HH:mm
}

/** 检查通知权限 */
export async function checkNotificationPermission(): Promise<NotificationPermission> {
  if (!Capacitor.isNativePlatform()) {
    return Notification.permission as NotificationPermission;
  }

  // 在原生平台上，使用 Capacitor 通知插件
  // 目前简化处理，返回 granted
  return 'granted';
}

/** 请求通知权限 */
export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (!Capacitor.isNativePlatform()) {
    const permission = await Notification.requestPermission();
    return permission as NotificationPermission;
  }

  return 'granted';
}

/** 发送本地通知 */
export async function sendNotification(title: string, body: string, url?: string): Promise<void> {
  const permission = await checkNotificationPermission();
  if (permission !== 'granted') return;

  if (!Capacitor.isNativePlatform()) {
    // Web 平台使用 Notification API
    new Notification(title, {
      body,
      icon: '/icons/icon-192.png',
      tag: url
    });
    return;
  }

  // 原生平台使用 Capacitor 通知
  // 目前简化处理
  console.log('[Notification]', title, body);
}

/** 检查是否在安静时间 */
export function isQuietHours(start?: string, end?: string): boolean {
  if (!start || !end) return false;

  const now = new Date();
  const [startH, startM] = start.split(':').map(Number);
  const [endH, endM] = end.split(':').map(Number);

  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const startMinutes = startH * 60 + startM;
  const endMinutes = endH * 60 + endM;

  if (startMinutes <= endMinutes) {
    return currentMinutes >= startMinutes && currentMinutes <= endMinutes;
  } else {
    // 跨午夜
    return currentMinutes >= startMinutes || currentMinutes <= endMinutes;
  }
}
