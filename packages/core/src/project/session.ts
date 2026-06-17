import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ProjectFileSystem } from "../project-fs";
import { TreeSnapshot, type EventBus, type ProjectEventMap, type ProjectInfo } from "../types";

export interface ProjectContext {
	project: ProjectInfo;
	fs: ProjectFileSystem;
	events: EventBus<ProjectEventMap>;
}

export interface RecentFileEntry {
	path: string;
	lastAccessedAt: number;
}

const MAX_RECENT_FILES = 50;

interface ProjectSession {
	projectContext: ProjectContext | null;
	treeSnapshot: TreeSnapshot;
	recentlyOpenedFiles: Record<string, RecentFileEntry[]>;
    //TODO: use object {path: string, type: 'text' | "editor", jsonPath: string | null}
	selectedPath: string | null;
    selectedTab: string;
	expanded: Record<string, boolean>;
	currentJsonPath: string | null;

    setSelectedTab: (tab: string) => void;
	setExpanded: (path: string, isExpanded: boolean) => void;
	toggleExpanded: (path: string) => void;
	setManyExpanded: (updates: Record<string, boolean>) => void;
	setCurrentProject: (context: ProjectContext | null) => void;
	updateCurrentProject: (patch: Partial<ProjectInfo>) => void;
	reset: () => void;
	recordFileAccess: (projectId: string, path: string) => void;
	removeFromRecentFiles: (projectId: string, path: string) => void;
	clearRecentFiles: (projectId: string) => void;
	setSelectedPath: (path: string | null) => void;
	setCurrentJsonPath: (path: string | null) => void;
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
			currentJsonPath: null,


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

			recordFileAccess: (projectId, path) => {
				set((state) => {
					const projectFiles = state.recentlyOpenedFiles[projectId] ?? [];
					return {
						recentlyOpenedFiles: {
							...state.recentlyOpenedFiles,
							[projectId]: touchEntry(projectFiles, path, Date.now()),
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

			setSelectedPath: (path) => {
				set({ selectedPath: path, currentJsonPath: null });
			},

			setCurrentJsonPath: (path) => {
				set({ currentJsonPath: path });
			},
		}),
		{
			name: "project-session",
			partialize: (state) => ({
                currentJsonPath: state.currentJsonPath,
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

export function selectCurrentJsonPath(state: ProjectSession) {
	return state.currentJsonPath;
}

function evictLRU(entries: RecentFileEntry[]): RecentFileEntry[] {
	if (entries.length <= MAX_RECENT_FILES) return entries;
	const sorted = [...entries].sort((a, b) => b.lastAccessedAt - a.lastAccessedAt);
	return sorted.slice(0, MAX_RECENT_FILES);
}

function touchEntry(entries: RecentFileEntry[], path: string, now: number): RecentFileEntry[] {
	const idx = entries.findIndex((e) => e.path === path);
	if (idx >= 0) {
		const updated = [...entries];
		updated[idx] = { ...updated[idx]!, lastAccessedAt: now };
		return evictLRU(updated);
	}
	return evictLRU([{ path, lastAccessedAt: now }, ...entries]);
}

function removeEntry(entries: RecentFileEntry[], path: string): RecentFileEntry[] {
	return entries.filter((e) => e.path !== path);
}
