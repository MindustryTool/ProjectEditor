import { useTranslation } from "react-i18next"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu"
import { ChevronDown } from "lucide-react"
import { cn } from "~/lib/utils"

interface LocalizationMenuProps {
  className?: string
}

export function LocalizationMenu({ className }: LocalizationMenuProps) {
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
          {t("localization-menu.label")}
          <ChevronDown className="h-3 w-3 text-muted-foreground" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-44" />
    </DropdownMenu>
  )
}
