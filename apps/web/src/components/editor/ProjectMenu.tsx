import { useTranslation } from "react-i18next"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu"
import { ChevronDown } from "lucide-react"
import { cn } from "~/lib/utils"

interface ProjectMenuProps {
  className?: string
  hasProject: boolean
  onCreateProject: () => void
  onOpenProject: () => void
  onChangeProject: () => void
  onCloseProject: () => void
}

export function ProjectMenu({ className, hasProject, onCreateProject, onOpenProject, onChangeProject, onCloseProject }: ProjectMenuProps) {
  const { t } = useTranslation()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className={cn(
            "inline-flex items-center gap-1 rounded px-2 py-1 text-xs font-medium text-foreground hover:bg-accent active:bg-accent",
            className
          )}
        >
          {t("projectMenu.label")}
          <ChevronDown className="h-3 w-3 text-muted-foreground" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-44">
        <DropdownMenuItem onClick={onCreateProject}>
          {t("projectMenu.createProject")}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onOpenProject}>
          {t("projectMenu.openProject")}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onChangeProject} disabled={!hasProject}>
          {t("projectMenu.changeProject")}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onCloseProject} disabled={!hasProject}>
          {t("projectMenu.closeProject")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
