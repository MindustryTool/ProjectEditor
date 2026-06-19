import { useTranslation } from "react-i18next";
import { DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuShortcut } from "#/components/ui/dropdown-menu";
import { useEditMenu } from "./use-edit-menu";

export function EditMenuContent() {
	const { t } = useTranslation();
	const { path, canFormat, canUndo, canRedo, handleUndo, handleRedo, handleFormat } = useEditMenu();

	return (
		<DropdownMenuContent align="start" className="w-44">
			{path && (
				<>
					<DropdownMenuItem onClick={handleUndo} disabled={!canUndo}>
						{t("edit-menu.undo")}
						<DropdownMenuShortcut>Ctrl+Z</DropdownMenuShortcut>
					</DropdownMenuItem>
					<DropdownMenuItem onClick={handleRedo} disabled={!canRedo}>
						{t("edit-menu.redo")}
						<DropdownMenuShortcut>Ctrl+Shift+Z</DropdownMenuShortcut>
					</DropdownMenuItem>
					<DropdownMenuSeparator />
					<DropdownMenuItem onClick={handleFormat} disabled={!canFormat}>
						{t("edit-menu.format")}
					</DropdownMenuItem>
				</>
			)}
		</DropdownMenuContent>
	);
}
