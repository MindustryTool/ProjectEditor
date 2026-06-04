import { useTranslation } from "react-i18next";
import type { ValidationResult } from "@project/core";
import { cn } from "~/lib/utils";

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

	if (items.length === 0) return null;

	return (
		<div className={cn("max-h-48 overflow-y-auto flex flex-col gap-1", className)}>
			{items.map((err, i) => (
				<div key={i} className={cn("flex gap-2 flex-col rounded p-1.5 text-xs", severityClass[err.severity] ?? "")}>
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
			))}
		</div>
	);
}
