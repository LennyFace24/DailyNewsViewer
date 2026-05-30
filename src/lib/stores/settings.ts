import { writable } from 'svelte/store';
import type { AppSettings } from '$lib/types/settings';
import { THEME_COLORS } from '$lib/types/settings';

export { THEME_COLORS };

const SETTINGS_KEY = 'dailytech_settings';

const defaultSettings: AppSettings = {
  theme: 'dark',
  primaryColor: '200 80% 55%',
  backgroundImage: undefined,
  backgroundBlur: true,
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
    applyTheme(value);
  } catch {}
});

export function updateSetting<K extends keyof AppSettings>(key: K, value: AppSettings[K]): void {
  settings.update(s => ({ ...s, [key]: value }));
}

export function resetSettings(): void {
  settings.set(defaultSettings);
}

function applyTheme(s: AppSettings) {
  const root = document.documentElement;
  root.style.setProperty('--accent', s.primaryColor);
}
