import { create } from "zustand";
import type { ProjectFileSystem } from "@project/fs";
import type { EventBus, ProjectEventMap } from "@project/core";

const MAX_CACHE_ENTRIES = 100;

function cacheKey(projectId: string, path: string): string {
  return `${projectId}::${path}`;
}

export interface FileContentEntry {
  data: ArrayBuffer | null | undefined;
  currentVersion: number;
  savedVersion: number;
  savedAt: number | null;
  error: string | null;
  loading: boolean;
}

export function isDirty(entry: FileContentEntry | undefined): boolean {
  if (!entry) return false;
  return entry.currentVersion !== entry.savedVersion;
}

export function isError(entry: FileContentEntry | undefined): boolean {
  if (!entry) return false;
  return entry.error !== null && entry.currentVersion === entry.savedVersion;
}

export function selectEntry(projectId: string, path: string) {
  const key = cacheKey(projectId, path);
  return (state: FileContentStore) => state.fileContents[key];
}

export function selectIsSaving(projectId: string, path: string) {
  const key = cacheKey(projectId, path);
  return (state: FileContentStore) => state.savingPaths.includes(key);
}

export function getEntry(projectId: string, path: string) {
  const key = cacheKey(projectId, path);
  return useFileContentStore.getState().fileContents[key];
}

const abortMap = new Map<string, AbortController>();
const eventUnsubs = new Map<string, () => void>();

export interface FileContentStore {
  fileContents: Record<string, FileContentEntry>;
  savingPaths: string[];
  writeBuffer: (projectId: string, path: string, content: ArrayBuffer | string) => void;
  markPersisted: (projectId: string, path: string) => void;
  setBufferError: (projectId: string, path: string, error: string) => void;
  markSaving: (projectId: string, path: string) => void;
  clearSaving: (projectId: string, path: string) => void;
  clearFileContent: (projectId: string, path: string) => void;
  clearAllFileContents: (projectId?: string) => void;
  readFile: (projectId: string, path: string, fs: ProjectFileSystem) => void;
  subscribeToEvents: (projectId: string, path: string, events: EventBus<ProjectEventMap>, fs: ProjectFileSystem) => () => void;
  cleanup: (projectId: string, path: string) => void;
}

const lruMap = new Map<string, FileContentEntry>();

function enforceLRULimit() {
  while (lruMap.size > MAX_CACHE_ENTRIES) {
    const oldest = lruMap.keys().next();
    if (oldest.done) break;
    lruMap.delete(oldest.value);
  }
}

function touchLRU(key: string) {
  if (lruMap.has(key)) {
    const entry = lruMap.get(key)!;
    lruMap.delete(key);
    lruMap.set(key, entry);
  }
}

function buildFileContents(): Record<string, FileContentEntry> {
  const obj: Record<string, FileContentEntry> = {};
  for (const [key, entry] of lruMap) {
    obj[key] = entry;
  }
  return obj;
}

export const useFileContentStore = create<FileContentStore>()((set, get) => ({
  fileContents: {},
  savingPaths: [],

  writeBuffer: (projectId, path, content) => {
    const key = cacheKey(projectId, path);
    const existing = lruMap.get(key);
    const nextVersion = (existing?.currentVersion ?? 0) + 1;
    const data = typeof content === "string" ? new TextEncoder().encode(content).buffer as ArrayBuffer : content;

    lruMap.set(key, {
      data,
      currentVersion: nextVersion,
      savedVersion: existing?.savedVersion ?? 0,
      savedAt: existing?.savedAt ?? null,
      error: null,
      loading: false,
    });

    touchLRU(key);
    enforceLRULimit();
    set({ fileContents: buildFileContents() });
  },

  markPersisted: (projectId, path) => {
    const key = cacheKey(projectId, path);
    const existing = lruMap.get(key);
    if (!existing) return;

    lruMap.set(key, {
      ...existing,
      savedVersion: existing.currentVersion,
      savedAt: Date.now(),
    });

    set({ fileContents: buildFileContents() });
  },

  setBufferError: (projectId, path, error) => {
    const key = cacheKey(projectId, path);
    const existing = lruMap.get(key);
    if (!existing) return;

    lruMap.set(key, {
      ...existing,
      error,
    });

    set({ fileContents: buildFileContents() });
  },

  markSaving: (projectId, path) => {
    const key = cacheKey(projectId, path);
    set((state) => ({
      savingPaths: state.savingPaths.includes(key) ? state.savingPaths : [...state.savingPaths, key],
    }));
  },

  clearSaving: (projectId, path) => {
    const key = cacheKey(projectId, path);
    set((state) => ({
      savingPaths: state.savingPaths.filter((p) => p !== key),
    }));
  },

  clearFileContent: (projectId, path) => {
    const key = cacheKey(projectId, path);
    lruMap.delete(key);

    const controller = abortMap.get(key);
    if (controller) {
      controller.abort();
      abortMap.delete(key);
    }

    const unsub = eventUnsubs.get(key);
    if (unsub) {
      unsub();
      eventUnsubs.delete(key);
    }

    set({ fileContents: buildFileContents() });
  },

  clearAllFileContents: (projectId) => {
    if (projectId) {
      const prefix = `${projectId}::`;
      for (const key of lruMap.keys()) {
        if (key.startsWith(prefix)) {
          const controller = abortMap.get(key);
          if (controller) {
            controller.abort();
            abortMap.delete(key);
          }
          const unsub = eventUnsubs.get(key);
          if (unsub) {
            unsub();
            eventUnsubs.delete(key);
          }
          lruMap.delete(key);
        }
      }
    } else {
      for (const [, controller] of abortMap) {
        controller.abort();
      }
      for (const [, unsub] of eventUnsubs) {
        unsub();
      }
      abortMap.clear();
      eventUnsubs.clear();
      lruMap.clear();
    }

    set({ fileContents: buildFileContents() });
  },

  readFile: (projectId, path, fs) => {
    const key = cacheKey(projectId, path);
    const prev = abortMap.get(key);
    if (prev) prev.abort();

    const controller = new AbortController();
    abortMap.set(key, controller);

    const existing = lruMap.get(key);
    const versionAtStart = existing?.currentVersion ?? 0;

    lruMap.set(key, {
      data: existing?.data ?? null,
      currentVersion: versionAtStart,
      savedVersion: existing?.savedVersion ?? 0,
      savedAt: existing?.savedAt ?? null,
      error: null,
      loading: true,
    });

    touchLRU(key);
    set({ fileContents: buildFileContents() });

    fs.readFile(path).then(
      (data) => {
        if (controller.signal.aborted) return;
        const current = lruMap.get(key);
        if (!current || current.currentVersion !== versionAtStart) return;

        lruMap.set(key, {
          data,
          currentVersion: versionAtStart,
          savedVersion: versionAtStart,
          savedAt: Date.now(),
          error: null,
          loading: false,
        });

        touchLRU(key);
        set({ fileContents: buildFileContents() });
      },
      (err: unknown) => {
        if (controller.signal.aborted) return;
        const current = lruMap.get(key);
        if (!current || current.currentVersion !== versionAtStart) return;

        if (err instanceof Error && err.name === "NotFoundError") {
          lruMap.set(key, {
            data: new ArrayBuffer(0),
            currentVersion: versionAtStart,
            savedVersion: versionAtStart,
            savedAt: Date.now(),
            error: null,
            loading: false,
          });
        } else {
          lruMap.set(key, {
            ...current,
            loading: false,
            error: err instanceof Error ? err.name + ": " + err.message : String(err),
          });
        }

        touchLRU(key);
        set({ fileContents: buildFileContents() });
      },
    );
  },

  subscribeToEvents: (projectId, path, events, fs) => {
    const key = cacheKey(projectId, path);
    const prev = eventUnsubs.get(key);
    if (prev) prev();

    const unsubWrite = events.on("file:write", (event) => {
      if (event.path !== path) return;
      const current = lruMap.get(key);
      if (current && current.currentVersion !== current.savedVersion) return;
      get().readFile(projectId, path, fs);
    });

    const unsubDelete = events.on("file:delete", (event) => {
      if (event.path !== path) return;
      get().clearFileContent(projectId, path);
      get().cleanup(projectId, path);
    });

    const unsubRename = events.on("file:rename", (event) => {
      if (event.oldPath === path) {
        get().clearFileContent(projectId, path);
        get().cleanup(projectId, path);
        return;
      }
      if (event.newPath === path) {
        const current = lruMap.get(key);
        if (current && current.currentVersion !== current.savedVersion) return;
        get().readFile(projectId, path, fs);
      }
    });

    const unsub = () => { unsubWrite(); unsubDelete(); unsubRename(); };
    eventUnsubs.set(key, unsub);
    return unsub;
  },

  cleanup: (projectId, path) => {
    const key = cacheKey(projectId, path);
    const controller = abortMap.get(key);
    if (controller) {
      controller.abort();
      abortMap.delete(key);
    }

    const unsub = eventUnsubs.get(key);
    if (unsub) {
      unsub();
      eventUnsubs.delete(key);
    }
  },
}));
