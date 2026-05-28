import { useMediaQuery } from "~/hooks/use-media-query";

export function useIsDesktop() {
	return useMediaQuery("(min-width: 768px)");
}
