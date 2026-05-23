import type { Exporter, ExportContext } from "./exporter.js"
import { createZip, type ZipEntry } from "@project/zip"

export class JsonExporter implements Exporter {
  async export(context: ExportContext): Promise<Uint8Array> {
    const files = await this.collectFiles(context.fs, "")
    const entries: ZipEntry[] = files.map(({ path, data }) => ({
      name: path,
      data: new Uint8Array(data),
    }))
    return createZip(entries)
  }

  private async collectFiles(
    fs: ExportContext["fs"],
    dir: string,
  ): Promise<{ path: string; data: ArrayBuffer }[]> {
    const entries = await fs.readdir(dir || "/")
    const results: { path: string; data: ArrayBuffer }[] = []

    for (const entry of entries) {
      const fullPath = dir ? `${dir}/${entry.name}` : entry.name
      if (entry.kind === "directory") {
        const sub = await this.collectFiles(fs, fullPath)
        results.push(...sub)
      } else {
        const data = await fs.readFile(fullPath)
        results.push({ path: fullPath.replace(/^\//, ""), data })
      }
    }

    return results
  }
}
