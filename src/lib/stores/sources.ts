import { writable, derived } from 'svelte/store';
import type { SourceConfig } from '$lib/types/source';
import { ContentCategory } from '$lib/types/source';
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

function loadEnabledIds(): Set<string> {
  try {
    const data = localStorage.getItem(ENABLED_KEY);
    if (data) return new Set(JSON.parse(data));
  } catch {}
  return new Set(PRESET_SOURCES.map(s => s.id));
}

export const allSources = writable<SourceConfig[]>([
  ...PRESET_SOURCES,
  ...loadCustomSources()
]);

export const enabledSourceIds = writable<Set<string>>(loadEnabledIds());

export const enabledSources = derived(
  [allSources, enabledSourceIds],
  ([$sources, $ids]) => $sources.filter(s => $ids.has(s.id))
);

function save(sources: SourceConfig[], ids: Set<string>) {
  localStorage.setItem(CUSTOM_KEY, JSON.stringify(sources.filter(s => s.category === ContentCategory.CUSTOM)));
  localStorage.setItem(ENABLED_KEY, JSON.stringify([...ids]));
}

export function addCustomSource(name: string, url: string, description: string = ''): void {
  const id = 'custom_' + Date.now();
  const newSource: SourceConfig = {
    id,
    name,
    description: description || `自定义: ${name}`,
    type: 'rss' as any,
    url,
    category: ContentCategory.CUSTOM
  };

  allSources.update(sources => {
    const updated = [...sources, newSource];
    enabledSourceIds.update(ids => {
      ids.add(id);
      save(updated, ids);
      return ids;
    });
    return updated;
  });
}

export function removeCustomSource(sourceId: string): void {
  allSources.update(sources => {
    const updated = sources.filter(s => s.id !== sourceId);
    enabledSourceIds.update(ids => {
      ids.delete(sourceId);
      save(updated, ids);
      return ids;
    });
    return updated;
  });
}

export function toggleSource(sourceId: string): void {
  enabledSourceIds.update(ids => {
    if (ids.has(sourceId)) {
      ids.delete(sourceId);
    } else {
      ids.add(sourceId);
    }
    allSources.subscribe(s => save(s, ids))();
    return ids;
  });
}
