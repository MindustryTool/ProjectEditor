import { useState, useCallback } from "react";
import { useValidationStore } from "@project/core";
import { useTranslation } from "react-i18next";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "#/components/ui/dialog";
import { ValidationErrorList, type ValidationFileError } from "#/components/editor/ValidationErrorList";
import { usePath } from "#/hooks/use-path";
import { CircleXIcon, TriangleAlertIcon } from "lucide-react";

export function StatusBarRight({ mobile }: { mobile?: boolean }) {
	const { t } = useTranslation();
	const validationSummary = useValidationStore((s) => s.results.summary);
	const [, setPath] = usePath();
	const validationResults = useValidationStore((s) => s.results.resultsByPath);
	const [dialogOpen, setDialogOpen] = useState(false);
	const [dialogFilter, setDialogFilter] = useState<"error" | "warning">("error");

	const handleErrorClick = useCallback(() => {
		setDialogFilter("error");
		setDialogOpen(true);
	}, []);

	const handleWarningClick = useCallback(() => {
		setDialogFilter("warning");
		setDialogOpen(true);
	}, []);

	const handleNavigate = useCallback(
		(filePath: string, jsonPath: string | null) => {
			setDialogOpen(false);
			setPath({ path: filePath, type: "text", jsonPath });
		},
		[setPath],
	);

	const dialogItems: ValidationFileError[] = Object.entries(validationResults).flatMap(([filePath, results]) =>
		results
			.filter((r) => (dialogFilter === "error" ? r.severity === "error" : r.severity === "warning"))
			.map((r) => ({ filePath, ...r })),
	);

	return (
		<>
			<div className="flex items-center gap-2 text-xs">
				{(validationSummary["error"] ?? 0) > 0 && (
					<button type="button" className="text-red-500 underline-offset-2 hover:underline cursor-pointer flex" onClick={handleErrorClick}>
						{mobile ? (
							<span className="flex items-center gap-0.5">
								{validationSummary["error"] ?? 0} <CircleXIcon className="size-3.5" />
							</span>
						) : (
							t("status-bar.validation-errors", { count: validationSummary["error"] ?? 0 })
						)}
					</button>
				)}
				{(validationSummary["warning"] ?? 0) > 0 && (
					<button
						type="button"
						className="text-yellow-500 underline-offset-2 hover:underline cursor-pointer"
						onClick={handleWarningClick}
					>
						{mobile ? (
							<span className="flex items-center gap-0.5">
								{validationSummary["warning"] ?? 0} <TriangleAlertIcon className="size-3.5" />
							</span>
						) : (
							t("status-bar.validation-warnings", { count: validationSummary["warning"] ?? 0 })
						)}
					</button>
				)}
			</div>
			<Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>
							{dialogFilter === "error"
								? t("status-bar.validation-errors", { count: validationSummary["error"] ?? 0 })
								: t("status-bar.validation-warnings", { count: validationSummary["warning"] ?? 0 })}
						</DialogTitle>
					</DialogHeader>
					<ValidationErrorList items={dialogItems} onNavigate={handleNavigate} />
				</DialogContent>
			</Dialog>
		</>
	);
}
