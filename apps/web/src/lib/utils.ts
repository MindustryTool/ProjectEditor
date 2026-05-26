import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function resolveJsonContentImage(path: string): string | null {
	if (!path.startsWith("content/") || !path.endsWith(".json")) {
		return null;
	}

	const name = path.split("/").at(-1);

	if (!name) return null;

	const base = name.slice(0, -5);

	return `sprites/${base}.png`;
}
