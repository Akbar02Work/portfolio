type StorageArea = "local" | "session";

type StorageOptions = {
  area?: StorageArea;
};

const getStorageInstance = (area: StorageArea): Storage | null => {
  if (typeof window === "undefined") return null;

  return area === "session" ? window.sessionStorage : window.localStorage;
};

const resolveArea = (options?: StorageOptions): StorageArea =>
  options?.area ?? "local";

export const storage = {
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
};
