// Persistent image cache for book page images.
// Uses IndexedDB to store fetched image blobs so revisiting a book
// loads spreads instantly without re-downloading from the network.

const DB_NAME = "book-image-cache";
const STORE = "images";
const DB_VERSION = 1;
// Evict entries older than 30 days to keep the cache from growing forever.
const MAX_AGE_MS = 30 * 24 * 60 * 60 * 1000;

type CacheEntry = { blob: Blob; savedAt: number; contentType: string };

let dbPromise: Promise<IDBDatabase | null> | null = null;

function openDb(): Promise<IDBDatabase | null> {
  if (dbPromise) return dbPromise;
  dbPromise = new Promise((resolve) => {
    try {
      if (typeof indexedDB === "undefined") return resolve(null);
      const req = indexedDB.open(DB_NAME, DB_VERSION);
      req.onupgradeneeded = () => {
        const db = req.result;
        if (!db.objectStoreNames.contains(STORE)) db.createObjectStore(STORE);
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => resolve(null);
    } catch {
      resolve(null);
    }
  });
  return dbPromise;
}

async function idbGet(key: string): Promise<CacheEntry | null> {
  const db = await openDb();
  if (!db) return null;
  return new Promise((resolve) => {
    try {
      const tx = db.transaction(STORE, "readonly");
      const req = tx.objectStore(STORE).get(key);
      req.onsuccess = () => resolve((req.result as CacheEntry) ?? null);
      req.onerror = () => resolve(null);
    } catch {
      resolve(null);
    }
  });
}

async function idbSet(key: string, entry: CacheEntry): Promise<void> {
  const db = await openDb();
  if (!db) return;
  return new Promise((resolve) => {
    try {
      const tx = db.transaction(STORE, "readwrite");
      tx.objectStore(STORE).put(entry, key);
      tx.oncomplete = () => resolve();
      tx.onerror = () => resolve();
      tx.onabort = () => resolve();
    } catch {
      resolve();
    }
  });
}

async function idbDelete(key: string): Promise<void> {
  const db = await openDb();
  if (!db) return;
  return new Promise((resolve) => {
    try {
      const tx = db.transaction(STORE, "readwrite");
      tx.objectStore(STORE).delete(key);
      tx.oncomplete = () => resolve();
      tx.onerror = () => resolve();
    } catch {
      resolve();
    }
  });
}

// Signed-URL query params change every hour; strip them to keep a stable key.
function cacheKeyFor(url: string): string {
  try {
    const u = new URL(url, window.location.href);
    // Preserve the pathname and any explicit version marker (?v=updated_at)
    // but drop signed-URL noise like token, expires, signature.
    const v = u.searchParams.get("v");
    const base = `${u.origin}${u.pathname}`;
    return v ? `${base}?v=${v}` : base;
  } catch {
    return url;
  }
}

// In-memory map of blob URLs for the current session — avoids re-decoding.
const blobUrlCache = new Map<string, string>();
const inflight = new Map<string, Promise<string>>();

/**
 * Resolve an image URL to a cached blob URL. On first call, fetches the
 * network image, stores its bytes in IndexedDB, and returns an object URL.
 * On subsequent calls (same session or later visits), returns instantly
 * from cache with no network request.
 */
export async function getCachedImageUrl(url: string): Promise<string> {
  if (!url) return url;
  const key = cacheKeyFor(url);
  const existing = blobUrlCache.get(key);
  if (existing) return existing;
  const pending = inflight.get(key);
  if (pending) return pending;

  const task = (async () => {
    try {
      const cached = await idbGet(key);
      if (cached && Date.now() - cached.savedAt < MAX_AGE_MS) {
        const blobUrl = URL.createObjectURL(cached.blob);
        blobUrlCache.set(key, blobUrl);
        return blobUrl;
      }
      if (cached) await idbDelete(key); // stale
      const resp = await fetch(url, { credentials: "omit" });
      if (!resp.ok) return url;
      const blob = await resp.blob();
      const contentType = resp.headers.get("Content-Type") || blob.type || "image/jpeg";
      await idbSet(key, { blob, savedAt: Date.now(), contentType });
      const blobUrl = URL.createObjectURL(blob);
      blobUrlCache.set(key, blobUrl);
      return blobUrl;
    } catch {
      return url;
    } finally {
      inflight.delete(key);
    }
  })();

  inflight.set(key, task);
  return task;
}

/** Preload (and cache) a list of image URLs in the background. */
export function prefetchImages(urls: string[]): void {
  for (const url of urls) {
    if (url) void getCachedImageUrl(url);
  }
}

/** Check whether an image URL is already stored in IndexedDB (fresh). */
export async function hasCachedImage(url: string): Promise<boolean> {
  if (!url) return false;
  const key = cacheKeyFor(url);
  if (blobUrlCache.has(key)) return true;
  const entry = await idbGet(key);
  return !!entry && Date.now() - entry.savedAt < MAX_AGE_MS;
}

/**
 * Cache many URLs sequentially with progress reporting. Resolves when every
 * URL has been fetched into IndexedDB (or failed). Useful for a
 * "download for offline" action.
 */
export async function cacheAllImages(
  urls: string[],
  onProgress?: (done: number, total: number) => void,
): Promise<void> {
  const total = urls.length;
  let done = 0;
  onProgress?.(0, total);
  for (const url of urls) {
    if (url) {
      try { await getCachedImageUrl(url); } catch { /* noop */ }
    }
    done += 1;
    onProgress?.(done, total);
  }
}
