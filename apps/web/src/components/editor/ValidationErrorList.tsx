import { useTranslation } from "react-i18next";
import type { ValidationResult } from "@project/core";
import { cn } from "~/lib/utils";
import { useCallback, useState } from "react";

export type ValidationFileError = ValidationResult & { filePath: string };

interface ValidationErrorListProps {
	items: ValidationFileError[];
	onNavigate: (path: string) => void;
	className?: string;
}

const severityClass: Record<string, string> = {
	error: "bg-destructive/10 text-destructive",
	warning: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400",
	info: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
	deprecated: "bg-muted text-muted-foreground",
};

export function ValidationErrorList({ items, onNavigate, className }: ValidationErrorListProps) {
	const { t } = useTranslation();
	const [render, setRender] = useState(30);

	const handleScroll = useCallback(
		(event: React.UIEvent<HTMLDivElement>) => {
			const target = event.target as HTMLDivElement;
			const scrollTop = target.scrollTop;
			const scrollHeight = target.scrollHeight;
			const clientHeight = target.clientHeight;
			const isAtBottom = scrollTop + clientHeight >= scrollHeight - 100;
            
			if (isAtBottom) {
				setRender(render + 30);
			}
		},
		[render],
	);

	if (items.length === 0) return null;

	return (
		<div className={cn("max-h-[80dvh] overflow-y-auto flex flex-col gap-1", className)} onScroll={handleScroll}>
			{items.map((err, i) =>
				i >= render ? null : (
					<div key={i} className={cn("flex gap-1 flex-col rounded p-1.5 text-xs", severityClass[err.severity] ?? "")}>
						<button
							type="button"
							className="shrink-0 font-medium underline-offset-2 hover:underline cursor-pointer text-left text-sm"
							onClick={() => onNavigate(err.filePath)}
							title={err.filePath}
						>
							{err.filePath}
						</button>
						<p className="text-inherit opacity-80 line-clamp-3 text-ellipsis">
							{(t as (key: string, params?: Record<string, unknown>) => string)(err.messageKey, err.messageParams)}
						</p>
					</div>
				),
			)}
		</div>
	);
}
