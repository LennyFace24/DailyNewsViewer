import { writable } from 'svelte/store';
import type { AppSettings } from '$lib/types/settings';
import { THEME_COLORS, PROXY_PRESETS } from '$lib/types/settings';

export { THEME_COLORS, PROXY_PRESETS };

const SETTINGS_KEY = 'dailytech_settings';

const defaultSettings: AppSettings = {
  theme: 'dark',
  primaryColor: '217 91% 60%',
  backgroundImage: undefined,
  backgroundBlur: true,
  fontSize: 'medium',
  cardStyle: 'comfortable',
  showImages: true,
  markAsReadOnView: true,
  proxyEnabled: false,
  proxyUrl: 'https://api.allorigins.win/raw?url='
};

function loadSettings(): AppSettings {
  try {
    const data = localStorage.getItem(SETTINGS_KEY);
    if (data) {
      return { ...defaultSettings, ...JSON.parse(data) };
    }
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

export function updateSetting<K extends keyof AppSettings>(
  key: K,
  value: AppSettings[K]
): void {
  settings.update(s => ({ ...s, [key]: value }));
}

export function resetSettings(): void {
  settings.set(defaultSettings);
}

function applyTheme(s: AppSettings) {
  const root = document.documentElement;
  root.style.setProperty('--primary', s.primaryColor);
  root.style.setProperty('--ring', s.primaryColor);
}
