import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export const EMPTY_ARRAY = [];

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

const cache = new WeakMap<ArrayBuffer, string>();

export function getImageUrl(data: ArrayBuffer): string {
	let url = cache.get(data);

	if (!url) {
		url = URL.createObjectURL(new Blob([data], { type: "image/png" }));

		cache.set(data, url);
	}

	return url;
}
