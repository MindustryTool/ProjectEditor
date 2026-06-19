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
		<div className={`w-full border rounded bg-card ${hidden ? "opacity-40" : ""} ${isSelected ? "ring-2 ring-primary" : ""}`}>
			<div className="relative flex p-2 flex-col" onClick={onClick}>
				<Button
					variant="ghost"
					size="icon"
					className="absolute top-0 right-0"
					onClick={(e) => {
						e.stopPropagation();
						onToggleVisibility?.();
					}}
				>
					{hidden ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
				</Button>
				{children}
			</div>
		</div>
	);
}
