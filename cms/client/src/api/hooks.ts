import { useState, useEffect, useCallback } from 'react';
import { api } from './client';

export function useData<T>(path: string) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(() => {
    setLoading(true);
    api.get<T>(path)
      .then(setData)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [path]);

  useEffect(() => { reload(); }, [reload]);

  return { data, loading, error, reload, setData };
}

// Toast system
type ToastType = 'success' | 'error';
interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

let toastId = 0;
let toastListeners: ((toasts: Toast[]) => void)[] = [];
let currentToasts: Toast[] = [];

function notifyListeners() {
  toastListeners.forEach((fn) => fn([...currentToasts]));
}

export function showToast(message: string, type: ToastType = 'success') {
  const id = ++toastId;
  currentToasts.push({ id, message, type });
  notifyListeners();
  setTimeout(() => {
    currentToasts = currentToasts.filter((t) => t.id !== id);
    notifyListeners();
  }, 3000);
}

export function useToasts() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    toastListeners.push(setToasts);
    return () => {
      toastListeners = toastListeners.filter((fn) => fn !== setToasts);
    };
  }, []);

  return toasts;
}
