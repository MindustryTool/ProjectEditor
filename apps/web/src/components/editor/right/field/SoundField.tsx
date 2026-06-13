import { FieldControl, Field } from "#/components/editor/right/field/Field";
import { hasNullableWrapper } from "@project/schema";
import React, { useCallback, useMemo, useState } from "react";
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
import { cn, levenshtein } from "#/lib/utils";
import { InputGroup, InputGroupAddon, InputGroupInput } from "#/components/ui/input-group";

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
		if (sound.type === "project") {
			const file = await useProjectSession.getState().projectContext?.fs.readFile(sound.path);
			if (file) {
				const blob = new Blob([file], { type: "audio/mp3" });
				const audioUrl = URL.createObjectURL(blob);
				const audio = new Audio();
				audio.src = audioUrl;

				audio.play();
				audio.onended = () => {
					URL.revokeObjectURL(audioUrl);
				};
			}
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
				<Dialog>
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
										<div
											className={cn("flex items-center justify-between gap-2 cursor-pointer px-3 py-0.5 border rounded-md", {
												"bg-emerald-400/50": sound.type === "project",
												"bg-purple-400/50": sound.type === "base",
											})}
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
