import { Button } from "#/components/ui/button";
import { useViewMenu, type Theme } from "./use-view-menu";
import type { Locale } from "#/lib/locales";

interface ViewMenuListContentProps {
	onItemClick?: () => void;
}

export function ViewMenuListContent({ onItemClick }: ViewMenuListContentProps) {
	const { t, theme, locales, currentLocale, handleThemeChange, handleLanguageChange } = useViewMenu();

	const changeTheme = (mode: Theme) => {
		handleThemeChange(mode);
		onItemClick?.();
	};

	const changeLanguage = (code: Locale) => {
		handleLanguageChange(code);
		onItemClick?.();
	};

	return (
		<div className="flex flex-col gap-4 p-3 w-full">
			<div className="space-y-1.5">
				<label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider px-1">
					{t("view-menu.change-theme")}
				</label>
				<div className="grid grid-cols-3 gap-1">
					<Button
						variant={theme === "light" ? "secondary" : "ghost"}
						className="text-xs h-8 px-2 font-normal"
						onClick={() => changeTheme("light")}
					>
						{t("view-menu.theme-light")}
					</Button>
					<Button
						variant={theme === "dark" ? "secondary" : "ghost"}
						className="text-xs h-8 px-2 font-normal"
						onClick={() => changeTheme("dark")}
					>
						{t("view-menu.theme-dark")}
					</Button>
					<Button
						variant={theme === "system" ? "secondary" : "ghost"}
						className="text-xs h-8 px-2 font-normal"
						onClick={() => changeTheme("system")}
					>
						{t("view-menu.theme-auto")}
					</Button>
				</div>
			</div>

			<div className="space-y-1.5">
				<label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider px-1">
					{t("view-menu.change-language")}
				</label>
				<div className="grid grid-cols-2 gap-1">
					{locales.map((locale) => (
						<Button
							key={locale.code}
							variant={currentLocale === locale.code ? "secondary" : "ghost"}
							className="text-xs h-8 px-2 font-normal"
							onClick={() => changeLanguage(locale.code as Locale)}
						>
							{locale.label}
						</Button>
					))}
				</div>
			</div>
		</div>
	);
}
