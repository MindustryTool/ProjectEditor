import React, { useCallback } from "react";
import { ChevronRight, Clipboard, Copy, MoreHorizontal } from "lucide-react";
import { Button } from "#/components/ui/button";
import { SchemaLabel } from "#/components/editor/right/field/SchemaLabel";
import type { SchemaRendererProps } from "#/components/editor/right/field/types";
import { useProjectSession } from "@project/core";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "#/components/ui/dropdown-menu";
import { toast } from "sonner";
import { HJSON } from "@project/hjson";
import * as v from "valibot";
import { FieldIssue } from "#/components/editor/right/field/FieldIssue";

export const ObjectField = React.memo(function ObjectField({
	name,
	jsonPath,
	path,
	metadata,
	value,
	entrySchema,
	onChange,
}: SchemaRendererProps) {
	const setCurrentJsonPath = useProjectSession((s) => s.setCurrentJsonPath);

	const handleEllipsisClick = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
		event.stopPropagation();
	}, []);

	const handleCopy = useCallback(
		(event: React.MouseEvent<HTMLDivElement>) => {
			event.stopPropagation();
			if (value) {
				const content = HJSON.stringify(value, null, 2);
				navigator.clipboard.writeText(content);
				toast.success(content);
			}
		},
		[value],
	);

	const handlePaste = useCallback(
		async (event: React.MouseEvent<HTMLDivElement>) => {
			event.stopPropagation();
			const content = await navigator.clipboard.readText();
			const value = HJSON.parse(content);
			const parsed = v.safeParse(entrySchema, value);
			if (parsed.success) {
				onChange(jsonPath, (parent, original, key) => parent.patchValue(original, key, value));
			} else {
				toast.error(JSON.stringify(v.flatten(parsed.issues)));
			}
		},
		[entrySchema, jsonPath, onChange],
	);

	return (
		<div className="grid gap-1 w-full">
			<Button variant="secondary" className="flex border border-input justify-start items-center gap-2 flex-99 min-h-9" asChild>
				<div onClick={() => setCurrentJsonPath(jsonPath)}>
					<ChevronRight className="size-4 shrink-0" />
					<SchemaLabel name={name} metadata={metadata} />
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button className="ml-auto" variant="ghost" size="icon" onClick={handleEllipsisClick}>
								<MoreHorizontal />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent>
							<DropdownMenuItem onClick={handleCopy}>
								<Copy />
								Copy
							</DropdownMenuItem>
							<DropdownMenuItem onClick={handlePaste}>
								<Clipboard />
								Paste
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</Button>
			<FieldIssue path={path} jsonPath={jsonPath} showChildErrors />
		</div>
	);
});
