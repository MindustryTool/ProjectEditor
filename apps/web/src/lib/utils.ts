import type { FileEntry } from "@project/fs";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function resolveContentSprite(path: string): string | null {
	if (!path.startsWith("content/") || !path.endsWith(".json")) {
		return null;
	}

	return `${path.replace("content", "sprites").replace(".json", "")}.png`;
}

export function findFileInTree(tree: FileEntry[], path: string): FileEntry | null {
	return tree.find((entry) => entry.path === path) ?? null;
}
