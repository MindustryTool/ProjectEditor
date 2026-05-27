import { useSyncExternalStore, useCallback } from "react";
import { MONACO_THEME_DARK, MONACO_THEME_LIGHT } from "./colorTags";

function getTheme(): typeof MONACO_THEME_DARK | typeof MONACO_THEME_LIGHT {
  if (typeof document === "undefined") return MONACO_THEME_DARK;
  return document.documentElement.classList.contains("dark") ? MONACO_THEME_DARK : MONACO_THEME_LIGHT;
}

function subscribe(callback: () => void): () => void {
  const observer = new MutationObserver(() => callback());
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
  return () => observer.disconnect();
}

export function useMonacoTheme(): typeof MONACO_THEME_DARK | typeof MONACO_THEME_LIGHT {
  const getSnapshot = useCallback(() => getTheme(), []);
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}
