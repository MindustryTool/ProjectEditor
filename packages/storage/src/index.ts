export type { StorageBackend } from "./types";
export type { ProjectRecord } from "./types";

export { LocalStorageAdapter } from "./adapters/local-storage";

import { LocalStorageAdapter } from "./adapters/local-storage";
import type { ProjectRecord, StorageBackend } from "./types";

const storage: StorageBackend = new LocalStorageAdapter();

export { storage };

export function saveProject(project: ProjectRecord): Promise<void> {
	return storage.saveProject(project);
}

export function getProject(id: string): Promise<ProjectRecord | undefined> {
	return storage.getProject(id);
}

export function getAllProjects(): Promise<ProjectRecord[]> {
	return storage.getAllProjects();
}

export function deleteProject(id: string): Promise<void> {
	return storage.deleteProject(id);
}

export function saveSetting(key: string, value: unknown): Promise<void> {
	return storage.saveSetting(key, value);
}

export function getSetting<T>(key: string): Promise<T | undefined> {
	return storage.getSetting<T>(key);
}

export function getOPFSRoot(): Promise<FileSystemDirectoryHandle> {
	return storage.getOPFSRoot();
}
