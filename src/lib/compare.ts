const KEY = "bmw:compare";
export const COMPARE_MAX = 3;

type Listener = (ids: string[]) => void;
const listeners = new Set<Listener>();

function read(): string[] {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

function write(ids: string[]) {
  try {
    localStorage.setItem(KEY, JSON.stringify(ids));
  } catch {
    /* ignore */
  }
  listeners.forEach((l) => l(ids));
}

export function getCompare(): string[] {
  return read();
}

export function toggleCompare(id: string): { ids: string[]; added: boolean; full: boolean } {
  const ids = read();
  if (ids.includes(id)) {
    const next = ids.filter((x) => x !== id);
    write(next);
    return { ids: next, added: false, full: false };
  }
  if (ids.length >= COMPARE_MAX) {
    return { ids, added: false, full: true };
  }
  const next = [...ids, id];
  write(next);
  return { ids: next, added: true, full: false };
}

export function removeFromCompare(id: string) {
  write(read().filter((x) => x !== id));
}

export function clearCompare() {
  write([]);
}

export function subscribeCompare(l: Listener): () => void {
  listeners.add(l);
  // also react to other tabs
  const onStorage = (e: StorageEvent) => {
    if (e.key === KEY) l(read());
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(l);
    window.removeEventListener("storage", onStorage);
  };
}
