import { useState, useCallback } from "react"
import { useTranslation } from "react-i18next"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "~/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
} from "~/components/ui/dialog"
import { ChevronDown } from "lucide-react"
import { cn } from "~/lib/utils"
import { CreateLocaleDialogContent } from "./CreateLocaleDialogContent"

interface LocalizationMenuProps {
  className?: string
}

export function LocalizationMenu({ className }: LocalizationMenuProps) {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)

  const handleCreateNewLocale = useCallback(() => {
    setOpen(true)
  }, [])

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            className={cn(
              "inline-flex text-nowrap items-center gap-1 rounded px-2 py-1 text-xs font-medium text-foreground hover:bg-accent active:bg-accent",
              className,
            )}
          >
            {t("localization-menu.label")}
            <ChevronDown className="h-3 w-3 text-muted-foreground" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-44">
          <DropdownMenuItem onClick={handleCreateNewLocale}>
            {t("localization-menu.create-new-locale")}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <CreateLocaleDialogContent onClose={() => setOpen(false)} />
        </DialogContent>
      </Dialog>
    </>
  );
}
