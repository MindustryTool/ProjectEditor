import { useTranslation } from "react-i18next";
import { ChevronDown } from "lucide-react";
import { DropdownMenu, DropdownMenuTrigger } from "#/components/ui/dropdown-menu";
import { cn } from "#/lib/utils";
import { EditMenuContent } from "./EditMenuContent";

interface EditMenuProps {
	className?: string;
}

export function EditMenu({ className }: EditMenuProps) {
	const { t } = useTranslation();

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<button
					className={cn(
						"inline-flex text-nowrap items-center gap-1 rounded px-2 py-1 text-xs font-medium text-foreground hover:bg-accent active:bg-accent",
						className,
					)}
				>
					{t("edit-menu.label")}
					<ChevronDown className="h-3 w-3 text-muted-foreground" />
				</button>
			</DropdownMenuTrigger>
			<EditMenuContent />
		</DropdownMenu>
	);
}
