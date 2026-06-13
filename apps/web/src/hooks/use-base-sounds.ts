import { baseSounds } from "@project/data";
import type { Sound } from "@project/api";

export function useBaseSounds(): Sound[] {
	return baseSounds as Sound[];
}
