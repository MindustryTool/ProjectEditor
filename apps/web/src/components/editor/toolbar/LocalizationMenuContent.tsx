import { DropdownMenuContent, DropdownMenuItem } from "#/components/ui/dropdown-menu";
import { Dialog, DialogContent } from "#/components/ui/dialog";
import { CreateLocaleDialogContent } from "./CreateLocaleDialogContent";
import { useLocalizationMenu } from "./use-localization-menu";

export function LocalizationMenuContent() {
	const { open, setOpen, handleCreateNewLocale, t } = useLocalizationMenu();

	return (
		<>
			<DropdownMenuContent align="start" className="w-44">
				<DropdownMenuItem onSelect={(e) => e.preventDefault()} onClick={handleCreateNewLocale}>{t("localization-menu.create-new-locale")}</DropdownMenuItem>
			</DropdownMenuContent>
			<Dialog open={open} onOpenChange={setOpen}>
				<DialogContent>
					<CreateLocaleDialogContent onClose={() => setOpen(false)} />
				</DialogContent>
			</Dialog>
		</>
	);
}
