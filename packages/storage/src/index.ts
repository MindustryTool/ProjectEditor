import { openDB, type IDBPDatabase } from "idb";

const DB_NAME = "ProjectEditorDB";
const DB_VERSION = 1;

interface ProjectRecord {
  id: string;
  name: string;
  data: string;
  createdAt: Date;
  updatedAt: Date;
}

type ProjectStore = IDBPDatabase<{
  projects: {
    key: string;
    value: ProjectRecord;
    indexes: {
      byName: string;
      byUpdated: Date;
    };
  };
  settings: {
    key: string;
    value: { key: string; value: unknown };
  };
}>;

let dbInstance: ProjectStore | null = null;

export async function getDB(): Promise<ProjectStore> {
  if (dbInstance) return dbInstance;
  dbInstance = (await openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      const projectStore = db.createObjectStore("projects", {
        keyPath: "id",
      });
      projectStore.createIndex("byName", "name", { unique: false });
      projectStore.createIndex("byUpdated", "updatedAt", { unique: false });
      db.createObjectStore("settings", { keyPath: "key" });
    },
  })) as unknown as ProjectStore;
  return dbInstance;
}

export async function saveProject(project: ProjectRecord): Promise<void> {
  const db = await getDB();
  await db.put("projects", project);
}

export async function getProject(id: string): Promise<ProjectRecord | undefined> {
  const db = await getDB();
  return db.get("projects", id);
}

export async function getAllProjects(): Promise<ProjectRecord[]> {
  const db = await getDB();
  return db.getAll("projects");
}

export async function deleteProject(id: string): Promise<void> {
  const db = await getDB();
  await db.delete("projects", id);
}

export async function saveSetting(key: string, value: unknown): Promise<void> {
  const db = await getDB();
  await db.put("settings", { key, value });
}

export async function getSetting<T>(key: string): Promise<T | undefined> {
  const db = await getDB();
  const record = await db.get("settings", key);
  return record?.value as T | undefined;
}

// OPFS support
export async function getOPFSRoot(): Promise<FileSystemDirectoryHandle> {
  return navigator.storage.getDirectory();
}
