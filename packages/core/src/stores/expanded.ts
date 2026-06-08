import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ExpandedState {
	expanded: Record<string, boolean>;
	setExpanded: (path: string, isExpanded: boolean) => void;
	toggleExpanded: (path: string) => void;
	setManyExpanded: (updates: Record<string, boolean>) => void;
}

export const useExpandedStore = create<ExpandedState>()(
	persist(
		(set) => ({
			expanded: { "/": true },

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
		}),
		{
			name: "file-explorer-expand",
		},
	),
);

export function selectIsExpanded(path: string) {
	return (state: ExpandedState) => Boolean(state.expanded[path] || false);
}
