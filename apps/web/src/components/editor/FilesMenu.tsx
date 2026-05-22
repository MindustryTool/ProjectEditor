import { useTranslation } from "react-i18next"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu"
import { ChevronDown } from "lucide-react"
import { cn } from "~/lib/utils"

interface FilesMenuProps {
  className?: string
}

export function FilesMenu({ className }: FilesMenuProps) {
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
          {t("filesMenu.label")}
          <ChevronDown className="h-3 w-3 text-muted-foreground" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-40">
        <DropdownMenuItem>{t("filesMenu.openFile")}</DropdownMenuItem>
        <DropdownMenuItem>{t("filesMenu.save")}</DropdownMenuItem>
        <DropdownMenuItem>{t("filesMenu.saveAs")}</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
