import type { EventBus, ProjectEventMap, ProjectInfo } from "@project/core";

async function getOPFSRoot(): Promise<FileSystemDirectoryHandle> {
	return navigator.storage.getDirectory();
}

// Types

export interface FileEntry {
	name: string;
	path: string;
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

	async readFile(path: string): Promise<ArrayBuffer> {
		return this.vfs.readFile(this.scopePath(path));
	}

	async writeFile(path: string, data: BufferSource): Promise<void> {
		await this.vfs.writeFile(this.scopePath(path), data);
		this.events.emit("file:changed", { path, kind: "write" });
		await this.refreshTree();
	}

	async writeFiles(entries: { name: string; data: Uint8Array }[]): Promise<void> {
		const BATCH_SIZE = 50;

		const dirs = new Set(entries.map((e) => e.name.split("/").slice(0, -1).join("/")).filter(Boolean));
		await Promise.all([...dirs].map((d) => this.vfs.mkdir(this.scopePath(d))));

		for (let i = 0; i < entries.length; i += BATCH_SIZE) {
			const batch = entries.slice(i, i + BATCH_SIZE);
			const results = await Promise.allSettled(
				batch.map((entry) => this.vfs.writeFile(this.scopePath(entry.name), new Uint8Array(entry.data))),
			);
			for (const entry of batch) {
				this.events.emit("file:changed", { path: entry.name, kind: "write" });
			}
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
		this.events.emit("file:changed", { path, kind: "delete" });
		await this.refreshTree();
	}

	async mkdir(path: string): Promise<void> {
		await this.vfs.mkdir(this.scopePath(path));
		await this.refreshTree();
		this.events.emit("file:changed", { path, kind: "mkdir" });
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
		this.events.emit("file:changed", { path: newPath, kind: "rename" });
		await this.refreshTree();
	}

	async move(src: string, dst: string): Promise<void> {
		await this.vfs.move(this.scopePath(src), this.scopePath(dst));
		this.events.emit("file:changed", { path: dst, kind: "create" });
		this.events.emit("file:changed", { path: dst, kind: "write" });
		await this.refreshTree();
	}

	async copy(src: string, dst: string): Promise<void> {
		await this.vfs.copy(this.scopePath(src), this.scopePath(dst));
		this.events.emit("file:changed", { path: dst, kind: "create" });
		this.events.emit("file:changed", { path: dst, kind: "write" });
		await this.refreshTree();
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

	async createFile(path: string): Promise<void> {
		await this.writeFile(this.scopePath(path), new ArrayBuffer(0));
		this.events.emit("file:changed", { path, kind: "create" });
		await this.refreshTree();
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
	const root = await getOPFSRoot();
	try {
		const projectsDir = await root.getDirectoryHandle("projects");
		await projectsDir.removeEntry(projectId, { recursive: true });
	} catch (err) {
		if (err instanceof DOMException && err.name === "NotFoundError") return;
		throw err;
	}
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
		dir = create ? await dir.getDirectoryHandle(parts[i]!, { create: true }) : await dir.getDirectoryHandle(parts[i]!);
	}

	const name = parts[parts.length - 1]!;

	return [dir, name];
}

async function getDirHandle(dir: FileSystemDirectoryHandle, name: string): Promise<FileSystemDirectoryHandle> {
	return dir.getDirectoryHandle(name);
}

export class OPFSAdapter implements VirtualFileSystem {
	constructor(private root: FileSystemDirectoryHandle) {}

	async readFile(path: string): Promise<ArrayBuffer> {
		try {
			const [dir, name] = await resolveHandle(this.root, path);
			const fileHandle = await dir.getFileHandle(name);
			const file = await fileHandle.getFile();
			return file.arrayBuffer();
		} catch (err) {
			console.error("Error reading file:" + path, new Error(String(err)));
			throw err;
		}
	}

	async writeFile(path: string, data: BufferSource): Promise<void> {
		try {
			const [dir, name] = await resolveHandle(this.root, path, true);
			const fileHandle = await dir.getFileHandle(name, { create: true });
			const writable = await fileHandle.createWritable();
			await writable.write(data);
			await writable.close();
		} catch (err) {
			console.error("Error writing file:", path, err);
			throw err;
		}
	}

	async delete(path: string): Promise<void> {
		try {
			const [dir, name] = await resolveHandle(this.root, path);
			await dir.removeEntry(name, { recursive: true });
		} catch (err) {
			console.error("Error deleting file:", path, err);
			throw err;
		}
	}

	async mkdir(path: string): Promise<void> {
		try {
			const [dir, name] = await resolveHandle(this.root, path, true);
			await dir.getDirectoryHandle(name, { create: true });
		} catch (err) {
			console.error("Error creating directory:", path, err);
			throw err;
		}
	}

	async readdir(path: string): Promise<FileEntry[]> {
		try {
			const dir: FileSystemDirectoryHandle =
				path.replace(/^\/+/, "") === "" ? this.root : await getDirHandle(...(await resolveHandle(this.root, path)));
			const entries: FileEntry[] = [];
			const base = `/${path.replace(/^\/+/, "").replace(/\/+$/, "")}`;
			const basePrefix = base === "/" ? "" : base;
			for await (const entry of (dir as any).values()) {
				const name = entry.name as string;
				entries.push({
					name,
					path: `${basePrefix}/${name}`,
					kind: entry.kind as "file" | "directory",
				});
			}
			return entries;
		} catch (err) {
			console.error("Error reading directory:", path, err);
			throw err;
		}
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
			try {
				await dir.getDirectoryHandle(name);
				return {
					name,
					kind: "directory",
					size: 0,
					lastModified: new Date(0),
				};
			} catch {
				throw new Error(`Entry not found: ${path}`);
			}
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
		try {
			if (oldPath === newPath) return;
			const data = await this.readFile(oldPath);
			await this.writeFile(newPath, data);
			await this.delete(oldPath);
		} catch (err) {
			console.error("Error renaming file:", oldPath, newPath, err);
			throw err;
		}
	}

	async move(src: string, dst: string): Promise<void> {
		try {
			await this.rename(src, dst);
		} catch (err) {
			console.error("Error moving file:", src, dst, err);
			throw err;
		}
	}

	async copy(src: string, dst: string): Promise<void> {
		try {
			const data = await this.readFile(src);
			await this.writeFile(dst, data);
		} catch (err) {
			console.error("Error copying file:", src, dst, err);
			throw err;
		}
	}

	watch(_callback: FileWatchCallback): Unsubscribe {
		return () => {};
	}
}

export interface TreeNode {
	name: string;
	type: "file" | "folder";
	children?: TreeNode[];
}

export class DefaultProjectFileTree {
	projectTree: TreeNode[];

	constructor(projectTree: TreeNode[]) {
		this.projectTree = projectTree;
	}

	walkTree(callback: (node: TreeNode) => void) {
		for (const node of this.projectTree) {
			this.walkTreeI(node, callback);
		}
	}

	private walkTreeI(node: TreeNode, callback: (node: TreeNode) => void) {
		callback(node);
		if (node.children) {
			for (const child of node.children) {
				this.walkTreeI(child, callback);
			}
		}
	}
}

export function isDefaultPath(tree: DefaultProjectFileTree, path: string): boolean {
	function walk(nodes: TreeNode[], parentPath: string): boolean {
		for (const node of nodes) {
			const nodePath = parentPath ? `${parentPath}/${node.name}` : node.name;
			if (nodePath === path) return true;
			if (node.children && walk(node.children, nodePath)) return true;
		}
		return false;
	}
	return walk(tree.projectTree, "");
}

export const jsonProjectTree = new DefaultProjectFileTree([
	{ name: "mod.hjson", type: "file" },
	{
		name: "content",
		type: "folder",
		children: [
			{ name: "items", type: "folder" },
			{ name: "blocks", type: "folder" },
			{ name: "liquids", type: "folder" },
			{ name: "units", type: "folder" },
		],
	},
	{ name: "maps", type: "folder" },
	{ name: "bundles", type: "folder" },
	{ name: "sounds", type: "folder" },
	{ name: "schematics", type: "folder" },
	{ name: "scripts", type: "folder" },
	{ name: "sprites-override", type: "folder" },
	{ name: "sprites", type: "folder" },
]);

export async function createOPFSAdapter(): Promise<OPFSAdapter> {
	const root = await getOPFSRoot();
	return new OPFSAdapter(root);
}
