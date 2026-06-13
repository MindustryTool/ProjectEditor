import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "#/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "#/components/ui/select";
import { Button } from "#/components/ui/button";
import { Label } from "#/components/ui/label";
import { InputGroup, InputGroupInput, InputGroupAddon } from "#/components/ui/input-group";
import { useCurrentProject } from "@project/core";

const contentTypes = new Set(["item", "block", "unit", "liquid", "status", "sector", "env-block", "effect"]);

const EXTENSION_MAP: Record<string, string> = {
	file: "",
	folder: "",
	item: ".hjson",
	block: ".hjson",
	unit: ".hjson",
	liquid: ".hjson",
	status: ".hjson",
	sector: ".hjson",
	"env-block": ".hjson",
	effect: ".hjson",
};

const CONTENT_FOLDER_MAP: Record<string, string> = {
	item: "content/items",
	block: "content/blocks",
	unit: "content/units",
	liquid: "content/liquids",
	status: "content/status",
	sector: "content/sectors",
	"env-block": "content/env-blocks",
	effect: "content/effects",
};

interface CreateFileDialogProps {
	targetPath: string | null;
	onClose: () => void;
	onSuccess: (path: string) => void;
}

export function CreateFileDialog({ targetPath, onClose, onSuccess }: CreateFileDialogProps) {
	const { t } = useTranslation();
	const context = useCurrentProject();
	const [name, setName] = useState("");
	const [type, setType] = useState("file");
	const [error, setError] = useState("");
	const [selectedContentFolder, setSelectedContentFolder] = useState("");
	const [folderOptions, setFolderOptions] = useState<string[]>([]);
	const [foldersLoading, setFoldersLoading] = useState(false);
	const fileInputRef = useRef<HTMLInputElement>(null);
	const [importing, setImporting] = useState(false);

	const isContentType = contentTypes.has(type);

	useEffect(() => {
		if (!isContentType) {
			setSelectedContentFolder("");
			setFolderOptions([]);
			return;
		}

		const rootFolder = CONTENT_FOLDER_MAP[type];
		if (!rootFolder) return;

		let cancelled = false;

		async function loadFolders() {
			setFoldersLoading(true);
			try {
				const entries = await context.fs.readdir(rootFolder!);
				if (cancelled) return;
				const subdirs = entries
					.filter((e) => e.kind === "directory")
					.map((e) => `${rootFolder!}/${e.name}`);
				const allFolders = [rootFolder!, ...subdirs];
				setFolderOptions(allFolders);
				if (allFolders.length === 1) {
					setSelectedContentFolder(allFolders[0]!);
				} else if (!allFolders.includes(selectedContentFolder)) {
					setSelectedContentFolder("");
				}
			} catch {
				if (cancelled) return;
				setFolderOptions([rootFolder!]);
				setSelectedContentFolder(rootFolder!);
			} finally {
				if (!cancelled) setFoldersLoading(false);
			}
		}

		loadFolders();

		return () => { cancelled = true; };
	}, [type, isContentType, context.fs]); // eslint-disable-line react-hooks/exhaustive-deps

	async function handleCreate() {
		const trimmed = name.trim();
		if (!trimmed) {
			setError(t("export-menu.filename-empty"));
			return;
		}
		setError("");

		const ext = EXTENSION_MAP[type] ?? "";
		const baseFolder = isContentType ? selectedContentFolder : (targetPath || "");
		const fullPath = `${baseFolder}/${trimmed}${ext}`;

		try {
			if (type === "folder") {
				await context.fs.mkdir(fullPath);
				onSuccess(fullPath);
			} else {
				await context.fs.writeTextFile(fullPath, "");
				onSuccess(fullPath);
			}
		} catch (err) {
			setError(err instanceof Error ? err.message : t("editor.file-explorer.create-dialog.create-failed"));
		}
	}

	async function handleImportFile(e: React.ChangeEvent<HTMLInputElement>) {
		const file = e.target.files?.[0];
		if (!file) return;

		setImporting(true);
		setError("");

		try {
			const text = await file.text();
			const baseFolder = isContentType ? selectedContentFolder : (targetPath || "");
			const fullPath = `${baseFolder}/${file.name}`;
			await context.fs.writeTextFile(fullPath, text);
			onSuccess(fullPath);
		} catch (err) {
			setError(err instanceof Error ? err.message : t("editor.file-explorer.create-dialog.import-failed"));
		} finally {
			setImporting(false);
			if (fileInputRef.current) fileInputRef.current.value = "";
		}
	}

	return (
		<Dialog
			open={targetPath !== null}
			onOpenChange={(open) => {
				if (!open) onClose();
			}}
		>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>{t("editor.create-new-file")}</DialogTitle>
					<DialogDescription>
						{t("editor.create-new-content-dialog.description")}
					</DialogDescription>
				</DialogHeader>
				<div className="space-y-4 h-full w-full">
					<div className="space-y-2">
						<Label htmlFor="name">{t("editor.file-explorer.create-dialog.name")}</Label>
						<InputGroup>
							<InputGroupInput id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder={t("editor.file-explorer.create-dialog.name-placeholder")} />
							{isContentType && <InputGroupAddon align="inline-end">{EXTENSION_MAP[type]}</InputGroupAddon>}
						</InputGroup>
					</div>
					<div className="space-y-2">
						<Label htmlFor="type">{t("editor.file-explorer.create-dialog.type")}</Label>
						<Select value={type} onValueChange={setType}>
							<SelectTrigger className="w-full">
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="file">{t("editor.file-explorer.create-dialog.type-file")}</SelectItem>
								<SelectItem value="folder">{t("editor.file-explorer.create-dialog.type-folder")}</SelectItem>
								<SelectItem value="item">{t("editor.file-explorer.create-dialog.type-item")}</SelectItem>
								<SelectItem value="block">{t("editor.file-explorer.create-dialog.type-block")}</SelectItem>
								<SelectItem value="unit">{t("editor.file-explorer.create-dialog.type-unit")}</SelectItem>
								<SelectItem value="liquid">{t("editor.file-explorer.create-dialog.type-liquid")}</SelectItem>
								<SelectItem value="status">{t("editor.file-explorer.create-dialog.type-status")}</SelectItem>
								<SelectItem value="sector">{t("editor.file-explorer.create-dialog.type-sector")}</SelectItem>
								<SelectItem value="env-block">{t("editor.file-explorer.create-dialog.type-env-block")}</SelectItem>
								<SelectItem value="effect">{t("editor.file-explorer.create-dialog.type-effect")}</SelectItem>
							</SelectContent>
						</Select>
					</div>
					{isContentType && (
						<div className="space-y-2">
							<Label htmlFor="content-folder">{t("editor.file-explorer.create-dialog.target-folder")}</Label>
							<Select value={selectedContentFolder} onValueChange={setSelectedContentFolder} disabled={foldersLoading}>
								<SelectTrigger className="w-full">
									<SelectValue placeholder={foldersLoading ? t("editor.file-explorer.create-dialog.loading") : t("editor.file-explorer.create-dialog.select-folder")} />
								</SelectTrigger>
								<SelectContent>
									{folderOptions.map((folder) => (
										<SelectItem key={folder} value={folder}>{folder}</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
					)}
					{error && <p className="text-sm text-red-400">{error}</p>}
					<DialogFooter className="gap-2">
						<input
							ref={fileInputRef}
							type="file"
							className="hidden"
							onChange={handleImportFile}
						/>
						<Button
							variant="outline"
							onClick={() => fileInputRef.current?.click()}
							disabled={importing || (isContentType && !selectedContentFolder)}
						>
							{t("editor.file-explorer.create-dialog.import-file")}
						</Button>
						<Button variant="outline" onClick={onClose}>
							{t("editor.create-new-content-dialog.cancel")}
						</Button>
						<Button onClick={handleCreate} disabled={isContentType && !selectedContentFolder}>
							{t("editor.create-new-content-dialog.create")}
						</Button>
					</DialogFooter>
				</div>
			</DialogContent>
		</Dialog>
	);
}
