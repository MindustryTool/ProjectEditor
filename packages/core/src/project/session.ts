import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ProjectFileSystem } from "../project-fs";
import { TreeSnapshot, type EventBus, type ProjectEventMap, type ProjectInfo } from "../types";

export interface ProjectContext {
	project: ProjectInfo;
	fs: ProjectFileSystem;
	events: EventBus<ProjectEventMap>;
}

export interface PathEntry {
	path: string;
	type: "text" | "sprite";
	jsonPath: string | null;
}

export interface RecentFileEntry {
	path: string;
	type: "text" | "sprite";
	jsonPath: string | null;
	lastAccessedAt: number;
}

const MAX_RECENT_FILES = 50;

interface ProjectSession {
	projectContext: ProjectContext | null;
	treeSnapshot: TreeSnapshot;
	recentlyOpenedFiles: Record<string, RecentFileEntry[]>;
	selectedPath: PathEntry | null;
    selectedTab: string;
	expanded: Record<string, boolean>;

    setSelectedTab: (tab: string) => void;
	setExpanded: (path: string, isExpanded: boolean) => void;
	toggleExpanded: (path: string) => void;
	setManyExpanded: (updates: Record<string, boolean>) => void;
	setCurrentProject: (context: ProjectContext | null) => void;
	updateCurrentProject: (patch: Partial<ProjectInfo>) => void;
	reset: () => void;
	recordFileAccess: (projectId: string, path: string, type?: "text" | "sprite", jsonPath?: string | null) => void;
	removeFromRecentFiles: (projectId: string, path: string) => void;
	clearRecentFiles: (projectId: string) => void;
	setSelectedPath: (entry: PathEntry | null) => void;
}

export const useProjectSession = create<ProjectSession>()(
	persist(
		(set) => ({
			projectContext: null,
			treeSnapshot: new TreeSnapshot([]),
			recentlyOpenedFiles: {},
			selectedPath: null,
			expanded: { "/": true },
            selectedTab: 'editor',

            setSelectedTab: (tab) => {
				set({ selectedTab: tab });
			},

			setExpanded: (path, isExpanded) => {
				set((state) => ({
					expanded: { ...state.expanded, [path]: isExpanded },
				}));
			},

			toggleExpanded: (path) => {
				set((state) => ({
					expanded: { ...state.expanded, [path]: !state.expanded[path] },
				}));
			},

			setManyExpanded: (updates) => {
				set((state) => ({
					expanded: { ...state.expanded, ...updates },
				}));
			},

			setCurrentProject: (context) => {
				set((state) => ({
					projectContext: context,
					treeSnapshot: context ? state.treeSnapshot : new TreeSnapshot([]),
				}));
			},

			updateCurrentProject: (patch) => {
				set((state) => {
					if (!state.projectContext) return state;
					const nextProject: ProjectInfo = { ...state.projectContext.project, ...patch };
					return {
						projectContext: { ...state.projectContext, project: nextProject },
					};
				});
			},

			reset: () => {
				set({ projectContext: null, treeSnapshot: new TreeSnapshot([]) });
			},

			recordFileAccess: (projectId, path, type = "text", jsonPath = null) => {
				set((state) => {
					const projectFiles = state.recentlyOpenedFiles[projectId] ?? [];
					return {
						recentlyOpenedFiles: {
							...state.recentlyOpenedFiles,
							[projectId]: touchEntry(projectFiles, path, type, jsonPath, Date.now()),
						},
					};
				});
			},

			removeFromRecentFiles: (projectId, path) => {
				set((state) => {
					const projectFiles = state.recentlyOpenedFiles[projectId] ?? [];
					return {
						recentlyOpenedFiles: {
							...state.recentlyOpenedFiles,
							[projectId]: removeEntry(projectFiles, path),
						},
					};
				});
			},

			clearRecentFiles: (projectId) => {
				set((state) => {
					const rest = { ...state.recentlyOpenedFiles };
					delete rest[projectId];
					return { recentlyOpenedFiles: rest };
				});
			},

			setSelectedPath: (entry) => {
				set({ selectedPath: entry });
			},
		}),
		{
			name: "project-session",
			version: 1,
			migrate: (persisted: unknown) => {
				const state = persisted as Record<string, unknown>;
				if (typeof state.selectedPath === "string" || state.selectedPath === null) {
					const oldPath = state.selectedPath as string | null;
					const oldJsonPath = state.currentJsonPath as string | null ?? null;
					if (oldPath && oldPath.startsWith("sprite:")) {
						state.selectedPath = { path: oldPath.slice(7), type: "sprite", jsonPath: null };
					} else if (oldPath) {
						state.selectedPath = { path: oldPath, type: "text", jsonPath: oldJsonPath };
					}
					delete state.currentJsonPath;
				}
				const recentFiles = state.recentlyOpenedFiles as Record<string, unknown[]> | undefined;
				if (recentFiles) {
					for (const key of Object.keys(recentFiles)) {
						recentFiles[key] = recentFiles[key]!.map((entry: unknown) => {
							const e = entry as Record<string, unknown>;
							if (e.type === undefined) {
								return { ...e, type: "text", jsonPath: null };
							}
							return e;
						});
					}
				}
				return state as unknown as ProjectSession;
			},
			partialize: (state) => ({
                selectedTab: state.selectedTab,
				recentlyOpenedFiles: state.recentlyOpenedFiles,
				selectedPath: state.selectedPath,
				expanded: state.expanded,
			}),
		},
	),
);

export function useCurrentProject() {
	const state = useProjectSession((state) => state.projectContext);

	if (state === null) {
		throw new Error("No project project context");
	}

	return state;
}

export function selectIsExpanded(path: string) {
	return (state: ProjectSession) => Boolean(state.expanded[path] || false);
}

export function selectJsonPath(state: ProjectSession) {
	return state.selectedPath?.jsonPath ?? null;
}

function evictLRU(entries: RecentFileEntry[]): RecentFileEntry[] {
	if (entries.length <= MAX_RECENT_FILES) return entries;
	const sorted = [...entries].sort((a, b) => b.lastAccessedAt - a.lastAccessedAt);
	return sorted.slice(0, MAX_RECENT_FILES);
}

function touchEntry(entries: RecentFileEntry[], path: string, type: "text" | "sprite", jsonPath: string | null, now: number): RecentFileEntry[] {
	const idx = entries.findIndex((e) => e.path === path);
	if (idx >= 0) {
		const updated = [...entries];
		updated[idx] = { ...updated[idx]!, type, jsonPath, lastAccessedAt: now };
		return evictLRU(updated);
	}
	return evictLRU([{ path, type, jsonPath, lastAccessedAt: now }, ...entries]);
}

function removeEntry(entries: RecentFileEntry[], path: string): RecentFileEntry[] {
	return entries.filter((e) => e.path !== path);
}
