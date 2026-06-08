import type { TreeSnapshot, ValidationBatchFile, ValidationResult } from "@project/core";
import { useState, useCallback, useRef } from "react";
import { useTranslation } from "react-i18next";
import { getExporter, hasDefaultValidatorMatch } from "@project/core";
import { useProjectSession, useValidationStore } from "@project/core";
import { cn } from "~/lib/utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { InputGroup, InputGroupInput, InputGroupAddon, InputGroupText } from "~/components/ui/input-group";
import { Progress } from "~/components/ui/progress";
import { ValidationErrorList, type ValidationFileError } from "#/components/editor/ValidationErrorList";
import { usePath } from "#/hooks/use-path";
import { validationService } from "#/services/validation-service";

interface ExportMenuProps {
	className?: string;
}

export function ExportMenu({ className }: ExportMenuProps) {
	const { t } = useTranslation();
	const projectContext = useProjectSession((s) => s.projectContext);
	const [, setPath] = usePath();
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
			} catch {
				alert(t("export-menu.export-failed"));
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

	const handleCancel = useCallback(() => {
		setOpen(false);
	}, []);

	const handleExportAnyway = useCallback(() => {
		setValidationOpen(false);
		handleExport(filename);
		setOpen(false);
	}, [filename, handleExport]);

	const handleNavigate = useCallback(
		(filePath: string) => {
			setValidationOpen(false);
			setOpen(false);
			setPath(filePath);
		},
		[setPath],
	);

	return (
		<>
			<button
				onClick={handleOpen}
				className={cn(
					"inline-flex items-center text-nowrap gap-1 rounded px-2 py-1 text-xs font-medium text-foreground hover:bg-accent active:bg-accent",
					className,
				)}
			>
				{t("export-menu.label")}
			</button>
			<Dialog open={open} onOpenChange={setOpen}>
				<DialogContent>
					<ExportDialogContent
						filename={filename}
						warning={warning}
						onFilenameChange={handleFilenameChange}
						onClose={handleCancel}
						onOpenValidation={() => setValidationOpen(true)}
						handleExport={handleExport}
					/>
				</DialogContent>
			</Dialog>
			<Dialog open={validationOpen} onOpenChange={setValidationOpen}>
				<DialogContent>
					<ValidationDialogContent
						onClose={() => setValidationOpen(false)}
						onNavigate={handleNavigate}
						onExportAnyway={handleExportAnyway}
					/>
				</DialogContent>
			</Dialog>
		</>
	);
}

async function loadAndValidateAll(
	treeSnapshot: TreeSnapshot,
	readFile: (path: string) => Promise<ArrayBuffer | null>,
	validateFiles: (files: ValidationBatchFile[]) => Promise<Record<string, ValidationResult[]> | null>,
	onProgress: (current: string, completed: number, total: number) => void,
) {
	const entries = treeSnapshot.getEntries().filter((e) => e.kind === "file" && hasDefaultValidatorMatch(e.path));
	const total = entries.length;
	const files: ValidationBatchFile[] = [];
	const decoder = new TextDecoder();

	for (let i = 0; i < total; i++) {
		const entry = entries[i]!;
		onProgress(entry.path, i, total);

		try {
			const data = await readFile(entry.path);
			files.push({
				path: entry.path,
				content: data ? decoder.decode(data) : "",
			});
		} catch (err) {
			useValidationStore.getState().setResults(entry.path, [
				{
					path: entry.path,
					severity: "error",
					messageKey: err instanceof Error ? err.message : "Unknown error",
					startLine: 1,
					startColumn: 1,
					duration: 0,
				},
			]);
		}
	}

	return validateFiles(files);
}

function ExportDialogContent({
	filename,
	warning,
	onFilenameChange,
	onClose,
	onOpenValidation,
	handleExport,
}: {
	filename: string;
	warning: string | null;
	onFilenameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	onClose: () => void;
	onOpenValidation: () => void;
	handleExport: (fileName: string) => Promise<void>;
}) {
	const { t } = useTranslation();
	const treeSnapshot = useProjectSession((s) => s.treeSnapshot);
	const projectContext = useProjectSession((s) => s.projectContext);
	const [downloadLoading, setDownloadLoading] = useState(false);
	const [currentFile, setCurrentFile] = useState("");
	const [validationProgress, setValidationProgress] = useState(0);
	const currentFileRef = useRef("");
	const progressRef = useRef(0);
	const lastUpdateRef = useRef(0);
	const THROTTLE_MS = 50;

	const handleDownload = useCallback(async () => {
		if (!projectContext || !treeSnapshot) return;

		setDownloadLoading(true);
		setValidationProgress(0);
		setCurrentFile("");
		let resultsByPath: Record<string, ValidationResult[]> | null = null;
		try {
			resultsByPath = await loadAndValidateAll(
				treeSnapshot,
				(path) => projectContext.fs.readFile(path),
				validationService.validateFiles,
				(path, completed, total) => {
					currentFileRef.current = path;
					progressRef.current = Math.round(((completed + 1) / total) * 100);

					const now = Date.now();
					if (now - lastUpdateRef.current > THROTTLE_MS) {
						lastUpdateRef.current = now;
						setCurrentFile(path);
						setValidationProgress(progressRef.current);
					}
				},
			);
		} finally {
			setCurrentFile(currentFileRef.current);
			setValidationProgress(100);
			setDownloadLoading(false);
		}

		if (resultsByPath === null) return;

		const hasErrors = Object.values(resultsByPath).some((results) => results.some((r) => r.severity === "error"));

		if (hasErrors) {
			onOpenValidation();
		} else {
			handleExport(filename);
			onClose();
		}
	}, [projectContext, treeSnapshot, handleExport, filename, onClose, onOpenValidation]);

	return (
		<>
			<DialogHeader>
				<DialogTitle>{t("export-menu.dialog-title")}</DialogTitle>
			</DialogHeader>
			{downloadLoading ? (
				<div className="flex flex-col gap-2">
					{currentFile && <p className="truncate text-xs text-muted-foreground">{currentFile}</p>}
					<Progress value={validationProgress} />
				</div>
			) : (
				<div className="flex flex-col gap-2">
					<label className="text-xs font-medium text-muted-foreground">{t("export-menu.filename-label")}</label>
					<InputGroup>
						<InputGroupInput
							value={filename}
							onChange={onFilenameChange}
							placeholder={t("export-menu.filename-label")}
							aria-invalid={!!warning}
						/>
						<InputGroupAddon align="inline-end">
							<InputGroupText>.zip</InputGroupText>
						</InputGroupAddon>
					</InputGroup>
					{warning === "invalid" && <p className="text-xs text-destructive">{t("export-menu.filename-warning")}</p>}
					{warning === "empty" && <p className="text-xs text-destructive">{t("export-menu.filename-empty")}</p>}
				</div>
			)}
			<DialogFooter>
				<Button variant="outline" onClick={onClose}>
					{t("export-menu.cancel")}
				</Button>
				<Button onClick={handleDownload} disabled={downloadLoading}>
					{downloadLoading ? t("export-menu.validating") : t("export-menu.download")}
				</Button>
			</DialogFooter>
		</>
	);
}

function ValidationDialogContent({
	onClose,
	onNavigate,
	onExportAnyway,
}: {
	onClose: () => void;
	onNavigate: (filePath: string) => void;
	onExportAnyway: () => void;
}) {
	const { t } = useTranslation();
	const validationResults = useValidationStore((s) => s.results.resultsByPath);

	const allErrors: ValidationFileError[] = Object.entries(validationResults).flatMap(([filePath, results]) =>
		results.filter((r) => r.severity === "error").map((r) => ({ filePath, ...r })),
	);

	return (
		<>
			<DialogHeader>
				<DialogTitle>{t("export-menu.validation-title")}</DialogTitle>
			</DialogHeader>
			<div className="flex flex-col gap-2">
				<p className="text-xs text-muted-foreground">{t("export-menu.validation-message")}</p>
				<ValidationErrorList items={allErrors} onNavigate={onNavigate} />
			</div>
			<DialogFooter>
				<Button variant="outline" onClick={onClose}>
					{t("export-menu.validation-cancel")}
				</Button>
				<Button onClick={onExportAnyway}>{t("export-menu.export-anyway")}</Button>
			</DialogFooter>
		</>
	);
}

export function sanitizeFilename(name: string): string {
	let result = name.replace(/[^a-zA-Z0-9._-]/g, "-");
	result = result.replace(/-+/g, "-");
	result = result.replace(/^[-.]+|[-.]+$/g, "");
	result = result.slice(0, 200);
	return result || "export";
}
