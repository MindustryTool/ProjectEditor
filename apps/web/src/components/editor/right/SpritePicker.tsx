import { useCallback, useRef } from "react";
import { useCurrentProject, useProjectSession, useFile } from "@project/core";
import { Button } from "#/components/ui/button";
import { FormControl, FormField, FormLabel } from "#/components/ui/form";
import { resolveContentSprite } from "@project/utils";
import { File, Trash2, Upload } from "lucide-react";
import { getImageUrl } from "#/lib/utils";

interface SpritePickerProps {
	path: string;
}

export function SpritePicker({ path }: SpritePickerProps) {
	const spritePath = resolveContentSprite(path);
	const treeSnapshot = useProjectSession((s) => s.treeSnapshot);
	const exists = spritePath !== null && treeSnapshot.getEntry(spritePath) !== undefined;

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
	const { data, isLoading, isError, error, write } = useFile(spritePath);
	const inputRef = useRef<HTMLInputElement>(null);

	const handleReplace = useCallback(() => {
		inputRef.current?.click();
	}, []);

	const handleFileChange = useCallback(
		async (e: React.ChangeEvent<HTMLInputElement>) => {
			const file = e.target.files?.[0];
			if (!file) return;
			const buf = await file.arrayBuffer();
			write(buf);
			e.target.value = "";
		},
		[write],
	);

	const handleRemove = useCallback(async () => {
		await fs.delete(spritePath);
	}, [fs, spritePath]);

	if (isLoading) {
		return <p className="text-sm text-muted-foreground aspect-square">Loading sprite...</p>;
	}

	if (isError) {
		return (
			<div className="flex flex-col items-center gap-3 py-4">
				<File className="text-destructive w-16 h-16" strokeWidth={1} />
				<p className="text-sm text-destructive">{error}</p>
			</div>
		);
	}

	if (!data || data.byteLength === 0) {
		return <SpriteUploader path={spritePath} />;
	}

	const objectUrl = getImageUrl(data);

	return (
		<div className="relative">
			<img
				className="object-contain p-2 w-full rounded border border-border [image-rendering:pixelated]"
				src={objectUrl}
				alt={spritePath}
			/>
			<div className="backdrop-blur-sm justify-end flex gap-1 py-1">
				<Button className="bg-transparent" variant="outline" size="icon" aria-label="Replace sprite" onClick={handleReplace}>
					<Upload className="w-4 h-4" />
				</Button>
				<Button
					className="bg-transparent text-destructive"
					variant="outline"
					size="icon"
					aria-label="Remove sprite"
					onClick={handleRemove}
				>
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
			<Button variant="outline" size="icon-lg" aria-label="Upload sprite" onClick={handleClick}>
				<Upload className="w-4 h-4" />
			</Button>
			<input ref={inputRef} type="file" accept=".png" className="hidden" onChange={handleFileChange} />
		</div>
	);
}
