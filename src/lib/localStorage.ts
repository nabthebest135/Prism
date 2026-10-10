import type { StateStorage } from 'zustand/middleware'
let database: Promise<IDBDatabase> | undefined
function openDB() {
  return (database ??= new Promise<IDBDatabase>((resolve, reject) => {
    const request = indexedDB.open('prism-local', 1)
    request.onupgradeneeded = () => request.result.createObjectStore('state')
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  }))
}
async function transact<T>(
  mode: IDBTransactionMode,
  operation: (store: IDBObjectStore) => IDBRequest<T>
): Promise<T> {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction('state', mode)
    const request = operation(tx.objectStore('state'))
    tx.oncomplete = () => resolve(request.result)
    tx.onerror = () => reject(tx.error)
    tx.onabort = () => reject(tx.error)
  })
}
export const localStorageDB: StateStorage = {
  getItem: async (name) => (await transact('readonly', (store) => store.get(name))) ?? null,
  setItem: async (name, value) => {
    await transact('readwrite', (store) => store.put(value, name))
  },
  removeItem: async (name) => {
    await transact('readwrite', (store) => store.delete(name))
  },
}
