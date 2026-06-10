import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import type { VirtualFileSystem, FileEntry, FileStat } from "@project/fs";
import { DefaultProjectFileTree, jsonProjectTree } from "@project/fs";
import { ProjectFileSystem, createProjectFileSystem } from "@project/core";
import type { EventBus, ProjectEventMap, ProjectInfo } from "@project/core";

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------

function createProjectInfo(overrides?: Partial<ProjectInfo>): ProjectInfo {
	return {
		id: "550e8400-e29b-41d4-a716-446655440000",
		name: "test-project",
		language: "json",
		createdAt: new Date("2025-01-01"),
		updatedAt: new Date("2025-01-02"),
		...overrides,
	};
}

// ---------------------------------------------------------------------------
// In-memory VirtualFileSystem for testing
// ---------------------------------------------------------------------------

class InMemoryVFS implements VirtualFileSystem {
	private files = new Map<string, ArrayBuffer>();
	private dirs = new Set<string>();

	private parentDirs(path: string): string[] {
		const parts = path.replace(/^\/+/, "").split("/").filter(Boolean);
		const result: string[] = [];
		for (let i = 0; i < parts.length - 1; i++) {
			result.push("/" + parts.slice(0, i + 1).join("/"));
		}
		return result;
	}

	async readFile(path: string): Promise<ArrayBuffer | null> {
		const data = this.files.get(path);
		return data ? data.slice(0) : null;
	}

	async writeFile(path: string, data: BufferSource): Promise<void> {
		for (const p of this.parentDirs(path)) {
			this.dirs.add(p);
		}
		this.files.set(path, (data as ArrayBuffer).slice ? (data as ArrayBuffer).slice(0) : new Uint8Array(data as ArrayBuffer).buffer);
	}

	async delete(path: string): Promise<void> {
		this.files.delete(path);
		const dirPrefix = path.endsWith("/") ? path : path + "/";
		for (const key of this.files.keys()) {
			if (key.startsWith(dirPrefix)) this.files.delete(key);
		}
		this.dirs.delete(path);
	}

	async mkdir(path: string): Promise<void> {
		for (const p of this.parentDirs(path)) {
			this.dirs.add(p);
		}
		this.dirs.add(path);
	}

	async readdir(path: string): Promise<FileEntry[]> {
		const normalized = path.endsWith("/") ? path : path + "/";
		const entries: FileEntry[] = [];
		for (const file of this.files.keys()) {
			if (file.startsWith(normalized) && file.slice(normalized.length).indexOf("/") === -1) {
				entries.push({ name: file.split("/").pop()!, path: file, kind: "file" });
			}
		}
		for (const dir of this.dirs) {
			if (dir.startsWith(normalized) && dir !== normalized.slice(0, -1) && dir.slice(normalized.length).indexOf("/") === -1) {
				entries.push({ name: dir.split("/").pop()!, path: dir, kind: "directory" });
			}
		}
		return entries;
	}

	async stat(path: string): Promise<FileStat> {
		const data = this.files.get(path);
		if (data) {
			return { name: path.split("/").pop()!, kind: "file", size: data.byteLength, lastModified: new Date(0) };
		}
		if (this.dirs.has(path)) {
			return { name: path.split("/").pop()!, kind: "directory", size: 0, lastModified: new Date(0) };
		}
		throw new Error(`Entry not found: ${path}`);
	}

	async exists(path: string): Promise<boolean> {
		return this.files.has(path) || this.dirs.has(path);
	}

	async rename(oldPath: string, newPath: string): Promise<void> {
		const data = this.files.get(oldPath);
		if (data) {
			this.files.set(newPath, data);
			this.files.delete(oldPath);
			return;
		}
		for (const key of [...this.files.keys()]) {
			if (key.startsWith(oldPath + "/")) {
				const rest = key.slice(oldPath.length);
				this.files.set(newPath + rest, this.files.get(key)!);
				this.files.delete(key);
			}
		}
		this.dirs.delete(oldPath);
		this.dirs.add(newPath);
	}

	async move(src: string, dst: string): Promise<void> {
		return this.rename(src, dst);
	}

	async copy(src: string, dst: string): Promise<void> {
		const data = this.files.get(src);
		if (!data) throw new Error(`Source not found: ${src}`);
		this.files.set(dst, data.slice(0));
	}

	watch(_callback: (path: string) => void): () => void {
		return () => {};
	}
}

// ---------------------------------------------------------------------------
// Mock EventBus
// ---------------------------------------------------------------------------

function createMockEventBus(): EventBus<ProjectEventMap> {
	const handlers = new Map<string, Set<(...args: unknown[]) => void>>();

	return {
		on(event, handler) {
			if (!handlers.has(event)) handlers.set(event, new Set());
			handlers.get(event)!.add(handler as (...args: unknown[]) => void);
			return () => handlers.get(event)?.delete(handler as (...args: unknown[]) => void);
		},
		off(event, handler) {
			handlers.get(event)?.delete(handler as (...args: unknown[]) => void);
		},
		once(event, handler) {
			const wrapper = (...args: unknown[]) => {
				handler(...args as never);
				this.off(event, wrapper as never);
			};
			return this.on(event, wrapper as never);
		},
		emit(event, ...args) {
			handlers.get(event)?.forEach((h) => h(...args));
		},
	};
}

// ---------------------------------------------------------------------------
// Helper
// ---------------------------------------------------------------------------

function strToBuf(s: string): Uint8Array {
	return new TextEncoder().encode(s);
}

async function bufToStr(buf: ArrayBuffer): Promise<string> {
	return new TextDecoder().decode(buf);
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("ProjectFileSystem", () => {
	let vfs: InMemoryVFS;
	let events: EventBus<ProjectEventMap>;
	let emitted: { event: string; args: unknown[] }[];
	let onTreeSnapshotChange: ReturnType<typeof vi.fn>;
	let fs: ProjectFileSystem;
	const projectInfo = createProjectInfo();
	const scoped = (path: string) => `/projects/${projectInfo.id}/${path.replace(/^\//, "")}`;

	beforeEach(() => {
		vfs = new InMemoryVFS();
		emitted = [];
		events = createMockEventBus();
		const origEmit = events.emit.bind(events);
		events.emit = ((event: string, ...args: unknown[]) => {
			emitted.push({ event, args });
			origEmit(event, ...args);
		}) as EventBus<ProjectEventMap>["emit"];

		onTreeSnapshotChange = vi.fn();
		fs = new ProjectFileSystem(
			projectInfo,
			vfs,
			events,
			{ onTreeSnapshotChange },
			new DefaultProjectFileTree([]),
		);
	});

	// ---- scopePath / unscopePath (tested indirectly via all methods) ----

	describe("readFile / readTextFile", () => {
		it("reads a file through the vfs with scoped path", async () => {
			await vfs.writeFile(scoped("hello.txt"), strToBuf("world"));
			const data = await fs.readFile("hello.txt");
			expect(await bufToStr(data!)).toBe("world");
		});

		it("returns null for missing file", async () => {
			expect(await fs.readFile("nope.txt")).toBeNull();
		});

		it("readTextFile decodes bytes to string", async () => {
			await vfs.writeFile(scoped("text.txt"), strToBuf("content"));
			expect(await fs.readTextFile("text.txt")).toBe("content");
		});

		it("readTextFile throws on missing file", async () => {
			await expect(fs.readTextFile("ghost.txt")).rejects.toThrow("File not found");
		});
	});

	describe("writeFile / writeTextFile / createFile", () => {
		it("writes a file through the vfs with scoped path", async () => {
			await fs.writeFile("test.dat", strToBuf("data"));
			const raw = await vfs.readFile(scoped("test.dat"));
			expect(await bufToStr(raw!)).toBe("data");
		});

		it("emits file:write event", async () => {
			await fs.writeFile("event.txt", strToBuf("x"));
			expect(emitted).toContainEqual({ event: "file:write", args: [{ path: "event.txt" }] });
		});

		it("triggers refreshTree for new paths", async () => {
			const spy = vi.spyOn(fs as any, "refreshTree");
			await fs.writeFile("newfile.txt", strToBuf("x"));
			expect(spy).toHaveBeenCalled();
		});

		it("writeTextFile encodes string to bytes", async () => {
			await fs.writeTextFile("greeting.txt", "hello");
			const raw = await vfs.readFile(scoped("greeting.txt"));
			expect(await bufToStr(raw!)).toBe("hello");
		});

		it("createFile writes '{}' and emits file:create", async () => {
			await fs.createFile("new.json");
			const raw = await vfs.readFile(scoped("new.json"));
			expect(await bufToStr(raw!)).toBe("{}");
			expect(emitted).toContainEqual({ event: "file:create", args: [{ path: "new.json" }] });
		});
	});

	describe("writeFiles (batch)", () => {
		it("writes multiple files", async () => {
			await fs.writeFiles([
				{ name: "a.txt", data: strToBuf("a") },
				{ name: "b.txt", data: strToBuf("b") },
			]);
			expect(await bufToStr((await vfs.readFile(scoped("a.txt")))!)).toBe("a");
			expect(await bufToStr((await vfs.readFile(scoped("b.txt")))!)).toBe("b");
		});

		it("creates parent directories", async () => {
			await fs.writeFiles([{ name: "x/y/z.txt", data: strToBuf("deep") }]);
			expect(await vfs.exists(scoped("x/y"))).toBe(true);
		});

		it("emits file:write for each file", async () => {
			await fs.writeFiles([
				{ name: "f1.txt", data: strToBuf("1") },
				{ name: "f2.txt", data: strToBuf("2") },
			]);
			expect(emitted.filter((e) => e.event === "file:write")).toHaveLength(2);
		});

		it("throws AggregateError on write failures", async () => {
			const badVFS = new InMemoryVFS();
			const origWrite = badVFS.writeFile.bind(badVFS);
			let callCount = 0;
			badVFS.writeFile = async (path, data) => {
				callCount++;
				if (callCount === 2) throw new Error("write failed");
				return origWrite(path, data);
			};
			const badFs = new ProjectFileSystem(projectInfo, badVFS, events, { onTreeSnapshotChange }, new DefaultProjectFileTree([]));
			await expect(
				badFs.writeFiles([
					{ name: "ok.txt", data: strToBuf("") },
					{ name: "fail.txt", data: strToBuf("") },
				]),
			).rejects.toThrow(AggregateError);
		});
	});

	describe("delete", () => {
		it("deletes a file through the vfs", async () => {
			await vfs.writeFile(scoped("del.txt"), strToBuf("x"));
			await fs.delete("del.txt");
			expect(await vfs.exists(scoped("del.txt"))).toBe(false);
		});

		it("emits file:delete event", async () => {
			await vfs.writeFile(scoped("del.txt"), strToBuf("x"));
			await fs.delete("del.txt");
			expect(emitted).toContainEqual({ event: "file:delete", args: [{ path: "del.txt" }] });
		});
	});

	describe("mkdir", () => {
		it("creates a directory through the vfs", async () => {
			await fs.mkdir("sub");
			expect(await vfs.exists(scoped("sub"))).toBe(true);
		});

		it("emits file:mkdir event", async () => {
			await fs.mkdir("sub");
			expect(emitted).toContainEqual({ event: "file:mkdir", args: [{ path: "sub" }] });
		});
	});

	describe("readdir", () => {
		it("unscopes paths in returned entries", async () => {
			await vfs.writeFile(scoped("dir/a.txt"), strToBuf(""));
			const entries = await fs.readdir("dir");
			expect(entries[0]!.path).toBe("dir/a.txt");
		});
	});

	describe("listFiles", () => {
		it("lists files non-recursively", async () => {
			await vfs.writeFile(scoped("a.txt"), strToBuf(""));
			await vfs.mkdir(scoped("sub"));
			const entries = await fs.listFiles("/");
			expect(entries.map((e) => e.name).sort()).toEqual(["a.txt", "sub"]);
		});

		it("lists files recursively", async () => {
			await vfs.writeFile(scoped("top.txt"), strToBuf(""));
			await vfs.writeFile(scoped("x/y/deep.txt"), strToBuf(""));
			const entries = await fs.listFiles("/", { recursive: true });
			const paths = entries.map((e) => e.path);
			expect(paths).toContain("top.txt");
			expect(paths).toContain("x/y/deep.txt");
		});
	});

	describe("stat", () => {
		it("returns stat from vfs with scoped path", async () => {
			await vfs.writeFile(scoped("info.txt"), strToBuf("hello"));
			const s = await fs.stat("info.txt");
			expect(s.kind).toBe("file");
			expect(s.size).toBe(5);
		});

		it("throws on non-existent path", async () => {
			await expect(fs.stat("ghost")).rejects.toThrow("not found");
		});
	});

	describe("exists", () => {
		it("returns true for existing file", async () => {
			await vfs.writeFile(scoped("ex.txt"), strToBuf(""));
			expect(await fs.exists("ex.txt")).toBe(true);
		});

		it("returns false for non-existent path", async () => {
			expect(await fs.exists("ghost")).toBe(false);
		});
	});

	describe("rename / move / copy", () => {
		it("renames a file and emits file:rename", async () => {
			await vfs.writeFile(scoped("old.txt"), strToBuf("data"));
			await fs.rename("old.txt", "new.txt");
			expect(await vfs.exists(scoped("old.txt"))).toBe(false);
			expect(await vfs.exists(scoped("new.txt"))).toBe(true);
			expect(emitted).toContainEqual({ event: "file:rename", args: [{ oldPath: "old.txt", newPath: "new.txt" }] });
		});

		it("move emits file:rename and moves data", async () => {
			await vfs.writeFile(scoped("src.txt"), strToBuf("data"));
			await fs.move("src.txt", "dst.txt");
			expect(await vfs.exists(scoped("src.txt"))).toBe(false);
			expect(await vfs.exists(scoped("dst.txt"))).toBe(true);
			expect(emitted).toContainEqual({ event: "file:rename", args: [{ oldPath: "src.txt", newPath: "dst.txt" }] });
		});

		it("copy emits file:create and copies data", async () => {
			await vfs.writeFile(scoped("orig.txt"), strToBuf("data"));
			await fs.copy("orig.txt", "copy.txt");
			expect(await bufToStr((await vfs.readFile(scoped("copy.txt")))!)).toBe("data");
			expect(emitted).toContainEqual({ event: "file:create", args: [{ path: "copy.txt" }] });
		});
	});

	describe("readJsonFile / writeJsonFile", () => {
		it("writeJsonFile stringifies and writes HJSON", async () => {
			await fs.writeJsonFile("test.hjson", { a: 1 });
			const raw = await vfs.readFile(scoped("test.hjson"));
			const text = await bufToStr(raw!);
			expect(text).toContain("a");
		});

		it("readJsonFile parses HJSON content", async () => {
			await vfs.writeFile(scoped("data.hjson"), strToBuf('{a:1}'));
			const result = await fs.readJsonFile<{ a: number }>("data.hjson");
			expect(result).toEqual({ a: 1 });
		});

		it("readJsonFile throws on missing file", async () => {
			await expect(fs.readJsonFile("ghost.hjson")).rejects.toThrow("File not found");
		});
	});

	describe("watch", () => {
		it("returns an unsubscribe function", () => {
			const unsub = fs.watch(() => {});
			expect(typeof unsub).toBe("function");
		});

		it("unsubscribing does not throw", () => {
			const unsub = fs.watch(() => {});
			expect(() => unsub()).not.toThrow();
		});
	});

	describe("copyFile (alias)", () => {
		it("delegates to copy", async () => {
			await vfs.writeFile(scoped("src.txt"), strToBuf("data"));
			await fs.copyFile("src.txt", "dst.txt");
			expect(await vfs.exists(scoped("dst.txt"))).toBe(true);
			expect(emitted).toContainEqual({ event: "file:create", args: [{ path: "dst.txt" }] });
		});
	});
});
