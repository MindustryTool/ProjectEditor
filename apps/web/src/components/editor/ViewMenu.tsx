import { useTranslation } from "react-i18next"
import { useNavigate, useLocation } from "@tanstack/react-router"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu"
import { ChevronDown } from "lucide-react"
import { cn } from "~/lib/utils"
import { SUPPORTED_LOCALES, type Locale } from "~/lib/locales"
import { useTheme } from "~/components/theme-provider"

type Theme = "light" | "dark" | "system"

const locales = [
  { code: "en", label: "English" },
  { code: "vi", label: "Tiếng Việt" },
]

interface ViewMenuProps {
  className?: string
}

export function ViewMenu({ className }: ViewMenuProps) {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const location = useLocation()
  const { theme, setTheme } = useTheme()

  function handleThemeChange(mode: Theme) {
    setTheme(mode)
  }

  function handleLanguageChange(code: Locale) {
    const segments = location.pathname.split("/").filter(Boolean)
    if (SUPPORTED_LOCALES.includes(segments[0] as Locale)) {
      segments[0] = code
    } else {
      segments.unshift(code)
    }
    navigate({ to: `/${segments.join("/")}`, replace: true })
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className={cn(
            "inline-flex items-center gap-1 rounded px-2 py-1 text-xs font-medium text-foreground hover:bg-accent active:bg-accent",
            className
          )}
        >
          {t("viewMenu.label")}
          <ChevronDown className="h-3 w-3 text-muted-foreground" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-44">
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            {t("viewMenu.changeTheme")}
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent className="w-36">
            <DropdownMenuRadioGroup
              value={theme}
              onValueChange={(value) =>
                handleThemeChange(value as Theme)
              }
            >
              <DropdownMenuRadioItem value="light">
                {t("viewMenu.themeLight")}
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="dark">
                {t("viewMenu.themeDark")}
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="system">
                {t("viewMenu.themeAuto")}
              </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuSubContent>
        </DropdownMenuSub>

        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            {t("viewMenu.changeLanguage")}
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent className="w-36">
            {locales.map((locale) => (
              <DropdownMenuItem
                key={locale.code}
                onClick={() => handleLanguageChange(locale.code as Locale)}
              >
                {locale.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuSubContent>
        </DropdownMenuSub>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
