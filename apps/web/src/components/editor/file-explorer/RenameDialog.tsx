import { useState, useMemo, useEffect, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "#/components/ui/dialog";
import { Button } from "#/components/ui/button";
import { Input } from "#/components/ui/input";
import { useCurrentProject, useProjectSession } from "@project/core";

const INVALID_FILENAME_CHARS = /[/\\:*?"<>|]/;

function getItemType(path: string): string {
	const parts = path.split("/");
	return parts[parts.length - 1]?.includes(".") ? "File" : "Folder";
}

function getItemName(path: string): string {
	const parts = path.split("/");
	return parts[parts.length - 1] ?? "";
}

function getItemDir(path: string): string {
	const lastSlash = path.lastIndexOf("/");
	return lastSlash >= 0 ? path.slice(0, lastSlash) : "";
}

interface RenameDialogProps {
	targetPath: string | null;
	onClose: () => void;
}

export function RenameDialog({ targetPath, onClose }: RenameDialogProps) {
	const context = useCurrentProject();
	const selectedPath = useProjectSession((s) => s.selectedPath);
	const setSelectedPath = useProjectSession((s) => s.setSelectedPath);

	const itemName = useMemo(() => (targetPath ? getItemName(targetPath) : ""), [targetPath]);
	const itemDir = useMemo(() => (targetPath ? getItemDir(targetPath) : ""), [targetPath]);
	const itemType = useMemo(() => (targetPath ? getItemType(targetPath) : "File"), [targetPath]);
	const isFolder = !itemName.includes(".");

	const [name, setName] = useState(itemName);
	const [error, setError] = useState("");
	const [saving, setSaving] = useState(false);
	const inputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		setName(itemName);
		setError("");
		setSaving(false);
	}, [itemName]);

	useEffect(() => {
		if (targetPath && inputRef.current) {
			inputRef.current.focus();
			if (isFolder) {
				inputRef.current.select();
			} else {
				const dotIndex = itemName.lastIndexOf(".");
				if (dotIndex > 0) {
					inputRef.current.setSelectionRange(0, dotIndex);
				} else {
					inputRef.current.select();
				}
			}
		}
	}, [targetPath, itemName, isFolder]);

	function validate(value: string): string {
		const trimmed = value.trim();
		if (!trimmed) return "Name cannot be empty";
		if (INVALID_FILENAME_CHARS.test(trimmed)) return "Name contains invalid characters";
		return "";
	}

	async function handleSave() {
		const trimmed = name.trim();
		const validationError = validate(name);
		if (validationError) {
			setError(validationError);
			return;
		}
		if (trimmed === itemName) {
			onClose();
			return;
		}

		setError("");
		setSaving(true);

		const newPath = itemDir ? `${itemDir}/${trimmed}` : trimmed;

		try {
			await context.fs.rename(targetPath!, newPath);
			if (selectedPath === targetPath) setSelectedPath(newPath);
			onClose();
		} catch (err) {
			setError(err instanceof Error ? err.message : "Rename failed");
		} finally {
			setSaving(false);
		}
	}

	function handleKeyDown(e: React.KeyboardEvent) {
		if (e.key === "Enter") {
			e.preventDefault();
			handleSave();
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
					<DialogTitle>Rename {itemType}</DialogTitle>
				</DialogHeader>
				<div className="space-y-4">
					<Input
						ref={inputRef}
						value={name}
						onChange={(e) => {
							setName(e.target.value);
							setError("");
						}}
						onKeyDown={handleKeyDown}
						placeholder="Enter new name"
					/>
					{error && <p className="text-sm text-red-400">{error}</p>}
				</div>
				<DialogFooter className="gap-2">
					<Button variant="outline" onClick={onClose} disabled={saving}>
						Cancel
					</Button>
					<Button onClick={handleSave} disabled={saving || !name.trim()}>
						{saving ? "Saving..." : "Save"}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
