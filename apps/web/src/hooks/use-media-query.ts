import { useSyncExternalStore } from "react";

export function useMediaQuery(query: string): boolean {
	const getSnapshot = () => window.matchMedia(query).matches;

	const subscribe = (callback: () => void) => {
		const mql = window.matchMedia(query);
		mql.addEventListener("change", callback);
		return () => mql.removeEventListener("change", callback);
	};

	return useSyncExternalStore(subscribe, getSnapshot);
}
