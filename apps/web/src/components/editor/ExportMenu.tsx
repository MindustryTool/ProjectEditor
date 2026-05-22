import { useTranslation } from "react-i18next"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu"
import { ChevronDown } from "lucide-react"
import { cn } from "~/lib/utils"

interface ExportMenuProps {
  className?: string
}

export function ExportMenu({ className }: ExportMenuProps) {
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
          {t("exportMenu.label")}
          <ChevronDown className="h-3 w-3 text-muted-foreground" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-44">
        <DropdownMenuItem>{t("exportMenu.exportJson")}</DropdownMenuItem>
        <DropdownMenuItem>{t("exportMenu.exportImage")}</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
