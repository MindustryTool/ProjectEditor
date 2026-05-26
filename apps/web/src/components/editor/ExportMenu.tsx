import { useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { getExporter } from "@project/core";
import { useProjectSession } from "@project/state";
import { useValidationStore } from "@project/state";
import { cn } from "~/lib/utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { InputGroup, InputGroupInput, InputGroupAddon, InputGroupText } from "~/components/ui/input-group";

export function sanitizeFilename(name: string): string {
	let result = name.replace(/[^a-zA-Z0-9._-]/g, "-");
	result = result.replace(/-+/g, "-");
	result = result.replace(/^[-.]+|[-.]+$/g, "");
	result = result.slice(0, 200);
	return result || "export";
}

interface ExportMenuProps {
	className?: string;
}

export function ExportMenu({ className }: ExportMenuProps) {
	const { t } = useTranslation();
	const projectContext = useProjectSession((s) => s.projectContext);
	const validationResults = useValidationStore((s) => s.resultsByPath);
	const [open, setOpen] = useState(false);
	const [validationOpen, setValidationOpen] = useState(false);
	const [filename, setFilename] = useState("");
	const [warning, setWarning] = useState<string | null>(null);

	const handleExport = useCallback(
		async (fileName: string) => {
			if (!projectContext) return;

			try {
				const exporter = getExporter(projectContext.project.language);
				const zipData = await exporter.export(projectContext);

				const bytes = new Uint8Array(zipData.byteLength);
				bytes.set(zipData);
				const blob = new Blob([bytes], { type: "application/zip" });
				const url = URL.createObjectURL(blob);
				const a = document.createElement("a");
				a.href = url;
				a.download = fileName.endsWith(".zip") ? fileName : `${fileName}.zip`;
				document.body.appendChild(a);
				a.click();
				document.body.removeChild(a);
				URL.revokeObjectURL(url);
			} catch (err) {
				console.error("Export failed:", err);
				alert(t("exportMenu.exportFailed"));
			}
		},
		[projectContext, t],
	);

	const handleOpen = useCallback(() => {
		if (!projectContext) return;
		const sanitized = sanitizeFilename(projectContext.project.name);
		setFilename(sanitized);
		setWarning(null);
		setOpen(true);
	}, [projectContext]);

	const handleFilenameChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
		const raw = e.target.value.replace(/\.zip$/i, "");
		setFilename(raw);
		if (!raw) {
			setWarning("empty");
		} else {
			const sanitized = sanitizeFilename(raw);
			setWarning(sanitized !== raw ? "invalid" : null);
		}
	}, []);

	const hasErrors = Object.values(validationResults).some((results) => results.some((r) => r.severity === 0));

	const handleDownload = useCallback(() => {
		if (hasErrors) {
			setValidationOpen(true);
		} else {
			handleExport(filename);
			setOpen(false);
		}
	}, [filename, handleExport, hasErrors]);

	const handleExportAnyway = useCallback(() => {
		setValidationOpen(false);
		handleExport(filename);
		setOpen(false);
	}, [filename, handleExport]);

	const handleValidationCancel = useCallback(() => {
		setValidationOpen(false);
	}, []);

	const handleCancel = useCallback(() => {
		setOpen(false);
	}, []);

	const allErrors = Object.entries(validationResults).flatMap(([filePath, results]) =>
		results.filter((r) => r.severity === 0).map((r) => ({ filePath, ...r })),
	);

	return (
		<>
			<button
				onClick={handleOpen}
				className={cn(
					"inline-flex items-center gap-1 rounded px-2 py-1 text-xs font-medium text-foreground hover:bg-accent active:bg-accent",
					className,
				)}
			>
				{t("exportMenu.label")}
			</button>
			<Dialog open={open} onOpenChange={setOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>{t("exportMenu.dialogTitle")}</DialogTitle>
					</DialogHeader>
					<div className="flex flex-col gap-2">
						<label className="text-xs font-medium text-muted-foreground">{t("exportMenu.filenameLabel")}</label>
						<InputGroup>
							<InputGroupInput
								value={filename}
								onChange={handleFilenameChange}
								placeholder={t("exportMenu.filenameLabel")}
								aria-invalid={!!warning}
							/>
							<InputGroupAddon align="inline-end">
								<InputGroupText>.zip</InputGroupText>
							</InputGroupAddon>
						</InputGroup>
						{warning === "invalid" && <p className="text-xs text-destructive">{t("exportMenu.filenameWarning")}</p>}
						{warning === "empty" && <p className="text-xs text-destructive">{t("exportMenu.filenameEmpty")}</p>}
					</div>
					<DialogFooter>
						<Button variant="outline" onClick={handleCancel}>
							{t("exportMenu.cancel")}
						</Button>
						<Button onClick={handleDownload}>{t("exportMenu.download")}</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
			<Dialog open={validationOpen} onOpenChange={setValidationOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>{t("exportMenu.validationTitle")}</DialogTitle>
					</DialogHeader>
					<div className="flex flex-col gap-2">
						<p className="text-xs text-muted-foreground">{t("exportMenu.validationMessage")}</p>
						<div className="max-h-48 overflow-y-auto">
							{allErrors.map((err, i) => (
								<div key={i} className="flex gap-2 rounded bg-destructive/10 p-1.5 text-xs">
									<span className="shrink-0 font-medium text-destructive">{err.filePath}</span>
									<span className="text-muted-foreground">{t(err.messageKey, err.messageParams)}</span>
								</div>
							))}
						</div>
					</div>
					<DialogFooter>
						<Button variant="outline" onClick={handleValidationCancel}>
							{t("exportMenu.validationCancel")}
						</Button>
						<Button onClick={handleExportAnyway}>{t("exportMenu.exportAnyway")}</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	);
}
