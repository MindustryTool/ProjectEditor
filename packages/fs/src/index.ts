import type { ProjectInfo } from "@project/core"
import { getOPFSRoot } from "@project/storage"

// Types

export interface FileEntry {
  name: string;
  kind: "file" | "directory";
}

export interface FileStat {
  name: string;
  kind: "file" | "directory";
  size: number;
  lastModified: Date;
}

export type FileWatchCallback = (path: string) => void;

export type Unsubscribe = () => void;

// VirtualFileSystem interface

export interface VirtualFileSystem {
  readFile(path: string): Promise<ArrayBuffer>;
  writeFile(path: string, data: BufferSource): Promise<void>;
  delete(path: string): Promise<void>;
  mkdir(path: string): Promise<void>;
  readdir(path: string): Promise<FileEntry[]>;
  stat(path: string): Promise<FileStat>;
  exists(path: string): Promise<boolean>;
  rename(oldPath: string, newPath: string): Promise<void>;
  move(src: string, dst: string): Promise<void>;
  copy(src: string, dst: string): Promise<void>;
  watch(callback: FileWatchCallback): Unsubscribe;
}

// ProjectFileSystem — project-scoped filesystem with convenience methods

export class ProjectFileSystem {
  private projectRoot: string;

  constructor(
    projectInfo: ProjectInfo,
    private vfs: VirtualFileSystem,
  ) {
    this.projectRoot = `/projects/${projectInfo.id}/`;
  }

  private scopePath(path: string): string {
    const normalized = path.startsWith("/") ? path : `/${path}`;
    if (normalized.startsWith(this.projectRoot)) {
      return normalized;
    }
    return `${this.projectRoot}${normalized.replace(/^\//, "")}`;
  }

  async readFile(path: string): Promise<ArrayBuffer> {
    return this.vfs.readFile(this.scopePath(path));
  }

  async writeFile(path: string, data: BufferSource): Promise<void> {
    return this.vfs.writeFile(this.scopePath(path), data);
  }

  async delete(path: string): Promise<void> {
    return this.vfs.delete(this.scopePath(path));
  }

  async mkdir(path: string): Promise<void> {
    return this.vfs.mkdir(this.scopePath(path));
  }

  async readdir(path: string): Promise<FileEntry[]> {
    return this.vfs.readdir(this.scopePath(path));
  }

  async stat(path: string): Promise<FileStat> {
    return this.vfs.stat(this.scopePath(path));
  }

  async exists(path: string): Promise<boolean> {
    return this.vfs.exists(this.scopePath(path));
  }

  async rename(oldPath: string, newPath: string): Promise<void> {
    return this.vfs.rename(this.scopePath(oldPath), this.scopePath(newPath));
  }

  async move(src: string, dst: string): Promise<void> {
    return this.vfs.move(this.scopePath(src), this.scopePath(dst));
  }

  async copy(src: string, dst: string): Promise<void> {
    return this.vfs.copy(this.scopePath(src), this.scopePath(dst));
  }

  watch(callback: FileWatchCallback): Unsubscribe {
    return this.vfs.watch((path) => {
      const relative = path.replace(this.projectRoot, "");
      callback(relative);
    });
  }

  async readTextFile(path: string): Promise<string> {
    const bytes = await this.readFile(path);
    return new TextDecoder().decode(bytes);
  }

  async writeTextFile(path: string, content: string): Promise<void> {
    const bytes = new TextEncoder().encode(content);
    await this.writeFile(path, bytes);
  }

  async readJsonFile<T>(path: string): Promise<T> {
    const text = await this.readTextFile(path);
    return JSON.parse(text) as T;
  }

  async writeJsonFile(path: string, data: unknown): Promise<void> {
    await this.writeTextFile(path, JSON.stringify(data, null, 2));
  }

  async copyFile(source: string, destination: string): Promise<void> {
    return this.copy(source, destination);
  }
}

export async function createProjectFileSystem(projectInfo: ProjectInfo): Promise<ProjectFileSystem> {
  const vfs = await createOPFSAdapter();
  return new ProjectFileSystem(projectInfo, vfs);
}

// OPFSAdapter

async function resolveHandle(
  root: FileSystemDirectoryHandle,
  path: string,
  create: boolean = false,
): Promise<[FileSystemDirectoryHandle, string]> {
  const parts = path.replace(/^\/+/, "").split("/").filter(Boolean);
  if (parts.length === 0) return [root, ""];
  let dir: FileSystemDirectoryHandle = root;
  for (let i = 0; i < parts.length - 1; i++) {
    dir = create
      ? await dir.getDirectoryHandle(parts[i]!, { create: true })
      : await dir.getDirectoryHandle(parts[i]!);
  }
  const name = parts[parts.length - 1]!;
  return [dir, name];
}

async function getDirHandle(
  dir: FileSystemDirectoryHandle,
  name: string,
): Promise<FileSystemDirectoryHandle> {
  return dir.getDirectoryHandle(name);
}

export class OPFSAdapter implements VirtualFileSystem {
  constructor(private root: FileSystemDirectoryHandle) {}

  async readFile(path: string): Promise<ArrayBuffer> {
    const [dir, name] = await resolveHandle(this.root, path);
    const fileHandle = await dir.getFileHandle(name);
    const file = await fileHandle.getFile();
    return file.arrayBuffer();
  }

  async writeFile(path: string, data: BufferSource): Promise<void> {
    const [dir, name] = await resolveHandle(this.root, path, true);
    const fileHandle = await dir.getFileHandle(name, { create: true });
    const writable = await fileHandle.createWritable();
    await writable.write(data);
    await writable.close();
  }

  async delete(path: string): Promise<void> {
    const [dir, name] = await resolveHandle(this.root, path);
    await dir.removeEntry(name, { recursive: true });
  }

  async mkdir(path: string): Promise<void> {
    const [dir, name] = await resolveHandle(this.root, path);
    await dir.getDirectoryHandle(name, { create: true });
  }

  async readdir(path: string): Promise<FileEntry[]> {
    const dir: FileSystemDirectoryHandle = path.replace(/^\/+/, "") === ""
      ? this.root
      : await getDirHandle(...await resolveHandle(this.root, path));
    const entries: FileEntry[] = [];
    for await (const entry of (dir as any).values()) {
      entries.push({ name: entry.name as string, kind: entry.kind as "file" | "directory" });
    }
    return entries;
  }

  async stat(path: string): Promise<FileStat> {
    const [dir, name] = await resolveHandle(this.root, path);
    try {
      const fileHandle = await dir.getFileHandle(name);
      const file = await fileHandle.getFile();
      return {
        name,
        kind: "file",
        size: file.size,
        lastModified: new Date(file.lastModified),
      };
    } catch {
      return {
        name,
        kind: "directory",
        size: 0,
        lastModified: new Date(0),
      };
    }
  }

  async exists(path: string): Promise<boolean> {
    try {
      await this.stat(path);
      return true;
    } catch {
      return false;
    }
  }

  async rename(oldPath: string, newPath: string): Promise<void> {
    const data = await this.readFile(oldPath);
    await this.writeFile(newPath, data);
    await this.delete(oldPath);
  }

  async move(src: string, dst: string): Promise<void> {
    await this.rename(src, dst);
  }

  async copy(src: string, dst: string): Promise<void> {
    const data = await this.readFile(src);
    await this.writeFile(dst, data);
  }

  watch(_callback: FileWatchCallback): Unsubscribe {
    return () => {};
  }
}

export async function createOPFSAdapter(): Promise<OPFSAdapter> {
  const root = await getOPFSRoot();
  return new OPFSAdapter(root);
}
