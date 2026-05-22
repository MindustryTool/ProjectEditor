import { useTranslation } from "react-i18next"
import { useQueryState } from "nuqs"
import { FilesMenu } from "./FilesMenu"
import { ViewMenu } from "./ViewMenu"
import { ExportMenu } from "./ExportMenu"
import { LocalizationMenu } from "./LocalizationMenu"
import { FileExplorer } from "./FileExplorer"
import { Toolbar } from "./Toolbar"
import { StatusBar } from "./StatusBar"
import { SplitView } from "./SplitView"
import { Panel } from "./Panel"
import { findTreeNodeByPath } from "./file-explorer-data"
import { ModHjsonEditor } from "./mod-hjson/ModHjsonEditor"
import { FileJson, Image } from "lucide-react"

export function EditorPage() {
  const { t } = useTranslation()
  const [path] = useQueryState("path")

  const selectedNode = path ? findTreeNodeByPath(path) : null
  const hasSelection = selectedNode !== null

  function renderCenter() {
    if (!hasSelection) return undefined

    if (path === "mod.hjson") {
      return (
        <Panel header={t("editor.editor")}>
          <ModHjsonEditor />
        </Panel>
      )
    }

    return (
      <Panel header={t("editor.editor")}>
        <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
          {path}
        </div>
      </Panel>
    )
  }

  return (
    <div
      className="flex min-h-0 flex-1 flex-col bg-background text-foreground"
    >
      <Toolbar>
        <FilesMenu />
        <ViewMenu />
        <ExportMenu />
        <LocalizationMenu />
      </Toolbar>

      <SplitView
        defaultLeftWidth={260}
        defaultRightWidth={260}
        minPanelWidth={200}
        left={
          <Panel header={t("editor.explorer")}>
            <FileExplorer />
          </Panel>
        }
        center={renderCenter()}
        right={
          hasSelection
            ? (
              <Panel header={t("editor.properties")}>
                <div className="space-y-2 px-3 py-2 text-xs text-muted-foreground">
                  <p>{t("editor.propertiesPlaceholder")}</p>
                </div>
              </Panel>
            )
            : undefined
        }
      />

      <StatusBar
        left={
          <>
            <span>{t("statusBar.project", { name: "My Project" })}</span>
            <span className="text-muted-foreground">|</span>
            <span>{t("statusBar.files", { count: 3 })}</span>
          </>
        }
        center={<span>{t("statusBar.ready")}</span>}
        right={
          <div className="flex items-center gap-2">
            <FileJson className="h-3 w-3" />
            <Image className="h-3 w-3" />
          </div>
        }
      />
    </div>
  )
}
