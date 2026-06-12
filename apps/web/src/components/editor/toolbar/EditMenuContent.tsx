import { useTranslation } from "react-i18next";
import { DropdownMenuContent, DropdownMenuItem } from "#/components/ui/dropdown-menu";
import { useEditMenu } from "./use-edit-menu";

export function EditMenuContent() {
	const { t } = useTranslation();
	const { path, canFormat, handleFormat } = useEditMenu();

	return (
		<DropdownMenuContent align="start" className="w-44">
			{path && (
				<DropdownMenuItem onClick={handleFormat} disabled={!canFormat}>
					{t("edit-menu.format")}
				</DropdownMenuItem>
			)}
		</DropdownMenuContent>
	);
}
