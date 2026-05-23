const store = new Map<string, string>();

globalThis.localStorage = {
	getItem: (key: string) => store.get(key) ?? null,
	setItem: (key: string, value: string) => {
		store.set(key, String(value));
	},
	removeItem: (key: string) => {
		store.delete(key);
	},
	clear: () => {
		store.clear();
	},
	key: (index: number) => Array.from(store.keys())[index] ?? null,
	get length() {
		return store.size;
	},
} as any;

