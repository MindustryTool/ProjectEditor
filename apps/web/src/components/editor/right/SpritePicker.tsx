import { useCallback, useRef, useState } from "react";
import { useCurrentProject, useProjectSession, useFile } from "@project/core";
import { Button } from "#/components/ui/button";
import { FormControl, FormField, FormLabel } from "#/components/ui/form";
import { resolveContentSprite } from "@project/utils";
import { File, Search, Trash2, Upload } from "lucide-react";
import { getImageUrl, levenshtein } from "#/lib/utils";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "#/components/ui/dropdown-menu";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "#/components/ui/dialog";
import { InputGroup, InputGroupAddon, InputGroupInput } from "#/components/ui/input-group";
import { VisuallyHidden } from "radix-ui";
import { FileIcon } from "#/components/editor/FileIcon";

interface SpritePickerProps {
	path: string;
}

export function SpritePicker({ path }: SpritePickerProps) {
	const existingPath = useProjectSession((s) => s.treeSnapshot.findContentSpritePath(path));
	const spritePath = existingPath || resolveContentSprite(path);

	if (spritePath === null) {
		return <p className="text-sm text-muted-foreground">Not a content JSON file</p>;
	}

	return (
		<FormField>
			<FormLabel>Sprite</FormLabel>
			<FormControl>{existingPath ? <SpriteViewer path={spritePath} /> : <SpriteUploader path={spritePath} />}</FormControl>
		</FormField>
	);
}

export function SpriteViewer({ path: spritePath }: { path: string }) {
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
				className="object-contain p-2 w-full max-h-60 rounded-md border border-border [image-rendering:pixelated]"
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

export function SpriteUploader({ path: spritePath }: { path: string }) {
	const { write } = useFile(spritePath);
	const inputRef = useRef<HTMLInputElement>(null);

	const handleClick = useCallback(() => {
		inputRef.current?.click();
	}, []);

	const handleFileChange = useCallback(
		async (e: React.ChangeEvent<HTMLInputElement>) => {
			const file = e.target.files?.[0];
			if (!file) return;

			const buf = await file.arrayBuffer();
			await write(buf);
			e.target.value = "";
		},
		[write],
	);

	const onSelect = useCallback(
		async (path: string) => {
			const fs = useProjectSession.getState().projectContext?.fs;
			if (!fs) return;
			const buf = await fs.readFile(path);
			if (!buf) return;
			await write(buf);
		},
		[write],
	);

	return (
		<DropdownMenu>
			<Dialog>
				<DropdownMenuTrigger asChild>
					<Button className="ml-auto w-full justify-between cursor-pointer" variant="outline" aria-label="Upload sprite">
						<p className="text-sm text-muted-foreground">No sprite set</p>
						<Upload className="size-4 ml-auto" />
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent>
					<DropdownMenuItem>
						<DialogTrigger>Local file</DialogTrigger>
					</DropdownMenuItem>
					<DropdownMenuItem onClick={handleClick}>Import file</DropdownMenuItem>
				</DropdownMenuContent>
				<input ref={inputRef} type="file" accept=".png" className="hidden w-0" onChange={handleFileChange} />
				<DialogContent>
					<DialogTitle>Files</DialogTitle>
					<VisuallyHidden.Root>
						<DialogDescription />
					</VisuallyHidden.Root>
					<SelectFileDialog onSelect={onSelect} />
				</DialogContent>
			</Dialog>
		</DropdownMenu>
	);
}

function SelectFileDialog({ onSelect }: { onSelect: (path: string) => void }) {
	const [filter, setFilter] = useState("");
	const treeSnapshot = useProjectSession((s) => s.treeSnapshot);
	const [cursor, setCursor] = useState(100);

	return (
		<>
			<InputGroup className="sticky top-0 backdrop-blur-sm">
				<InputGroupAddon>
					<Search className="size-4" />
				</InputGroupAddon>
				<InputGroupInput
					placeholder="mod.hjson"
					value={filter}
					onChange={(e) => {
						setFilter(e.target.value);
						setCursor(100);
					}}
				/>
			</InputGroup>
			<div
				className="space-y-2 h-full overflow-y-auto"
				onScroll={(event) => {
					if (event.currentTarget.scrollHeight - (event.currentTarget.scrollTop + event.currentTarget.clientHeight) < 100) {
						setCursor((prev) => prev + 100);
					}
				}}
			>
				{levenshtein(
					treeSnapshot.getEntries().filter((f) => f.name.endsWith(".png")),
					(entry) => entry.path,
					filter,
				)
					.slice(0, cursor)
					.map((item) => (
						<DialogClose
							key={item.path}
							className="w-full rounded-md border py-2 px-1 flex gap-2 items-center justify-start text-nowrap cursor-pointer bg-accent"
							onClick={() => {
								onSelect(item.path);
							}}
						>
							<FileIcon path={item.path} />
							<span className="w-full overflow-hidden text-ellipsis text-start text-xs">{item.path}</span>
						</DialogClose>
					))}
			</div>
		</>
	);
}
