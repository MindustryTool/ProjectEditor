export interface FileHandle {
  name: string;
  kind: "file" | "directory";
  size?: number;
}

export interface FileSystemAdapter {
  readFile(path: string): Promise<Uint8Array>;
  writeFile(path: string, data: Uint8Array): Promise<void>;
  deleteFile(path: string): Promise<void>;
  listDirectory(path: string): Promise<FileHandle[]>;
  createDirectory(path: string): Promise<void>;
}

export class ProjectFileSystem {
  constructor(private adapter: FileSystemAdapter) {}

  async readTextFile(path: string): Promise<string> {
    const bytes = await this.adapter.readFile(path);
    return new TextDecoder().decode(bytes);
  }

  async writeTextFile(path: string, content: string): Promise<void> {
    const bytes = new TextEncoder().encode(content);
    await this.adapter.writeFile(path, bytes);
  }

  async readJsonFile<T>(path: string): Promise<T> {
    const text = await this.readTextFile(path);
    return JSON.parse(text) as T;
  }

  async writeJsonFile(path: string, data: unknown): Promise<void> {
    await this.writeTextFile(path, JSON.stringify(data, null, 2));
  }

  async copyFile(source: string, destination: string): Promise<void> {
    const data = await this.adapter.readFile(source);
    await this.adapter.writeFile(destination, data);
  }

  async exists(path: string): Promise<boolean> {
    try {
      await this.adapter.readFile(path);
      return true;
    } catch {
      return false;
    }
  }
}
