import type { ReactNode } from "react";
import { Button } from "#/components/ui/button";
import { Eye, EyeOff } from "lucide-react";

export function PreviewContainer({
	hidden,
	onToggleVisibility,
	onClick,
	footer,
	children,
}: {
	hidden?: boolean;
	onToggleVisibility?: () => void;
	onClick?: () => void;
	footer?: ReactNode;
	children: ReactNode;
}) {
	return (
		<div className={`w-full border rounded bg-card ${hidden ? "opacity-40" : ""}`}>
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
			{footer && <div className="border-t p-2 text-xs text-muted-foreground flex flex-col gap-1">{footer}</div>}
		</div>
	);
}
