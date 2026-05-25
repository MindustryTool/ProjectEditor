const extensionToLanguage: Record<string, string> = {
  ".json": "json",
  ".hjson": "hjson",
  ".java": "java",
  ".js": "javascript",
  ".ts": "typescript",
  ".jsx": "javascript",
  ".tsx": "typescript",
  ".css": "css",
  ".html": "html",
  ".md": "markdown",
  ".yaml": "yaml",
  ".yml": "yaml",
  ".xml": "xml",
  ".svg": "xml",
  ".txt": "plaintext",
};

export function getLanguageFromPath(path: string): string {
  const dotIndex = path.lastIndexOf(".");
  if (dotIndex === -1) return "plaintext";
  const ext = path.slice(dotIndex).toLowerCase();
  return extensionToLanguage[ext] ?? "plaintext";
}
