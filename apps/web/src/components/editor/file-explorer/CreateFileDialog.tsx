import { useState, useRef, useCallback } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "#/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "#/components/ui/select";
import { Button } from "#/components/ui/button";
import { Label } from "#/components/ui/label";
import { InputGroup, InputGroupInput, InputGroupAddon } from "#/components/ui/input-group";
import { useCurrentProject } from "@project/core";
import { TemplateSelector } from "#/components/editor/left/TemplateSelector";

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

interface CreateFileDialogProps {
	targetPath: string | null;
	onClose: () => void;
	onSuccess: (path: string) => void;
}

export function CreateFileDialog({ targetPath, onClose, onSuccess }: CreateFileDialogProps) {
	const context = useCurrentProject();
	const [name, setName] = useState("");
	const [type, setType] = useState("file");
	const [error, setError] = useState("");

	const isContentType = contentTypes.has(type);
	const getTemplateContentRef = useRef<() => Promise<string>>(async () => "");
	const handleGetTemplateContent = useCallback(async () => getTemplateContentRef.current(), []);
	const handleSetTemplateContent = useCallback((fn: () => Promise<string>) => {
		getTemplateContentRef.current = fn;
	}, []);

	async function handleCreate() {
		const trimmed = name.trim();
		if (!trimmed) {
			setError("Name cannot be empty");
			return;
		}
		setError("");

		const ext = EXTENSION_MAP[type] ?? "";
		const fullPath = `${targetPath || ""}/${trimmed}${ext}`;

		try {
			if (type === "folder") {
				await context.fs.mkdir(fullPath);
				onSuccess(fullPath);
			} else {
				const content = await handleGetTemplateContent();
				await context.fs.writeTextFile(fullPath, content);
				onSuccess(fullPath);
			}
		} catch (err) {
			setError(err instanceof Error ? err.message : "Failed to create");
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
					<DialogTitle>Create New</DialogTitle>
					<DialogDescription>Create a new file or folder in {targetPath || "project root"}.</DialogDescription>
				</DialogHeader>
				<div className="space-y-4 h-full w-full">
					<div className="space-y-2">
						<Label htmlFor="name">Name</Label>
						<InputGroup>
							<InputGroupInput id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter name" />
							{isContentType && <InputGroupAddon align="inline-end">{EXTENSION_MAP[type]}</InputGroupAddon>}
						</InputGroup>
					</div>
					<div className="space-y-2">
						<Label htmlFor="type">Type</Label>
						<Select value={type} onValueChange={setType}>
							<SelectTrigger className="w-full">
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="file">File</SelectItem>
								<SelectItem value="folder">Folder</SelectItem>
								<SelectItem value="item">Item</SelectItem>
								<SelectItem value="block">Block</SelectItem>
								<SelectItem value="unit">Unit</SelectItem>
								<SelectItem value="liquid">Liquid</SelectItem>
								<SelectItem value="status">Status</SelectItem>
								<SelectItem value="sector">Sector</SelectItem>
								<SelectItem value="env-block">Env Block</SelectItem>
								<SelectItem value="effect">Effect</SelectItem>
							</SelectContent>
						</Select>
					</div>
					{isContentType && <TemplateSelector type={type} name={name} onContentReady={handleSetTemplateContent} />}
					{error && <p className="text-sm text-red-400">{error}</p>}
					<DialogFooter>
						<Button variant="outline" onClick={onClose}>
							Cancel
						</Button>
						<Button onClick={handleCreate}>Create</Button>
					</DialogFooter>
				</div>
			</DialogContent>
		</Dialog>
	);
}
