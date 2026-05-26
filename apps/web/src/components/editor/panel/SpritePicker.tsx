import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useCurrentProject, useProjectSession } from "@project/state";
import { Button } from "#/components/ui/button";
import { FormControl, FormField, FormLabel } from "#/components/ui/form";
import { resolveContentSprite, findFileInTree } from "~/lib/utils";
import { File, Trash2, Upload } from "lucide-react";

interface SpritePickerProps {
	path: string;
}

export function SpritePicker({ path }: SpritePickerProps) {
	const spritePath = resolveContentSprite(path);
	const treeSnapshot = useProjectSession((s) => s.treeSnapshot);
	const exists = spritePath !== null && findFileInTree(treeSnapshot, spritePath) !== null;

	if (spritePath === null) {
		return <p className="text-sm text-muted-foreground">Not a content JSON file</p>;
	}

	return (
		<FormField>
			<FormLabel>Sprite</FormLabel>
			<FormControl>{exists ? <SpriteViewer path={spritePath} /> : <SpriteUploader path={spritePath} />}</FormControl>
		</FormField>
	);
}

function SpriteViewer({ path: spritePath }: { path: string }) {
	const { fs } = useCurrentProject();
	const [data, setData] = useState<ArrayBuffer | null>(null);
	const [status, setStatus] = useState<"loading" | "loaded" | "error">("loading");
	const [error, setError] = useState<string | null>(null);
	const inputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		let cancelled = false;
		setStatus("loading");
		setError(null);

		fs.readFile(spritePath)
			.then((buf) => {
				if (cancelled) return;
				setData(buf);
				setStatus("loaded");
			})
			.catch((e) => {
				if (cancelled) return;
				setError(e instanceof Error ? e.message : "Failed to load sprite");
				setStatus("error");
			});

		return () => {
			cancelled = true;
		};
	}, [fs, spritePath]);

	const objectUrl = useMemo(() => {
		if (!data) return null;
		const blob = new Blob([data], { type: "image/png" });
		return URL.createObjectURL(blob);
	}, [data]);

	useEffect(() => {
		return () => {
			if (objectUrl) URL.revokeObjectURL(objectUrl);
		};
	}, [objectUrl]);

	const handleReplace = useCallback(() => {
		inputRef.current?.click();
	}, []);

	const handleFileChange = useCallback(
		async (e: React.ChangeEvent<HTMLInputElement>) => {
			const file = e.target.files?.[0];
			if (!file) return;

			const buf = await file.arrayBuffer();
			await fs.writeFile(spritePath, buf);
			setData(buf);
			e.target.value = "";
		},
		[fs, spritePath],
	);

	const handleRemove = useCallback(async () => {
		await fs.delete(spritePath);
		setData(null);
	}, [fs, spritePath]);

	if (status === "loading") {
		return <p className="text-sm text-muted-foreground">Loading sprite...</p>;
	}

	if (status === "error") {
		return (
			<div className="flex flex-col items-center gap-3 py-4">
				<File className="text-destructive w-16 h-16" strokeWidth={1} />
				<p className="text-sm text-destructive">{error}</p>
			</div>
		);
	}

	return (
		<div className="relative">
			{objectUrl && (
				<img className="object-contain w-full rounded border border-border" src={objectUrl} alt={spritePath} />
			)}
			<div className="backdrop-blur-sm bg-background/20 justify-end flex gap-1 p-1">
				<Button variant="ghost" size="icon" aria-label="Replace sprite" onClick={handleReplace}>
					<Upload className="w-4 h-4" />
				</Button>
				<Button variant="ghost" size="icon" aria-label="Remove sprite" onClick={handleRemove}>
					<Trash2 className="w-4 h-4" />
				</Button>
			</div>
			<input ref={inputRef} type="file" accept=".png" className="hidden" onChange={handleFileChange} />
		</div>
	);
}

function SpriteUploader({ path: spritePath }: { path: string }) {
	const { fs } = useCurrentProject();
	const inputRef = useRef<HTMLInputElement>(null);

	const handleClick = useCallback(() => {
		inputRef.current?.click();
	}, []);

	const handleFileChange = useCallback(
		async (e: React.ChangeEvent<HTMLInputElement>) => {
			const file = e.target.files?.[0];
			if (!file) return;

			const buf = await file.arrayBuffer();
			await fs.writeFile(spritePath, buf);
			e.target.value = "";
		},
		[fs, spritePath],
	);

	return (
		<div className="flex flex-col items-center gap-3 py-4">
			<File className="text-muted-foreground w-16 h-16" strokeWidth={1} />
			<p className="text-sm text-muted-foreground">No sprite set</p>
			<Button variant="ghost" size="icon" aria-label="Upload sprite" onClick={handleClick}>
				<Upload className="w-4 h-4" />
			</Button>
			<input ref={inputRef} type="file" accept=".png" className="hidden" onChange={handleFileChange} />
		</div>
	);
}
