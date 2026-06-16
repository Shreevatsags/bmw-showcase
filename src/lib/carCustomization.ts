export type Finish = "gloss" | "matte";
export type Flake = "metal" | "pearl";

export interface CarCustomization {
  color: string;
  finish: Finish;
  flake: Flake;
}

const STORAGE_KEY = "bmw:customizations:v1";

type Store = Record<string, CarCustomization>;

const readStore = (): Store => {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Store) : {};
  } catch {
    return {};
  }
};

const writeStore = (s: Store) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
    window.dispatchEvent(new CustomEvent("bmw:customization-updated"));
  } catch {
    /* ignore */
  }
};

export const getCustomization = (carId: string): CarCustomization | undefined => {
  return readStore()[carId];
};

export const saveCustomization = (carId: string, c: CarCustomization) => {
  const s = readStore();
  s[carId] = c;
  writeStore(s);
};

const isValidFinish = (v: string | null): v is Finish => v === "gloss" || v === "matte";
const isValidFlake = (v: string | null): v is Flake => v === "metal" || v === "pearl";
const isValidHex = (v: string | null): v is string => !!v && /^#([0-9a-fA-F]{6})$/.test(v);

export const customizationFromSearch = (
  search: string
): Partial<CarCustomization> => {
  const params = new URLSearchParams(search);
  const out: Partial<CarCustomization> = {};
  const color = params.get("color");
  const normalized = color && !color.startsWith("#") ? `#${color}` : color;
  if (isValidHex(normalized)) out.color = normalized!.toLowerCase();
  const finish = params.get("finish");
  if (isValidFinish(finish)) out.finish = finish;
  const flake = params.get("flake");
  if (isValidFlake(flake)) out.flake = flake;
  return out;
};

export const customizationToQuery = (c: CarCustomization): string => {
  const p = new URLSearchParams();
  p.set("color", c.color.replace("#", ""));
  p.set("finish", c.finish);
  p.set("flake", c.flake);
  return p.toString();
};
