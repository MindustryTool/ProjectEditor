import { unzip, zip, type AsyncZipOptions } from "fflate";

export interface ZipEntry {
  name: string;
  data: Uint8Array;
}

export async function extractZip(buffer: Uint8Array): Promise<ZipEntry[]> {
  return new Promise((resolve, reject) => {
    unzip(buffer, (err, data) => {
      if (err) {
        reject(err);
        return;
      }
      const entries: ZipEntry[] = Object.entries(data).map(([name, data]) => ({
        name,
        data,
      }));
      resolve(entries);
    });
  });
}

export async function createZip(entries: ZipEntry[]): Promise<Uint8Array> {
  const files: Record<string, [Uint8Array, AsyncZipOptions]> = {};
  for (const entry of entries) {
    files[entry.name] = [entry.data, { level: 6 }];
  }
  return new Promise((resolve, reject) => {
    zip(files, (err, data) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(data);
    });
  });
}

export function getEntryByName(entries: ZipEntry[], name: string): ZipEntry | undefined {
  return entries.find((e) => e.name === name);
}

export function getTextContent(entry: ZipEntry): string {
  return new TextDecoder().decode(entry.data);
}
