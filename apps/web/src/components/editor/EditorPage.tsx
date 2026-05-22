import { useTranslation } from "react-i18next"
import { FilesMenu } from "./FilesMenu"
import { ViewMenu } from "./ViewMenu"
import { ExportMenu } from "./ExportMenu"
import { LocalizationMenu } from "./LocalizationMenu"
import { Toolbar } from "./Toolbar"
import { StatusBar } from "./StatusBar"
import { SplitView } from "./SplitView"
import { Panel } from "./Panel"
import { File, FileJson, Image } from "lucide-react"

export function EditorPage() {
  const { t } = useTranslation()

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
            <div className="space-y-0.5 px-1 py-1">
              <div className="flex cursor-pointer items-center gap-1.5 rounded px-2 py-1 text-xs text-foreground hover:bg-accent">
                <File className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                mod.json
              </div>
              <div className="flex cursor-pointer items-center gap-1.5 rounded px-2 py-1 text-xs text-foreground hover:bg-accent">
                <File className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                content.json
              </div>
            </div>
          </Panel>
        }
        center={
          <Panel>
            <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
              {t("editor.selectFile")}
            </div>
          </Panel>
        }
        right={
          <Panel header={t("editor.properties")}>
            <div className="space-y-2 px-3 py-2 text-xs text-muted-foreground">
              <p>{t("editor.propertiesPlaceholder")}</p>
            </div>
          </Panel>
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
