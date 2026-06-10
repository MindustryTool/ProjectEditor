import { describe, expect, it } from "vitest";
import { DefaultProjectFileTree, isDefaultPath, jsonProjectTree, type TreeNode, type FileEntry, type FileStat } from "@project/fs";

describe("DefaultProjectFileTree", () => {
	it("walks every node in a flat tree", () => {
		const tree = new DefaultProjectFileTree([
			{ name: "a", type: "folder", path: "a" },
			{ name: "b", type: "folder", path: "b" },
		]);
		const visited: string[] = [];
		tree.walkTree((n) => visited.push(n.name));
		expect(visited).toEqual(["a", "b"]);
	});

	it("walks nested nodes depth-first", () => {
		const tree = new DefaultProjectFileTree([
			{
				name: "content",
				type: "folder",
				path: "content",
				children: [
					{ name: "items", type: "folder", path: "content/items" },
					{ name: "blocks", type: "folder", path: "content/blocks" },
				],
			},
			{ name: "maps", type: "folder", path: "maps" },
		]);
		const visited: string[] = [];
		tree.walkTree((n) => visited.push(n.name));
		expect(visited).toEqual(["content", "items", "blocks", "maps"]);
	});

	it("handles empty tree", () => {
		const tree = new DefaultProjectFileTree([]);
		const visited: string[] = [];
		tree.walkTree((n) => visited.push(n.name));
		expect(visited).toEqual([]);
	});
});

describe("isDefaultPath", () => {
	it("returns true for top-level paths", () => {
		expect(isDefaultPath(jsonProjectTree, "maps")).toBe(true);
	});

	it("returns true for nested paths", () => {
		expect(isDefaultPath(jsonProjectTree, "content/blocks")).toBe(true);
		expect(isDefaultPath(jsonProjectTree, "content/liquids")).toBe(true);
	});

	it("returns false for paths not in the tree", () => {
		expect(isDefaultPath(jsonProjectTree, "nonexistent")).toBe(false);
		expect(isDefaultPath(jsonProjectTree, "content/nonexistent")).toBe(false);
	});

	it("returns false for empty path", () => {
		expect(isDefaultPath(jsonProjectTree, "")).toBe(false);
	});

	it("returns true for deeply nested custom tree", () => {
		const tree = new DefaultProjectFileTree([
			{
				name: "a",
				type: "folder",
				path: "a",
				children: [
					{
						name: "b",
						type: "folder",
						path: "a/b",
						children: [{ name: "c", type: "file", path: "a/b/c" }],
					},
				],
			},
		]);
		expect(isDefaultPath(tree, "a/b/c")).toBe(true);
		expect(isDefaultPath(tree, "a/b")).toBe(true);
		expect(isDefaultPath(tree, "a")).toBe(true);
	});
});

describe("jsonProjectTree", () => {
	it("has the expected top-level folders", () => {
		const names = jsonProjectTree.projectTree.map((n) => n.name);
		expect(names).toContain("content");
		expect(names).toContain("maps");
		expect(names).toContain("bundles");
		expect(names).toContain("sounds");
		expect(names).toContain("schematics");
		expect(names).toContain("scripts");
		expect(names).toContain("sprites-override");
		expect(names).toContain("sprites");
	});

	it("has no duplicate paths", () => {
		const paths = new Set<string>();
		const walk = (nodes: TreeNode[]) => {
			for (const n of nodes) {
				expect(paths.has(n.path)).toBe(false);
				paths.add(n.path);
				if (n.children) walk(n.children);
			}
		};
		walk(jsonProjectTree.projectTree);
	});

	it("has content children: items, blocks, liquids, units", () => {
		const content = jsonProjectTree.projectTree.find((n) => n.name === "content")!;
		const childNames = content.children!.map((c) => c.name);
		expect(childNames).toEqual(["items", "blocks", "liquids", "units"]);
	});
});
