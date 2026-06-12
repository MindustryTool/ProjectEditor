import {
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem,
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
} from "#/components/ui/dropdown-menu";
import { useViewMenu, type Theme } from "./use-view-menu";
import type { Locale } from "#/lib/locales";

export function ViewMenuContent() {
	const { t, theme, locales, handleThemeChange, handleLanguageChange } = useViewMenu();

	return (
		<DropdownMenuContent align="start" className="w-44">
			<DropdownMenuSub>
				<DropdownMenuSubTrigger>{t("view-menu.change-theme")}</DropdownMenuSubTrigger>
				<DropdownMenuSubContent className="w-36">
					<DropdownMenuRadioGroup value={theme} onValueChange={(value) => handleThemeChange(value as Theme)}>
						<DropdownMenuRadioItem value="light">{t("view-menu.theme-light")}</DropdownMenuRadioItem>
						<DropdownMenuRadioItem value="dark">{t("view-menu.theme-dark")}</DropdownMenuRadioItem>
						<DropdownMenuRadioItem value="system">{t("view-menu.theme-auto")}</DropdownMenuRadioItem>
					</DropdownMenuRadioGroup>
				</DropdownMenuSubContent>
			</DropdownMenuSub>

			<DropdownMenuSub>
				<DropdownMenuSubTrigger>{t("view-menu.change-language")}</DropdownMenuSubTrigger>
				<DropdownMenuSubContent className="w-36">
					{locales.map((locale) => (
						<DropdownMenuItem key={locale.code} onClick={() => handleLanguageChange(locale.code as Locale)}>
							{locale.label}
						</DropdownMenuItem>
					))}
				</DropdownMenuSubContent>
			</DropdownMenuSub>
		</DropdownMenuContent>
	);
}
