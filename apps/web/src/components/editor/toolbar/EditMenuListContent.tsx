import { useTranslation } from "react-i18next";
import { Button } from "#/components/ui/button";
import { useEditMenu } from "./use-edit-menu";

interface EditMenuListContentProps {
	onItemClick?: () => void;
}

export function EditMenuListContent({ onItemClick }: EditMenuListContentProps) {
	const { t } = useTranslation();
	const { path, canFormat, handleFormat } = useEditMenu();

	const handleClick = () => {
		handleFormat();
		onItemClick?.();
	};

	if (!path) {
		return (
			<div className="flex items-center justify-center p-4 text-xs text-muted-foreground">
				{t("edit-menu.no-file-open", "No file open")}
			</div>
		);
	}

	return (
		<div className="flex flex-col gap-1 p-1 w-full">
			<Button variant="ghost" className="w-full justify-start text-xs h-9 px-3 font-normal" onClick={handleClick} disabled={!canFormat}>
				{t("edit-menu.format")}
			</Button>
		</div>
	);
}
