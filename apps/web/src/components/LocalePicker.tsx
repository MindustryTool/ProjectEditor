import { useTranslation } from "react-i18next"
import { useNavigate, useLocation } from "@tanstack/react-router"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu"
import { Languages, ChevronDown } from "lucide-react"
import { SUPPORTED_LOCALES, type Locale } from "~/lib/locales"

const locales = [
  { code: "en", label: "English" },
  { code: "vi", label: "Tiếng Việt" },
]

export function LocalePicker() {
  const { i18n } = useTranslation()
  const navigate = useNavigate()
  const location = useLocation()

  const current = locales.find((l) => l.code === i18n.language) ?? locales[0]!

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
        <button className="inline-flex items-center gap-1 rounded-md px-2 py-1.5 text-sm text-foreground hover:bg-foreground">
          <Languages className="h-4 w-4" />
          <span className="hidden sm:inline">{current.label}</span>
          <ChevronDown className="h-3 w-3" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {locales.map((locale) => (
          <DropdownMenuItem
            key={locale.code}
            onClick={() => handleLanguageChange(locale.code as Locale)}
          >
            {locale.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
