import type { ReactNode } from "react";
import { Button } from "#/components/ui/button";
import { Eye, EyeOff } from "lucide-react";

export function PreviewContainer({
	hidden,
	onToggleVisibility,
	onClick,
	children,
	isSelected,
}: {
	hidden?: boolean;
	onToggleVisibility?: () => void;
	onClick?: () => void;
	children: ReactNode;
	isSelected?: boolean;
}) {
	return (
		<div className={`w-full flex border rounded bg-card p-2 ${hidden ? "opacity-40" : ""} ${isSelected ? "ring-2 ring-primary" : ""}`}>
			<div className="relative flex flex-col" onClick={onClick}>
				{children}
			</div>
			<Button
                className="ml-auto"
				variant="ghost"
				size="icon-sm"
				onClick={(e) => {
					e.stopPropagation();
					onToggleVisibility?.();
				}}
			>
				{hidden ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
			</Button>
		</div>
	);
}
