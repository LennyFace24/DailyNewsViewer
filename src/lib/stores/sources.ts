import { writable, derived } from 'svelte/store';
import type { SourceConfig } from '$lib/types/source';
import { ContentTag } from '$lib/types/source';
import { PRESET_SOURCES } from '$lib/config/sources';

const CUSTOM_KEY = 'dailytech_custom_sources';
const ENABLED_KEY = 'dailytech_enabled_sources';

function loadCustomSources(): SourceConfig[] {
  try {
    return JSON.parse(localStorage.getItem(CUSTOM_KEY) || '[]');
  } catch {
    return [];
  }
}

function loadEnabledIds(): string[] {
  try {
    const data = localStorage.getItem(ENABLED_KEY);
    if (data) return JSON.parse(data);
  } catch {}
  return PRESET_SOURCES.map(s => s.id);
}

// 使用数组而不是 Set，确保 Svelte 响应式更新
export const allSources = writable<SourceConfig[]>([
  ...PRESET_SOURCES,
  ...loadCustomSources()
]);

export const enabledSourceIds = writable<string[]>(loadEnabledIds());

export const enabledSources = derived(
  [allSources, enabledSourceIds],
  ([$sources, $ids]) => $sources.filter(s => $ids.includes(s.id))
);

function save(sources: SourceConfig[], ids: string[]) {
  localStorage.setItem(CUSTOM_KEY, JSON.stringify(sources.filter(s => !s.category || s.category === ContentTag.GENERAL)));
  localStorage.setItem(ENABLED_KEY, JSON.stringify(ids));
}

export function addCustomSource(name: string, url: string, description: string = ''): void {
  const id = 'custom_' + Date.now();
  const newSource: SourceConfig = {
    id,
    name,
    description: description || `自定义: ${name}`,
    type: 'rss' as any,
    url,
    category: ContentTag.GENERAL
  };

  allSources.update(sources => {
    const updated = [...sources, newSource];
    enabledSourceIds.update(ids => {
      const newIds = [...ids, id];
      save(updated, newIds);
      return newIds;
    });
    return updated;
  });
}

export function removeCustomSource(sourceId: string): void {
  allSources.update(sources => {
    const updated = sources.filter(s => s.id !== sourceId);
    enabledSourceIds.update(ids => {
      const newIds = ids.filter(id => id !== sourceId);
      save(updated, newIds);
      return newIds;
    });
    return updated;
  });
}

export function toggleSource(sourceId: string): void {
  enabledSourceIds.update(ids => {
    let newIds: string[];
    if (ids.includes(sourceId)) {
      newIds = ids.filter(id => id !== sourceId);
    } else {
      newIds = [...ids, sourceId];
    }
    allSources.subscribe(s => save(s, newIds))();
    return newIds;
  });
}
