import { writable } from 'svelte/store';
import type { ContentTag } from '$lib/types/source';

/** 当前选中的分类标签 */
export const selectedTag = writable<ContentTag | null>(null);
