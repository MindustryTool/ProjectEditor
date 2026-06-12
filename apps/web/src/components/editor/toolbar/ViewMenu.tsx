import { useTranslation } from "react-i18next";
import {
	DropdownMenu,
	DropdownMenuTrigger,
} from "#/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import { cn } from "#/lib/utils";
import { ViewMenuContent } from "./ViewMenuContent";

interface ViewMenuProps {
	className?: string;
}

export function ViewMenu({ className }: ViewMenuProps) {
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
					{t("view-menu.label")}
					<ChevronDown className="h-3 w-3 text-muted-foreground" />
				</button>
			</DropdownMenuTrigger>
			<ViewMenuContent />
		</DropdownMenu>
	);
}
