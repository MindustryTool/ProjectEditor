import { useCallback } from "react"
import { useTranslation } from "react-i18next"
import { getExporter } from "@project/core"
import { useProjectStore } from "@project/state"
import { cn } from "~/lib/utils"

interface ExportMenuProps {
  className?: string
}

export function ExportMenu({ className }: ExportMenuProps) {
  const { t } = useTranslation()
  const projectContext = useProjectStore((s) => s.projectContext)

  const handleExport = useCallback(async () => {
    if (!projectContext) return

    try {
      const exporter = getExporter(projectContext.project.language)
      const zipData = await exporter.export(projectContext)

      const bytes = new Uint8Array(zipData.byteLength)
      bytes.set(zipData)
      const blob = new Blob([bytes], { type: "application/zip" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `${projectContext.project.name}.zip`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (err) {
      console.error("Export failed:", err)
      alert(t("exportMenu.exportFailed"))
    }
  }, [projectContext, t])

  return (
    <button
      onClick={handleExport}
      className={cn(
        "inline-flex items-center gap-1 rounded px-2 py-1 text-xs font-medium text-foreground hover:bg-accent active:bg-accent",
        className,
      )}
    >
      {t("exportMenu.label")}
    </button>
  )
}
