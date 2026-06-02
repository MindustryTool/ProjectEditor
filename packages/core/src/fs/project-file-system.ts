import type { EventBus, ProjectEventMap, ProjectInfo } from "../index.js";
import type { VirtualFileSystem, FileEntry, FileStat, TreeNode } from "@project/fs";
import {
	DefaultProjectFileTree,
	jsonProjectTree,
	createOPFSAdapter,
} from "@project/fs";

export type TreeSnapshotChangeCallback = (snapshot: FileEntry[]) => void;

export interface ProjectFileSystemOptions {
	onTreeSnapshotChange: TreeSnapshotChangeCallback;
}

export class ProjectFileSystem {
	private projectRoot: string;
	private onTreeSnapshotChange: TreeSnapshotChangeCallback;
	private refreshTreeTimer: ReturnType<typeof setTimeout> | null = null;
	readonly defaultProjectTree: DefaultProjectFileTree;

	constructor(
		projectInfo: ProjectInfo,
		private vfs: VirtualFileSystem,
		private events: EventBus<ProjectEventMap>,
		options: ProjectFileSystemOptions,
		defaultProjectTree: DefaultProjectFileTree,
	) {
		this.projectRoot = `/projects/${projectInfo.id}/`;
		this.onTreeSnapshotChange = options.onTreeSnapshotChange;
		this.defaultProjectTree = defaultProjectTree;
	}

	private scopePath(path: string): string {
		const normalized = path.startsWith("/") ? path : `/${path}`;
		if (normalized.startsWith(this.projectRoot)) {
			return normalized;
		}
		return `${this.projectRoot}${normalized.replace(/^\//, "")}`;
	}

	private unscopePath(path: string): string {
		return path.replace(this.projectRoot, "");
	}

	async readFile(path: string): Promise<ArrayBuffer | null> {
		return this.vfs.readFile(this.scopePath(path));
	}

	async writeFile(path: string, data: BufferSource): Promise<void> {
		await this.vfs.writeFile(this.scopePath(path), data);
		this.events.emit("file:write", { path });
		await this.refreshTree();
	}

	async writeFiles(entries: { name: string; data: Uint8Array }[]): Promise<void> {
		const BATCH_SIZE = 1000;

		const dirs = new Set(entries.map((e) => e.name.split("/").slice(0, -1).join("/")).filter(Boolean));
		await Promise.all([...dirs].map((d) => this.vfs.mkdir(this.scopePath(d))));

		for (let i = 0; i < entries.length; i += BATCH_SIZE) {
			const batch = entries.slice(i, i + BATCH_SIZE);
			const results = await Promise.allSettled(
				batch.map((entry) =>
					this.vfs
						.writeFile(this.scopePath(entry.name), new Uint8Array(entry.data))
						.then(() => this.events.emit("file:write", { path: entry.name })),
				),
			);

			const rejected = results.filter((r) => r.status === "rejected") as PromiseRejectedResult[];
			if (rejected.length > 0) {
				throw new AggregateError(
					rejected.map((r) => r.reason),
					`${rejected.length}/${batch.length} file writes failed in batch ${Math.floor(i / BATCH_SIZE) + 1}`,
				);
			}
		}

		await this.refreshTree(true);
	}

	async delete(path: string): Promise<void> {
		await this.vfs.delete(this.scopePath(path));
		this.events.emit("file:delete", { path });
		await this.refreshTree();
	}

	async mkdir(path: string): Promise<void> {
		await this.vfs.mkdir(this.scopePath(path));
		await this.refreshTree();
		this.events.emit("file:mkdir", { path });
	}

	async readdir(path: string): Promise<FileEntry[]> {
		return (await this.vfs.readdir(this.scopePath(path))).map((f) => ({ ...f, path: this.unscopePath(f.path) }));
	}

	async refreshTree(force?: boolean): Promise<FileEntry[]> {
		if (this.refreshTreeTimer !== null) {
			clearTimeout(this.refreshTreeTimer);
			this.refreshTreeTimer = null;
		}

		if (force) {
			return this.refreshTreeNow();
		}

		return new Promise((resolve) => {
			this.refreshTreeTimer = setTimeout(async () => {
				this.refreshTreeTimer = null;
				resolve(await this.refreshTreeNow());
			}, 50);
		});
	}

	private async refreshTreeNow(): Promise<FileEntry[]> {
		const snapshot = await this.listFiles("/", { recursive: true });
		this.onTreeSnapshotChange(snapshot);
		return snapshot;
	}

	async listFiles(dir: string, options?: { recursive?: boolean }): Promise<FileEntry[]> {
		const recursive = options?.recursive ?? false;
		const scopedDir = this.scopePath(dir);

		if (!recursive) {
			return this.readdir(scopedDir);
		}

		const results: FileEntry[] = [];

		const walk = async (currentScopedDir: string): Promise<void> => {
			const entries = await this.vfs.readdir(currentScopedDir);
			for (const entry of entries) {
				results.push({ ...entry, path: this.unscopePath(entry.path) });
				if (entry.kind === "directory") {
					await walk(entry.path);
				}
			}
		};

		await walk(scopedDir);
		return results;
	}

	async stat(path: string): Promise<FileStat> {
		return this.vfs.stat(this.scopePath(path));
	}

	async exists(path: string): Promise<boolean> {
		return this.vfs.exists(this.scopePath(path));
	}

	async rename(oldPath: string, newPath: string): Promise<void> {
		await this.vfs.rename(this.scopePath(oldPath), this.scopePath(newPath));
		this.events.emit("file:rename", { oldPath, newPath });
		await this.refreshTree();
	}

	async move(src: string, dst: string): Promise<void> {
		await this.vfs.move(this.scopePath(src), this.scopePath(dst));
		this.events.emit("file:rename", { oldPath: src, newPath: dst });
		await this.refreshTree();
	}

	async copy(src: string, dst: string): Promise<void> {
		await this.vfs.copy(this.scopePath(src), this.scopePath(dst));
		this.events.emit("file:create", { path: dst });
		await this.refreshTree();
	}

	watch(callback: (path: string) => void): () => void {
		return this.vfs.watch((path) => {
			const relative = path.replace(this.projectRoot, "");
			callback(relative);
		});
	}

	async readTextFile(path: string): Promise<string | null> {
		const bytes = await this.readFile(path);
		if (bytes === null) return null;
		return new TextDecoder().decode(bytes);
	}

	async writeTextFile(path: string, content: string): Promise<void> {
		const bytes = new TextEncoder().encode(content);
		await this.writeFile(path, bytes);
	}

	async createFile(path: string): Promise<void> {
		await this.vfs.writeFile(this.scopePath(path), new ArrayBuffer(0));
		this.events.emit("file:create", { path });
		await this.refreshTree();
	}

	async readJsonFile<T>(path: string): Promise<T | null> {
		const text = await this.readTextFile(path);
		if (text === null) return null;
		return JSON.parse(text) as T;
	}

	async writeJsonFile(path: string, data: unknown): Promise<void> {
		await this.writeTextFile(path, JSON.stringify(data, null, 2));
	}

	async copyFile(source: string, destination: string): Promise<void> {
		return this.copy(source, destination);
	}
}

export async function createProjectFileSystem(
	projectInfo: ProjectInfo,
	events: EventBus<ProjectEventMap>,
	options: ProjectFileSystemOptions,
): Promise<ProjectFileSystem> {
	const vfs = await createOPFSAdapter();
	const fs = new ProjectFileSystem(
		projectInfo,
		vfs,
		events,
		{
			onTreeSnapshotChange: options.onTreeSnapshotChange,
		},
		jsonProjectTree,
	);

	const rootExists = await fs.exists("/");
	if (!rootExists) {
		await fs.mkdir("/");
	}

	for (const node of jsonProjectTree.projectTree) {
		await ensureNode(fs, node);
	}

	await fs.refreshTree();
	return fs;
}

async function ensureNode(fs: ProjectFileSystem, node: TreeNode, parentPath?: string): Promise<void> {
	const currentPath = parentPath ? `${parentPath}/${node.name}` : node.name;

	if (node.type === "folder") {
		const exists = await fs.exists(currentPath);

		if (!exists) {
			await fs.mkdir(currentPath);
		}

		for (const child of node.children ?? []) {
			await ensureNode(fs, child, currentPath);
		}
	} else {
		const exists = await fs.exists(currentPath);

		if (!exists) {
			await fs.createFile(currentPath);
		}
	}
}

export async function deleteProjectFiles(projectId: string): Promise<void> {
	const root = await navigator.storage.getDirectory();
	try {
		const projectsDir = await root.getDirectoryHandle("projects");
		await projectsDir.removeEntry(projectId, { recursive: true });
	} catch (err) {
		if (err instanceof DOMException && err.name === "NotFoundError") return;
		throw err;
	}
}
