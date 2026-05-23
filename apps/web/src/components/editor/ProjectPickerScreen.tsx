import { useCallback, useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select"
import { getAllProjects, type ProjectRecord } from "@project/storage"
import type { ProjectLanguage } from "@project/core"
import { FolderOpen, Plus } from "lucide-react"

interface ProjectPickerScreenProps {
  onCreateProject: (name: string, language?: ProjectLanguage) => void
  onOpenProject: (record: ProjectRecord) => void
}

const LANGUAGE_OPTIONS: { value: ProjectLanguage; label: string; short: string; color: string }[] = [
  { value: "json", label: "JSON", short: "JSON", color: "text-blue-600" },
  { value: "java", label: "Java", short: "Java", color: "text-orange-600" },
  { value: "javascript", label: "JavaScript", short: "JS", color: "text-yellow-600" },
];

function LanguageBadge({ language }: { language?: string }) {
  const opt = LANGUAGE_OPTIONS.find(o => o.value === (language ?? "json"))!;
  return (
    <span className={`inline-flex items-center rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase leading-none ${opt.color} bg-current/10`}>
      {opt.short}
    </span>
  );
}

export function ProjectPickerScreen({ onCreateProject, onOpenProject }: ProjectPickerScreenProps) {
  const { t } = useTranslation()
  const [projects, setProjects] = useState<ProjectRecord[]>([])
  const [newName, setNewName] = useState("")
  const [newLanguage, setNewLanguage] = useState<ProjectLanguage>("json")
  const [nameError, setNameError] = useState("")

  const loadProjects = useCallback(async () => {
    const all = await getAllProjects()
    setProjects(all)
  }, [])

  useEffect(() => {
    loadProjects()
  }, [loadProjects])

  function handleCreate() {
    const trimmed = newName.trim()
    if (!trimmed) {
      setNameError("Name is required")
      return
    }
    onCreateProject(trimmed, newLanguage)
    setNewName("")
    setNewLanguage("json")
    setNameError("")
  }

  return (
    <div className="flex flex-1 items-center justify-center bg-background">
      <div className="w-full max-w-md space-y-8 px-6">
        <div className="space-y-2 text-center">
          <h1 className="text-xl font-medium text-foreground">{t("app.title")}</h1>
          <p className="text-xs text-muted-foreground">{t("projectPickerScreen.description")}</p>
        </div>

        <div className="space-y-3 rounded-lg border bg-muted/50 p-4">
          <div className="flex items-center gap-2 text-xs font-medium text-foreground">
            <Plus className="h-4 w-4" />
            {t("projectPickerScreen.createNew")}
          </div>
          <div className="flex gap-2">
            <Input
              placeholder={t("projectPickerScreen.namePlaceholder")}
              value={newName}
              onChange={(e) => { setNewName(e.target.value); setNameError("") }}
              onKeyDown={(e) => { if (e.key === "Enter") handleCreate() }}
            />
            <Button onClick={handleCreate} size="sm">{t("projectPickerScreen.create")}</Button>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-xs font-medium text-muted-foreground">{t("projectPickerScreen.language")}</label>
            <Select value={newLanguage} onValueChange={(v: ProjectLanguage) => setNewLanguage(v)}>
              <SelectTrigger className="h-7 w-32 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {LANGUAGE_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value} className="text-xs">
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {nameError && <p className="text-xs text-destructive">{nameError}</p>}
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs font-medium text-foreground">
            <FolderOpen className="h-4 w-4" />
            {t("projectPickerScreen.recentProjects")}
          </div>
          <div className="space-y-1">
            {projects.length === 0 && (
              <p className="py-8 text-center text-xs text-muted-foreground">{t("projectPickerScreen.noProjects")}</p>
            )}
            {projects.map((project) => (
              <button
                key={project.id}
                type="button"
                className="w-full rounded-md px-3 py-2 text-left text-xs transition-colors hover:bg-accent"
                onClick={() => onOpenProject(project)}
              >
                <div className="flex items-center gap-2 font-medium text-foreground">
                  {project.name}
                  <LanguageBadge language={project.language} />
                </div>
                <div className="text-muted-foreground">
                  {new Date(project.updatedAt).toLocaleDateString()}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
