import type { ProjectFileSystem } from "../fs/project-file-system.js";

interface PendingWrite {
  path: string;
  content: ArrayBuffer | string;
  version: number;
  resolve: () => void;
  reject: (err: unknown) => void;
}

export class WriteQueue {
  private pending = new Map<string, PendingWrite>();
  private timer: ReturnType<typeof setTimeout> | null = null;
  private disposed = false;
  private debounceMs: number;
  private fs: ProjectFileSystem;

  constructor(
    fs: ProjectFileSystem,
    options?: {
      debounceMs?: number;
    },
  ) {
    this.fs = fs;
    this.debounceMs = options?.debounceMs ?? 500;
  }

  enqueue(path: string, content: ArrayBuffer | string, version: number): Promise<void> {
    if (this.disposed) return Promise.resolve();

    const existing = this.pending.get(path);
    if (existing) {
      existing.resolve();
    }

    return new Promise<void>((resolve, reject) => {
      this.pending.set(path, { path, content, version, resolve, reject });

      if (this.timer !== null) {
        clearTimeout(this.timer);
      }
      this.timer = setTimeout(() => this.flush(), this.debounceMs);
    });
  }

  async flush(): Promise<void> {
    if (this.timer !== null) {
      clearTimeout(this.timer);
      this.timer = null;
    }

    if (this.pending.size === 0) return;

    const batch = Array.from(this.pending.values());
    this.pending.clear();

    await Promise.all(
      batch.map(async (write) => {
        try {
          if (typeof write.content === "string") {
            await this.fs.writeTextFile(write.path, write.content);
          } else {
            await this.fs.writeFile(write.path, write.content);
          }
          write.resolve();
        } catch (err) {
          write.reject(err);
        }
      }),
    );
  }

  dispose(): void {
    if (this.disposed) return;
    this.disposed = true;
    this.flush().catch(() => {});
  }

  get isDisposed(): boolean {
    return this.disposed;
  }
}

const queueMap = new Map<string, WriteQueue>();

export function getWriteQueue(projectId: string, fs: ProjectFileSystem): WriteQueue {
  let queue = queueMap.get(projectId);
  if (!queue || queue.isDisposed) {
    queue = new WriteQueue(fs);
    queueMap.set(projectId, queue);
  }
  return queue;
}

export function disposeWriteQueue(projectId: string): void {
  const queue = queueMap.get(projectId);
  if (queue) {
    queue.dispose();
    queueMap.delete(projectId);
  }
}
