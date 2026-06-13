import { FieldControl, Field } from "#/components/editor/right/field/Field";
import { hasNullableWrapper } from "@project/schema";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
import { Progress } from "#/components/ui/progress";

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
	const [playingName, setPlayingName] = useState<string | null>(null);
	const [progress, setProgress] = useState(0);
	const audioRef = useRef<HTMLAudioElement | null>(null);
	const playIdRef = useRef(0);

	useEffect(() => {
		return () => {
			if (audioRef.current) {
				audioRef.current.pause();
				audioRef.current.src = "";
				audioRef.current = null;
			}
		};
	}, []);

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

	const handlePlaySound = useCallback(async (sound: ContentEntry) => {
		const id = ++playIdRef.current;
		if (audioRef.current) {
			audioRef.current.pause();
			audioRef.current.src = "";
			audioRef.current.onended = null;
			audioRef.current.ontimeupdate = null;
			audioRef.current = null;
		}
		setProgress(0);
		setPlayingName(sound.name);

		const audio = new Audio();

		audio.ontimeupdate = () => {
			if (audio.duration && isFinite(audio.duration)) {
				setProgress((audio.currentTime / audio.duration) * 100);
			}
		};
		audio.onended = () => {
			if (playIdRef.current !== id) return;
			setPlayingName(null);
			setProgress(0);
			audioRef.current = null;
		};

		if (sound.type === "project") {
			const file = await useProjectSession.getState().projectContext?.fs.readFile(sound.path);
			if (id !== playIdRef.current) return;
			if (file) {
				const blob = new Blob([file], { type: "audio/mp3" });
				const audioUrl = URL.createObjectURL(blob);
				audio.src = audioUrl;
				audioRef.current = audio;
				audio.play();
				audio.onended = () => {
					URL.revokeObjectURL(audioUrl);
					if (playIdRef.current !== id) return;
					setPlayingName(null);
					setProgress(0);
					audioRef.current = null;
				};
			} else {
				setPlayingName(null);
			}
		} else {
			const downloadUrl = `https://raw.githubusercontent.com/Anuken/Mindustry/master/core/assets/${sound.path}`;
			audio.src = downloadUrl;
			audioRef.current = audio;
			audio.play();
		}
	}, []);

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
									<DialogClose key={sound.name} asChild>
										<div id={`sound-${sound.name}`} className="border rounded-md">
											<div
												className="flex items-center justify-between gap-2 cursor-pointer px-3 py-0.5 hover:bg-accent"
												onClick={() => handleChange(sound.name)}
											>
												<span>{sound.name}</span>
												<Button
													onClick={(event) => {
														event.stopPropagation();
														event.preventDefault();
														handlePlaySound(sound);
													}}
													variant="ghost"
												>
													<Play className="size-4" />
												</Button>
											</div>
											{playingName === sound.name && (
												<div className="px-3 pb-1.5">
													<Progress value={progress} className="h-0.5" />
												</div>
											)}
										</div>
									</DialogClose>
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
