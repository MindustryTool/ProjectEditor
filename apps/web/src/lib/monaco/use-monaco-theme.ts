import { useSyncExternalStore, useCallback } from "react";

function getTheme(): "vs-dark" | "vs" {
  if (typeof document === "undefined") return "vs-dark";
  return document.documentElement.classList.contains("dark") ? "vs-dark" : "vs";
}

function subscribe(callback: () => void): () => void {
  const observer = new MutationObserver(() => callback());
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
  return () => observer.disconnect();
}

export function useMonacoTheme(): "vs-dark" | "vs" {
  const getSnapshot = useCallback(() => getTheme(), []);
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}
