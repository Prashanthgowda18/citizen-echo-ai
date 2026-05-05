const STORAGE_PREFIX = "govsense";

const KEYS = {
  submissions: `${STORAGE_PREFIX}:submissions`,
  briefs: `${STORAGE_PREFIX}:briefs`,
  activities: `${STORAGE_PREFIX}:activities`,
  meta: `${STORAGE_PREFIX}:meta`,
} as const;

type PersistMeta = {
  lastUpdatedAt: string;
};

function isBrowser(): boolean {
  return typeof window !== "undefined" && typeof localStorage !== "undefined";
}

function readJson<T>(key: string, fallback: T): T {
  if (!isBrowser()) return fallback;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeJson<T>(key: string, value: T): void {
  if (!isBrowser()) return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Swallow write errors to keep app functional even when storage is unavailable.
  }
}

export function loadPersistedSubmissions<T>(fallback: T): T {
  return readJson(KEYS.submissions, fallback);
}

export function loadPersistedBriefs<T>(fallback: T): T {
  return readJson(KEYS.briefs, fallback);
}

export function loadPersistedActivities<T>(fallback: T): T {
  return readJson(KEYS.activities, fallback);
}

export function savePersistedSubmissions<T>(value: T): void {
  writeJson(KEYS.submissions, value);
  writeMeta();
}

export function savePersistedBriefs<T>(value: T): void {
  writeJson(KEYS.briefs, value);
  writeMeta();
}

export function savePersistedActivities<T>(value: T): void {
  writeJson(KEYS.activities, value);
  writeMeta();
}

export function getPersistMeta(): PersistMeta | null {
  return readJson<PersistMeta | null>(KEYS.meta, null);
}

function writeMeta(): void {
  const meta: PersistMeta = {
    lastUpdatedAt: new Date().toISOString(),
  };
  writeJson(KEYS.meta, meta);
}
