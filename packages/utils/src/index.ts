export function debounce<T extends (...args: unknown[]) => unknown>(
  fn: T,
  delay: number,
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}

export function throttle<T extends (...args: unknown[]) => unknown>(
  fn: T,
  limit: number,
): (...args: Parameters<T>) => void {
  let inThrottle = false;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      fn(...args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
}

export function formatFileSize(bytes: number): string {
  const units = ["B", "KB", "MB", "GB"];
  let size = bytes;
  let unitIndex = 0;
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }
  return `${size.toFixed(1)} ${units[unitIndex]!}`;
}

export function sanitizeFilename(
  name: string,
  options?: { maxLength?: number; fallback?: string },
): string {
  const maxLength = options?.maxLength ?? 200;
  const fallback = options?.fallback ?? "export";
  let result = name.replace(/[^a-zA-Z0-9._-]/g, "-");
  result = result.replace(/-+/g, "-");
  result = result.replace(/^[-.]+|[-.]+$/g, "");
  result = result.slice(0, maxLength);
  return result || fallback;
}
