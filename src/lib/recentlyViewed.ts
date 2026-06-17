const KEY = "bmw:recently-viewed";
const MAX = 6;

export function getRecentlyViewed(): string[] {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

export function pushRecentlyViewed(id: string) {
  try {
    const list = getRecentlyViewed().filter((x) => x !== id);
    list.unshift(id);
    localStorage.setItem(KEY, JSON.stringify(list.slice(0, MAX)));
  } catch {
    /* ignore */
  }
}
