import type { ReactNode } from "react";
import { cn } from "#/lib/utils";

interface PanelProps {
	children: ReactNode;
	className?: string;
}

export function Panel({ children, className }: PanelProps) {
	return (
		<div className={cn("flex flex-col h-full pt-2 w-full overflow-hidden", className)}>
			<div className="overflow-y-auto h-full flex px-4 flex-col">
				<div className="flex w-full mb-10">{children}</div>
			</div>
		</div>
	);
}
