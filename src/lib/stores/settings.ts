import { writable } from 'svelte/store';
import type { AppSettings } from '$lib/types/settings';

const SETTINGS_KEY = 'dailytech_settings';

const defaultSettings: AppSettings = {
  theme: 'dark',
  fontSize: 'medium',
  cardStyle: 'comfortable',
  showImages: true,
  markAsReadOnView: true,
  proxyEnabled: false,
  proxyHost: '127.0.0.1',
  proxyPort: '7890',
  proxyType: 'http'
};

function loadSettings(): AppSettings {
  try {
    const data = localStorage.getItem(SETTINGS_KEY);
    if (data) return { ...defaultSettings, ...JSON.parse(data) };
  } catch {}
  return defaultSettings;
}

export const settings = writable<AppSettings>(loadSettings());

settings.subscribe(value => {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(value));
  } catch {}
});

export function updateSetting<K extends keyof AppSettings>(key: K, value: AppSettings[K]): void {
  settings.update(s => ({ ...s, [key]: value }));
}

export function resetSettings(): void {
  settings.set(defaultSettings);
}
