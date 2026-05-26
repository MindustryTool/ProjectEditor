import type { ProjectRecord, StorageBackend } from "../types";

interface SerializedProjectRecord {
  id: string;
  name: string;
  language?: string;
  data: string;
  createdAt: string;
  updatedAt: string;
}

export class LocalStorageAdapter implements StorageBackend {
  constructor(private prefix: string = "pe:") {}

  private projectKey(id: string): string {
    return `${this.prefix}project:${id}`;
  }

  private settingKey(key: string): string {
    return `${this.prefix}setting:${key}`;
  }

  private projectKeyPrefix(): string {
    return `${this.prefix}project:`;
  }

  private serializeProject(project: ProjectRecord): string {
    const serialized: SerializedProjectRecord = {
      ...project,
      createdAt: project.createdAt.toISOString(),
      updatedAt: project.updatedAt.toISOString(),
    };
    return JSON.stringify(serialized);
  }

  private deserializeProject(raw: string): ProjectRecord {
    const parsed: SerializedProjectRecord = JSON.parse(raw);
    return {
      ...parsed,
      createdAt: new Date(parsed.createdAt),
      updatedAt: new Date(parsed.updatedAt),
    };
  }

  async saveProject(project: ProjectRecord): Promise<void> {
    localStorage.setItem(this.projectKey(project.id), this.serializeProject(project));
  }

  async getProject(id: string): Promise<ProjectRecord | undefined> {
    const raw = localStorage.getItem(this.projectKey(id));
    if (raw === null) return undefined;
    return this.deserializeProject(raw);
  }

  async getAllProjects(): Promise<ProjectRecord[]> {
    const projects: ProjectRecord[] = [];
    const prefix = this.projectKeyPrefix();
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key !== null && key.startsWith(prefix)) {
        const raw = localStorage.getItem(key);
        if (raw !== null) {
          projects.push(this.deserializeProject(raw));
        }
      }
    }
    return projects;
  }

  async deleteProject(id: string): Promise<void> {
    localStorage.removeItem(this.projectKey(id));
  }

  async saveSetting(key: string, value: unknown): Promise<void> {
    localStorage.setItem(this.settingKey(key), JSON.stringify({ key, value }));
  }

  async getSetting<T>(key: string): Promise<T | undefined> {
    const raw = localStorage.getItem(this.settingKey(key));
    if (raw === null) return undefined;
    const parsed = JSON.parse(raw);
    return parsed?.value as T | undefined;
  }

  async getOPFSRoot(): Promise<FileSystemDirectoryHandle> {
    return navigator.storage.getDirectory();
  }
}
