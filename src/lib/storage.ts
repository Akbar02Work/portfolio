type StorageArea = "local" | "session";

type StorageOptions = {
  area?: StorageArea;
};

const safeJsonParse = (raw: string): unknown | null => {
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

const getStorageInstance = (area: StorageArea): Storage | null => {
  if (typeof window === "undefined") return null;

  return area === "session" ? window.sessionStorage : window.localStorage;
};

const resolveArea = (options?: StorageOptions): StorageArea =>
  options?.area ?? "local";

export const storage = {
  get<T>(key: string, fallback: T, options?: StorageOptions): T {
    const target = getStorageInstance(resolveArea(options));
    if (!target) return fallback;

    try {
      const item = target.getItem(key);
      if (item === null) return fallback;
      const parsed = safeJsonParse(item);
      if (parsed === null || parsed === undefined) return fallback;
      return parsed as T;
    } catch {
      return fallback;
    }
  },

  set(key: string, value: unknown, options?: StorageOptions): boolean {
    const target = getStorageInstance(resolveArea(options));
    if (!target) return false;

    try {
      target.setItem(key, JSON.stringify(value));
      return true;
    } catch {
      return false;
    }
  },

  getString(key: string, fallback = "", options?: StorageOptions): string {
    const target = getStorageInstance(resolveArea(options));
    if (!target) return fallback;

    try {
      const item = target.getItem(key);
      return item ?? fallback;
    } catch {
      return fallback;
    }
  },

  setString(key: string, value: string, options?: StorageOptions): boolean {
    const target = getStorageInstance(resolveArea(options));
    if (!target) return false;

    try {
      target.setItem(key, value);
      return true;
    } catch {
      return false;
    }
  },

  remove(key: string, options?: StorageOptions): boolean {
    const target = getStorageInstance(resolveArea(options));
    if (!target) return false;

    try {
      target.removeItem(key);
      return true;
    } catch {
      return false;
    }
  },
};
