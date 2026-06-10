import { describe, expect, it, beforeEach, afterEach } from "vitest";
import { OPFSAdapter, type FileEntry } from "@project/fs";

function strToBuf(s: string): Uint8Array {
	return new TextEncoder().encode(s);
}

async function bufToStr(buf: ArrayBuffer): Promise<string> {
	return new TextDecoder().decode(buf);
}

async function createIsolatedRoot(): Promise<FileSystemDirectoryHandle> {
	const root = await navigator.storage.getDirectory();
	const testDir = await root.getDirectoryHandle(`__test_${Date.now()}_${Math.random().toString(36).slice(2)}`, {
		create: true,
	});
	return testDir;
}

describe("OPFSAdapter", () => {
	let adapter: OPFSAdapter;
	let root: FileSystemDirectoryHandle;

	beforeEach(async () => {
		root = await createIsolatedRoot();
		adapter = new OPFSAdapter(root);
	});

	afterEach(async () => {
		// Clean up all test data recursively
		for await (const [name] of (root as any).entries()) {
			await root.removeEntry(name, { recursive: true });
		}
	});

	describe("readFile / writeFile", () => {
		it("writes and reads a file", async () => {
			await adapter.writeFile("hello.txt", strToBuf("world"));
			const data = await adapter.readFile("hello.txt");
			expect(data).not.toBeNull();
			expect(await bufToStr(data!)).toBe("world");
		});

		it("reads non-existent file returns null", async () => {
			const data = await adapter.readFile("nonexistent.txt");
			expect(data).toBeNull();
		});

		it("writes and reads a file in a subdirectory", async () => {
			await adapter.writeFile("a/b/c/file.txt", strToBuf("nested"));
			const data = await adapter.readFile("a/b/c/file.txt");
			expect(await bufToStr(data!)).toBe("nested");
		});

		it("overwrites an existing file", async () => {
			await adapter.writeFile("data.txt", strToBuf("old"));
			await adapter.writeFile("data.txt", strToBuf("new"));
			const data = await adapter.readFile("data.txt");
			expect(await bufToStr(data!)).toBe("new");
		});

		it("handles binary data", async () => {
			const buf = new Uint8Array([0, 1, 255, 128, 64]);
			await adapter.writeFile("binary.bin", buf);
			const data = await adapter.readFile("binary.bin");
			expect(new Uint8Array(data!)).toEqual(buf);
		});
	});

	describe("delete", () => {
		it("deletes an existing file", async () => {
			await adapter.writeFile("todelete.txt", strToBuf("bye"));
			await adapter.delete("todelete.txt");
			expect(await adapter.readFile("todelete.txt")).toBeNull();
		});

		it("deletes a directory recursively", async () => {
			await adapter.writeFile("dir/sub/file.txt", strToBuf("deep"));
			await adapter.delete("dir");
			expect(await adapter.readFile("dir/sub/file.txt")).toBeNull();
		});

		it("throws on non-existent path", async () => {
			await expect(adapter.delete("ghost")).rejects.toThrow();
		});
	});

	describe("mkdir / readdir", () => {
		it("creates a directory and lists contents", async () => {
			await adapter.writeFile("root.txt", strToBuf(""));
			await adapter.mkdir("subdir");
			const entries = await adapter.readdir("/");
			const names = entries.map((e) => e.name);
			expect(names).toContain("root.txt");
			expect(names).toContain("subdir");
		});

		it("lists contents of a subdirectory", async () => {
			await adapter.writeFile("a/x.txt", strToBuf(""));
			await adapter.writeFile("a/y.txt", strToBuf(""));
			const entries = await adapter.readdir("a");
			expect(entries).toHaveLength(2);
			expect(entries.map((e) => e.name).sort()).toEqual(["x.txt", "y.txt"]);
		});

		it("returns entries with correct kind", async () => {
			await adapter.writeFile("f.txt", strToBuf(""));
			await adapter.mkdir("d");
			const entries = await adapter.readdir("/");
			const f = entries.find((e) => e.name === "f.txt")!;
			const d = entries.find((e) => e.name === "d")!;
			expect(f.kind).toBe("file");
			expect(d.kind).toBe("directory");
		});

		it("returns correct paths in entries", async () => {
			await adapter.writeFile("dir/f.txt", strToBuf(""));
			const entries = await adapter.readdir("dir");
			expect(entries[0]!.path).toBe("/dir/f.txt");
		});

		it("throws on non-existent directory", async () => {
			await expect(adapter.readdir("nope")).rejects.toThrow();
		});
	});

	describe("stat", () => {
		it("stats a file", async () => {
			await adapter.writeFile("info.txt", strToBuf("hello"));
			const s = await adapter.stat("info.txt");
			expect(s.kind).toBe("file");
			expect(s.name).toBe("info.txt");
			expect(s.size).toBe(5);
			expect(s.lastModified).toBeInstanceOf(Date);
		});

		it("stats a directory", async () => {
			await adapter.mkdir("emptydir");
			const s = await adapter.stat("emptydir");
			expect(s.kind).toBe("directory");
			expect(s.size).toBe(0);
		});

		it("stat('/') returns root directory metadata", async () => {
			const s = await adapter.stat("/");
			expect(s.kind).toBe("directory");
			expect(s.size).toBe(0);
		});

		it("stat('') returns root directory metadata", async () => {
			const s = await adapter.stat("");
			expect(s.kind).toBe("directory");
			expect(s.size).toBe(0);
		});

		it("throws on non-existent path", async () => {
			await expect(adapter.stat("ghost")).rejects.toThrow("not found");
		});
	});

	describe("exists", () => {
		it("returns true for existing file", async () => {
			await adapter.writeFile("exists.txt", strToBuf(""));
			expect(await adapter.exists("exists.txt")).toBe(true);
		});

		it("returns true for "/"", async () => {
			expect(await adapter.exists("/")).toBe(true);
		});

		it("returns false for non-existent path", async () => {
			expect(await adapter.exists("nope")).toBe(false);
		});

		it("returns true for existing directory", async () => {
			await adapter.mkdir("adir");
			expect(await adapter.exists("adir")).toBe(true);
		});
	});

	describe("rename", () => {
		it("renames a file", async () => {
			await adapter.writeFile("old.txt", strToBuf("data"));
			await adapter.rename("old.txt", "new.txt");
			expect(await adapter.readFile("old.txt")).toBeNull();
			expect(await bufToStr((await adapter.readFile("new.txt"))!)).toBe("data");
		});

		it("renames a directory recursively", async () => {
			await adapter.writeFile("src/a.txt", strToBuf("1"));
			await adapter.writeFile("src/b.txt", strToBuf("2"));
			await adapter.rename("src", "dst");
			expect(await adapter.exists("src")).toBe(false);
			const entries = await adapter.readdir("dst");
			expect(entries.map((e) => e.name).sort()).toEqual(["a.txt", "b.txt"]);
		});

		it("is a no-op when oldPath === newPath", async () => {
			await adapter.writeFile("same.txt", strToBuf("data"));
			await adapter.rename("same.txt", "same.txt");
			expect(await bufToStr((await adapter.readFile("same.txt"))!)).toBe("data");
		});

		it("throws on non-existent source", async () => {
			await expect(adapter.rename("ghost", "x")).rejects.toThrow();
		});
	});

	describe("move", () => {
		it("moves a file", async () => {
			await adapter.writeFile("src.txt", strToBuf("data"));
			await adapter.move("src.txt", "dst.txt");
			expect(await adapter.readFile("src.txt")).toBeNull();
			expect(await bufToStr((await adapter.readFile("dst.txt"))!)).toBe("data");
		});

		it("moves a directory recursively", async () => {
			await adapter.writeFile("olddir/x.txt", strToBuf("data"));
			await adapter.move("olddir", "newdir");
			expect(await bufToStr((await adapter.readFile("newdir/x.txt"))!)).toBe("data");
		});
	});

	describe("copy", () => {
		it("copies a file", async () => {
			await adapter.writeFile("original.txt", strToBuf("data"));
			await adapter.copy("original.txt", "copy.txt");
			expect(await bufToStr((await adapter.readFile("original.txt"))!)).toBe("data");
			expect(await bufToStr((await adapter.readFile("copy.txt"))!)).toBe("data");
		});

		it("throws when source does not exist", async () => {
			await expect(adapter.copy("ghost", "x")).rejects.toThrow("Source not found");
		});
	});
});
