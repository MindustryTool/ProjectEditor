import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export const EMPTY_ARRAY = [];

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function resolveContentSprite(path: string): string | null {
	if (!path.startsWith("content/") || !path.endsWith(".json")) {
		return null;
	}

	return `${path.replace("content", "sprites").replace(".json", "")}.png`;
}
