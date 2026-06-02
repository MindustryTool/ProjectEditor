import type { ProjectFileSystem } from "./project-file-system.js";

interface PendingWrite {
	path: string;
	content: ArrayBuffer | string;
	version: number;
	resolve: () => void;
	reject: (err: unknown) => void;
}

const queues = new Map<string, WriteQueue>();

export function getWriteQueue(projectId: string, fs: ProjectFileSystem): WriteQueue {
	let queue = queues.get(projectId);
	if (!queue) {
		queue = new WriteQueue(fs);
		queues.set(projectId, queue);
	}
	return queue;
}

export function disposeWriteQueue(projectId: string): void {
	const queue = queues.get(projectId);
	if (queue) {
		queue.flush();
		queues.delete(projectId);
	}
}

export class WriteQueue {
	private pending = new Map<string, PendingWrite>();
	private timer: ReturnType<typeof setTimeout> | null = null;
	private flushing = false;

	constructor(private fs: ProjectFileSystem) {}

	write(path: string, content: ArrayBuffer | string): Promise<void> {
		return new Promise((resolve, reject) => {
			const existing = this.pending.get(path);
			const version = (existing?.version ?? 0) + 1;
			this.pending.set(path, { path, content, version, resolve, reject });
			this.scheduleFlush();
		});
	}

	private scheduleFlush(): void {
		if (this.flushing) return;
		if (this.timer) clearTimeout(this.timer);
		this.timer = setTimeout(() => this.flush(), 100);
	}

	async flush(): Promise<void> {
		if (this.flushing) return;
		this.flushing = true;

		if (this.timer) {
			clearTimeout(this.timer);
			this.timer = null;
		}

		const batch = Array.from(this.pending.values());
		this.pending.clear();

		for (const write of batch) {
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
		}

		this.flushing = false;

		if (this.pending.size > 0) {
			this.scheduleFlush();
		}
	}
}
