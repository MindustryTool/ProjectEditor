import { AppSettingsDialog } from "#/components/editor/AppSettingsDialog";
import type { ReactNode } from "react";
import { cn } from "~/lib/utils";

interface ToolbarProps {
	children: ReactNode;
	className?: string;
}

export function Toolbar({ children, className }: ToolbarProps) {
	return (
		<div className={cn("flex h-9 min-h-9 max-h-9 border-b bg-muted text-sm overflow-x-auto w-full", className)}>
			<div className="flex items-center gap-1 px-2">{children}</div>
			<div className="ml-auto pr-1 items-center flex">
				<AppSettingsDialog />
			</div>
		</div>
	);
}
