export interface ProjectRecord {
  id: string;
  name: string;
  language?: string;
  data: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface StorageBackend {
  saveProject(project: ProjectRecord): Promise<void>;
  getProject(id: string): Promise<ProjectRecord | undefined>;
  getAllProjects(): Promise<ProjectRecord[]>;
  deleteProject(id: string): Promise<void>;
  saveSetting(key: string, value: unknown): Promise<void>;
  getSetting<T>(key: string): Promise<T | undefined>;
  getOPFSRoot(): Promise<FileSystemDirectoryHandle>;
}
