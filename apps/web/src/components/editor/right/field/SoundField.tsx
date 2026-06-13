import { FieldControl, Field } from "#/components/editor/right/field/Field";
import { hasNullableWrapper } from "@project/schema";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { FieldIssue } from "./FieldIssue";
import { SchemaDescription } from "./SchemaDescription";
import { SchemaLabel } from "./SchemaLabel";
import { getSchemaMetadata } from "@project/schema";
import type { SchemaRendererProps } from "#/components/editor/right/field/types";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "#/components/ui/dialog";
import { Button } from "#/components/ui/button";
import { VisuallyHidden } from "radix-ui";
import { useSounds } from "#/hooks/use-sounds";
import type { ContentEntry } from "@project/types";
import { ChevronDown, Play, Search } from "lucide-react";
import { useProjectSession } from "@project/core";
import { levenshtein } from "#/lib/utils";
import { InputGroup, InputGroupAddon, InputGroupInput } from "#/components/ui/input-group";

interface SoundItemProps {
	sound: ContentEntry;
	handleChange: (name: string) => void;
}

const SoundItem = React.memo(function SoundItem({ sound, handleChange }: SoundItemProps) {
	const [isPlaying, setIsPlaying] = useState(false);
	const [progress, setProgress] = useState(0);

	const handlePlay = useCallback(
		async (event: React.MouseEvent) => {
			event.stopPropagation();
			event.preventDefault();

			setIsPlaying(true);
			setProgress(0);

			const audio = new Audio();
			let rafId: number;

			const animate = () => {
				if (audio.duration && isFinite(audio.duration)) {
					setProgress((audio.currentTime / audio.duration) * 100);
				}
				rafId = requestAnimationFrame(animate);
			};

			rafId = requestAnimationFrame(animate);

			const stop = () => {
				cancelAnimationFrame(rafId);
				setIsPlaying(false);
				setProgress(0);
			};

			audio.onended = stop;

			if (sound.type === "project") {
				const file = await useProjectSession.getState().projectContext?.fs.readFile(sound.path);
				if (file) {
					const blob = new Blob([file], { type: "audio/mp3" });
					const audioUrl = URL.createObjectURL(blob);
					audio.src = audioUrl;
					audio.play();
					audio.onended = () => {
						URL.revokeObjectURL(audioUrl);
						stop();
					};
				} else {
					stop();
				}
			} else {
				const downloadUrl = `https://raw.githubusercontent.com/Anuken/Mindustry/master/core/assets/${sound.path}`;
				audio.src = downloadUrl;
				audio.play();
			}
		},
		[sound],
	);

	return (
		<DialogClose asChild>
			<div
				id={`sound-${sound.name}`}
				className="border cursor-pointer px-3 py-0.5 rounded-md overflow-hidden hover:bg-accent"
			>
				<div className="flex items-center justify-between gap-2" onClick={() => handleChange(sound.name)}>
					<span>{sound.name}</span>
					<Button onClick={handlePlay} variant="ghost">
						<Play className="size-4" />
					</Button>
				</div>
				{isPlaying && (
					<div className="relative flex h-1 w-full items-center overflow-x-hidden rounded-full bg-background">
						<div
							className="size-full flex-1 bg-primary transition-transform duration-150 ease-linear"
							style={{ transform: `translateX(-${100 - progress}%)` }}
						/>
					</div>
				)}
			</div>
		</DialogClose>
	);
});

export const SoundField = React.memo(function SoundField({
	name,
	value,
	onChange,
	entrySchema,
	jsonPath,
	path,
	defaultValue,
}: SchemaRendererProps) {
	const soundValue = typeof value === "string" ? value : String(value ? JSON.stringify(value) : defaultValue || "");
	const metadata = useMemo(() => getSchemaMetadata(entrySchema), [entrySchema]);
	const sounds = useSounds();
	const [filter, setFilter] = useState("");
	const [dialogOpen, setDialogOpen] = useState(false);

	useEffect(() => {
		if (dialogOpen && soundValue) {
			requestAnimationFrame(() => {
				document.getElementById(`sound-${soundValue}`)?.scrollIntoView({ block: "nearest" });
			});
		}
	}, [dialogOpen, soundValue]);

	const handleChange = useCallback(
		(name: string) => {
			const isDefault = name === defaultValue;
			const isNullable = hasNullableWrapper(entrySchema);

			if (name === "" || (isDefault && !isNullable)) {
				onChange(jsonPath, (parent, original, key) => parent.patchRemove(original, key));
				return;
			}
			onChange(jsonPath, (parent, original, key) => parent.patchValue(original, key, name));
		},
		[defaultValue, entrySchema, jsonPath, onChange],
	);

	const filteredSounds = useMemo(() => {
		if (filter) {
			return levenshtein(sounds, (sound) => sound.name, filter, 30);
		}

		return sounds.sort((a, b) => a.name.localeCompare(b.name));
	}, [filter, sounds]);

	return (
		<Field jsonPath={jsonPath} metadata={metadata}>
			<SchemaLabel name={name} metadata={metadata} />
			<FieldControl>
				<Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
					<DialogTrigger asChild>
						<Button className="w-full justify-between" variant="outline">
							<span>{soundValue || <span className="text-muted-foreground">None</span>}</span>
							<ChevronDown className="size-4" />
						</Button>
					</DialogTrigger>
					<DialogContent showCloseButton={false}>
						<VisuallyHidden.Root>
							<DialogTitle></DialogTitle>
							<DialogDescription></DialogDescription>
						</VisuallyHidden.Root>
						<div className="max-h-[50dvh] flex flex-col space-y-2">
							<InputGroup>
								<InputGroupAddon>
									<Search className="size-4" />
								</InputGroupAddon>
								<InputGroupInput
									placeholder="mod.hjson"
									value={filter}
									onChange={(e) => {
										setFilter(e.target.value);
									}}
								/>
							</InputGroup>
							<div className="overflow-y-auto space-y-1 h-full">
								{filteredSounds.map((sound) => (
									<SoundItem key={sound.name} sound={sound} handleChange={handleChange} />
								))}
							</div>
						</div>
					</DialogContent>
				</Dialog>
			</FieldControl>
			<SchemaDescription metadata={metadata} />
			<FieldIssue path={path} jsonPath={jsonPath} />
		</Field>
	);
});
