import { baseEffects } from "@project/data";
import type { Effect } from "@project/api";
import type { ModHjsonData } from "@project/schema";

export function useEffects(_metadata: ModHjsonData): Effect[] {
	return baseEffects as Effect[];
}
