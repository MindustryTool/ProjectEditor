import { useState, useCallback } from "react";
import { useValidationStore, Severity } from "@project/state";
import { useTranslation } from "react-i18next";
import { FileJson, Image } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "~/components/ui/dialog";
import { ValidationErrorList, type ValidationFileError } from "#/components/editor/ValidationErrorList";
import { usePath } from "#/hooks/use-path";

export function StatusBarRight() {
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
		(filePath: string) => {
			setDialogOpen(false);
			setPath(filePath);
		},
		[setPath],
	);

	const dialogItems: ValidationFileError[] = Object.entries(validationResults).flatMap(([filePath, results]) =>
		results
			.filter((r) => (dialogFilter === "error" ? r.severity === Severity.error : r.severity === Severity.warning))
			.map((r) => ({ filePath, ...r })),
	);

	return (
		<>
			<div className="flex items-center gap-2">
				{validationSummary.errors > 0 && (
					<button type="button" className="text-red-500 underline-offset-2 hover:underline cursor-pointer" onClick={handleErrorClick}>
						{t("statusBar.validationErrors", { count: validationSummary.errors })}
					</button>
				)}
				{validationSummary.warnings > 0 && (
					<button
						type="button"
						className="text-yellow-500 underline-offset-2 hover:underline cursor-pointer"
						onClick={handleWarningClick}
					>
						{t("statusBar.validationWarnings", { count: validationSummary.warnings })}
					</button>
				)}
				<FileJson className="h-3 w-3" />
				<Image className="h-3 w-3" />
			</div>
			<Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>
							{dialogFilter === "error"
								? t("statusBar.validationErrors", { count: validationSummary.errors })
								: t("statusBar.validationWarnings", { count: validationSummary.warnings })}
						</DialogTitle>
					</DialogHeader>
					<ValidationErrorList items={dialogItems} onNavigate={handleNavigate} />
				</DialogContent>
			</Dialog>
		</>
	);
}
