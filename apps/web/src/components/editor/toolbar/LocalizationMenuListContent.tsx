import { Button } from "#/components/ui/button";
import { Dialog, DialogContent } from "#/components/ui/dialog";
import { CreateLocaleDialogContent } from "./CreateLocaleDialogContent";
import { useLocalizationMenu } from "./use-localization-menu";

interface LocalizationMenuListContentProps {
	onItemClick?: () => void;
}

export function LocalizationMenuListContent({ onItemClick }: LocalizationMenuListContentProps) {
	const { open, setOpen, handleCreateNewLocale, t } = useLocalizationMenu();

	const handleClick = () => {
		handleCreateNewLocale();
		onItemClick?.();
	};

	return (
		<div className="flex flex-col gap-1 p-2 w-full">
			<Button
				variant="ghost"
				className="w-full justify-start text-xs h-9 px-3 font-normal"
				onClick={handleClick}
			>
				{t("localization-menu.create-new-locale")}
			</Button>
			<Dialog open={open} onOpenChange={setOpen}>
				<DialogContent>
					<CreateLocaleDialogContent onClose={() => setOpen(false)} />
				</DialogContent>
			</Dialog>
		</div>
	);
}
