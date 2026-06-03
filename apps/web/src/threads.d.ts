declare module "threads" {
	export type ModuleThread<T = unknown> = T;

	export function spawn<T = unknown>(worker: Worker): Promise<ModuleThread<T>>;

	export const Thread: {
		terminate(thread: unknown): Promise<void>;
	};
}

declare module "threads/worker" {
	export function expose<T>(exposed: T): void;
}
