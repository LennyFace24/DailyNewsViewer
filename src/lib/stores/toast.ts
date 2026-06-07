import { writable } from 'svelte/store';

export interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
  duration?: number;
}

function createToastStore() {
  const { subscribe, update } = writable<ToastMessage[]>([]);

  return {
    subscribe,
    success(message: string, duration?: number) {
      const id = Math.random().toString(36).slice(2);
      update(toasts => [...toasts, { id, message, type: 'success', duration }]);
      return id;
    },
    error(message: string, duration?: number) {
      const id = Math.random().toString(36).slice(2);
      update(toasts => [...toasts, { id, message, type: 'error', duration }]);
      return id;
    },
    info(message: string, duration?: number) {
      const id = Math.random().toString(36).slice(2);
      update(toasts => [...toasts, { id, message, type: 'info', duration }]);
      return id;
    },
    dismiss(id: string) {
      update(toasts => toasts.filter(t => t.id !== id));
    },
    clear() {
      update(() => []);
    }
  };
}

export const toast = createToastStore();
