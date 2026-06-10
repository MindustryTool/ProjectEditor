// FileSystemDirectoryHandle has async iterable methods (entries, keys, values)
// that aren't in TypeScript's DOM types for TS < 6.0
interface AsyncIterableFileSystemDirectoryHandle extends FileSystemDirectoryHandle {
	entries(): AsyncIterableIterator<[string, FileSystemDirectoryHandle | FileSystemFileHandle]>;
	values(): AsyncIterableIterator<FileSystemDirectoryHandle | FileSystemFileHandle>;
}

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
	readFile(path: string): Promise<ArrayBuffer | null>;
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

// OPFSAdapter

async function resolveHandle(
	root: FileSystemDirectoryHandle,
	path: string,
	create: boolean = false,
	resolveFull: boolean = false,
): Promise<[FileSystemDirectoryHandle, string]> {
	const parts = path.replace(/^\/+/, "").split("/").filter(Boolean);

	if (parts.length === 0) return [root, ""];

	let dir: FileSystemDirectoryHandle = root;

	const end = resolveFull ? parts.length : parts.length - 1;
	for (let i = 0; i < end; i++) {
		dir = create ? await dir.getDirectoryHandle(parts[i]!, { create: true }) : await dir.getDirectoryHandle(parts[i]!);
	}

	if (!resolveFull) {
		const name = parts[parts.length - 1]!;
		return [dir, name];
	}
	return [dir, ""];
}

export class OPFSAdapter implements VirtualFileSystem {
	constructor(private root: FileSystemDirectoryHandle) {}

	async readFile(path: string): Promise<ArrayBuffer | null> {
		try {
			const [dir, name] = await resolveHandle(this.root, path);
			const fileHandle = await dir.getFileHandle(name);
			const file = await fileHandle.getFile();
			return file.arrayBuffer();
		} catch (err) {
			if (err instanceof DOMException && err.name === "NotFoundError") return null;
			const message = err instanceof DOMException && err.name === "NotFoundError" ? "File not found" : "Error reading file";
			console.error(message, path, err);
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
			const message = err instanceof DOMException && err.name === "NotFoundError" ? "File not found" : "Error writing file";
			console.error(message, path, err);
			throw err;
		}
	}

	async delete(path: string): Promise<void> {
		try {
			const [dir, name] = await resolveHandle(this.root, path);
			await dir.removeEntry(name, { recursive: true });
		} catch (err) {
			const message = err instanceof DOMException && err.name === "NotFoundError" ? "File not found" : "Error deleting file";
			console.error(message, path, err);
			throw err;
		}
	}

	async mkdir(path: string): Promise<void> {
		try {
			const [dir, name] = await resolveHandle(this.root, path, true);
			await dir.getDirectoryHandle(name, { create: true });
		} catch (err) {
			const message = err instanceof DOMException && err.name === "NotFoundError" ? "Directory not found" : "Error creating directory";
			console.error(message, path, err);
			throw err;
		}
	}

	async readdir(path: string): Promise<FileEntry[]> {
		try {
			const normalized = path.replace(/^\/+/, "").replace(/\/+$/, "");
			const [dir] = await resolveHandle(this.root, normalized || "/", false, true);
			const entries: FileEntry[] = [];
			const base = normalized ? `/${normalized}` : "/";
			const basePrefix = base === "/" ? "" : base;
			for await (const [name, handle] of (dir as AsyncIterableFileSystemDirectoryHandle).entries()) {
				entries.push({
					name,
					path: `${basePrefix}/${name}`,
					kind: handle.kind as "file" | "directory",
				});
			}
			return entries;
		} catch (err) {
			const message = err instanceof DOMException && err.name === "NotFoundError" ? "Directory not found" : "Error reading directory";
			console.error(message, path, err);
			throw err;
		}
	}

	async stat(path: string): Promise<FileStat> {
		if (!path || path === "/") {
			return {
				name: "",
				kind: "directory",
				size: 0,
				lastModified: new Date(0),
			};
		}
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
		if (!path || path === "/") return true;
		try {
			const [dir, name] = await resolveHandle(this.root, path);
			try {
				await dir.getFileHandle(name);
				return true;
			} catch {
				try {
					await dir.getDirectoryHandle(name);
					return true;
				} catch {
					return false;
				}
			}
		} catch {
			return false;
		}
	}

	async rename(oldPath: string, newPath: string): Promise<void> {
		try {
			if (oldPath === newPath) return;
			const s = await this.stat(oldPath);
			if (s.kind === "file") {
				const data = await this.readFile(oldPath);
				if (data !== null) {
					await this.writeFile(newPath, data);
				}
				await this.delete(oldPath);
			} else {
				const entries = await this.readdir(oldPath);
				await this.mkdir(newPath);
				for (const entry of entries) {
					await this.rename(`${oldPath}/${entry.name}`, `${newPath}/${entry.name}`);
				}
				await this.delete(oldPath);
			}
		} catch (err) {
			const message = err instanceof DOMException && err.name === "NotFoundError" ? "File not found" : "Error renaming";
			console.error(message, oldPath, newPath, err);
			throw err;
		}
	}

	async move(src: string, dst: string): Promise<void> {
		try {
			await this.rename(src, dst);
		} catch (err) {
			const message = err instanceof DOMException && err.name === "NotFoundError" ? "File not found" : "Error moving file";
			console.error(message, src, dst, err);
			throw err;
		}
	}

	async copy(src: string, dst: string): Promise<void> {
		try {
			const data = await this.readFile(src);
			if (data === null) throw new Error(`Source not found: ${src}`);
			await this.writeFile(dst, data);
		} catch (err) {
			const message = err instanceof DOMException && err.name === "NotFoundError" ? "File not found" : "Error copying file";
			console.error(message, src, dst, err);
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
	path: string;
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
	function walk(nodes: TreeNode[]): boolean {
		for (const node of nodes) {
			if (node.path === path) return true;
			if (node.children && walk(node.children)) return true;
		}
		return false;
	}
	return walk(tree.projectTree);
}

export const jsonProjectTree = new DefaultProjectFileTree([
	{
		name: "content",
		type: "folder",
		path: "content",
		children: [
			{ name: "items", type: "folder", path: "content/items" },
			{ name: "blocks", type: "folder", path: "content/blocks" },
			{ name: "liquids", type: "folder", path: "content/liquids" },
			{ name: "units", type: "folder", path: "content/units" },
		],
	},
	{ name: "maps", type: "folder", path: "maps" },
	{ name: "bundles", type: "folder", path: "bundles" },
	{ name: "sounds", type: "folder", path: "sounds" },
	{ name: "schematics", type: "folder", path: "schematics" },
	{ name: "scripts", type: "folder", path: "scripts" },
	{ name: "sprites-override", type: "folder", path: "sprites-override" },
	{ name: "sprites", type: "folder", path: "sprites" },
]);

export async function createOPFSAdapter(): Promise<OPFSAdapter> {
	const root = await getOPFSRoot();
	return new OPFSAdapter(root);
}
