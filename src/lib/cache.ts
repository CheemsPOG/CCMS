// cache.ts - Shared cache utilities
// This centralizes clearing of call history cache so we can call it
// from multiple places (e.g., on logout or JWT expiry).

const DB_NAME = "CallCenterDB";
const DB_VERSION = 1;
const STORE_NAME = "callHistory";

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "id" });
      }
    };
  });
}

function promisifyRequest<T = any>(request: IDBRequest<T>): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    request.onsuccess = () => resolve(request.result as T);
    request.onerror = () => reject(request.error);
  });
}

export async function clearCallHistoryCache(): Promise<void> {
  try {
    const db = await openDB();
    const tx = db.transaction([STORE_NAME], "readwrite");
    const store = tx.objectStore(STORE_NAME);
    await Promise.all([
      promisifyRequest(store.delete("callHistoryData")),
      promisifyRequest(store.delete("searchState")),
    ]);
  } catch (error) {
    // Swallow errors; proceed to localStorage cleanup
    // console.warn("Failed to clear IndexedDB cache:", error);
  }
  try {
    localStorage.removeItem("callHistoryData");
    localStorage.removeItem("callHistorySearchState");
  } catch (error) {
    // console.warn("Failed to clear localStorage cache:", error);
  }
}
