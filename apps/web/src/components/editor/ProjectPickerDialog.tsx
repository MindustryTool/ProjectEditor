import { useCallback, useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "~/components/ui/dialog"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select"
import { getAllProjects, type ProjectRecord } from "@project/storage"
import type { ProjectLanguage } from "@project/core"

interface ProjectPickerDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSelectProject: (project: ProjectRecord) => void
  onCreateProject: (name: string, language?: ProjectLanguage) => void
  mode: "create" | "open" | "change"
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

export function ProjectPickerDialog({ open, onOpenChange, onSelectProject, onCreateProject, mode }: ProjectPickerDialogProps) {
  const { t } = useTranslation()
  const [projects, setProjects] = useState<ProjectRecord[]>([])
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [newName, setNewName] = useState("")
  const [newLanguage, setNewLanguage] = useState<ProjectLanguage>("json")
  const [nameError, setNameError] = useState("")

  const loadProjects = useCallback(async () => {
    const all = await getAllProjects()
    setProjects(all)
  }, [])

  useEffect(() => {
    if (open) {
      loadProjects()
      setSelectedId(null)
      setNewName("")
      setNewLanguage("json")
      setNameError("")
    }
  }, [open, loadProjects])

  function handleCreate() {
    const trimmed = newName.trim()
    if (!trimmed) {
      setNameError("Name is required")
      return
    }
    onCreateProject(trimmed, newLanguage)
    onOpenChange(false)
  }

  function handleSelect() {
    const record = projects.find((p) => p.id === selectedId)
    if (record) {
      onSelectProject(record)
      onOpenChange(false)
    }
  }

  function handleDoubleClick(record: ProjectRecord) {
    onSelectProject(record)
    onOpenChange(false)
  }

  const titleKey = mode === "create" ? "projectPickerDialog.createTitle" : "projectPickerDialog.title"
  const showCreateForm = mode !== "change"

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{t(titleKey)}</DialogTitle>
          <DialogDescription>{t("projectPickerDialog.description")}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {showCreateForm && (
            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground">{t("projectPickerDialog.createNew")}</label>
              <div className="flex gap-2">
                <Input
                  placeholder={t("projectPickerDialog.namePlaceholder")}
                  value={newName}
                  onChange={(e) => { setNewName(e.target.value); setNameError("") }}
                  onKeyDown={(e) => { if (e.key === "Enter") handleCreate() }}
                />
                <Button onClick={handleCreate} size="sm">{t("projectPickerDialog.create")}</Button>
              </div>
              <div className="flex items-center gap-2">
                <label className="text-xs font-medium text-muted-foreground">{t("projectPickerDialog.language")}</label>
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
          )}

          {mode !== "create" && (
            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground">{t("projectPickerDialog.recentProjects")}</label>
              <div className="max-h-60 space-y-1 overflow-y-auto">
                {projects.length === 0 && (
                  <p className="py-4 text-center text-xs text-muted-foreground">{t("projectPickerDialog.noProjects")}</p>
                )}
                {projects.map((project) => (
                  <button
                    key={project.id}
                    type="button"
                    className={`w-full rounded-md px-3 py-2 text-left text-xs transition-colors hover:bg-accent ${
                      selectedId === project.id ? "bg-accent ring-1 ring-ring" : ""
                    }`}
                    onClick={() => setSelectedId(project.id)}
                    onDoubleClick={() => handleDoubleClick(project)}
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
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>{t("projectPickerDialog.cancel")}</Button>
          {mode !== "create" && (
            <Button onClick={handleSelect} disabled={!selectedId}>{t("projectPickerDialog.open")}</Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
