import { useLocalStorage } from "usehooks-ts";
import { useMediaQuery } from "#/hooks/use-media-query";

export function useIsDesktop() {
	const isDesktopScreen = useMediaQuery("(min-width: 768px)");

	return useLocalStorage("isDesktop", isDesktopScreen);
}
