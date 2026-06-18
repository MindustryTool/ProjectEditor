import { useState, useCallback, useMemo, useEffect, useRef, memo } from "react";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
	SelectGroup,
	SelectLabel,
	SelectSeparator,
} from "#/components/ui/select";
import { Label } from "#/components/ui/label";
import { ContentImage } from "#/components/editor/ContentImage";
import type { ContentEntry } from "@project/types";
import { useProjectContext } from "#/components/editor/ProjectContext";

const NONE = "none";

function EntriesDropdown({
	entries,
	value,
	onValueChange,
}: {
	entries: readonly ContentEntry[];
	value: string;
	onValueChange: (v: string) => void;
}) {
	const projectEntries = useMemo(() => entries.filter((e) => e.type === "project"), [entries]);
	const baseEntries = useMemo(() => entries.filter((e) => e.type === "base"), [entries]);

	return (
		<Select value={value} onValueChange={onValueChange}>
			<SelectTrigger className="w-full">
				<SelectValue placeholder="None" />
			</SelectTrigger>
			<SelectContent position="popper">
				<SelectGroup>
					<SelectItem value={NONE}>None</SelectItem>
				</SelectGroup>
				{baseEntries.length > 0 && (
					<>
						<SelectSeparator />
						<SelectGroup>
							<SelectLabel>Base</SelectLabel>
							{baseEntries.map((i) => (
								<SelectItem key={i.path} value={i.path}>
									<div className="flex items-center gap-2">
										<ContentImage entry={i} className="h-5 w-5 shrink-0" />
										<span>{i.name}</span>
									</div>
								</SelectItem>
							))}
						</SelectGroup>
					</>
				)}
				{projectEntries.length > 0 && (
					<>
						<SelectSeparator />
						<SelectGroup>
							<SelectLabel>Project</SelectLabel>
							{projectEntries.map((i) => (
								<SelectItem key={i.path} value={i.path}>
									<div className="flex items-center gap-2">
										<ContentImage entry={i} className="h-5 w-5 shrink-0" />
										<span>{i.name}</span>
									</div>
								</SelectItem>
							))}
						</SelectGroup>
					</>
				)}
			</SelectContent>
		</Select>
	);
}

function createHookSelector(useHook: () => readonly ContentEntry[]) {
	return memo(function HookSelector({ onContentReady }: { onContentReady: (fn: () => Promise<string>) => void }) {
		const entries = useHook();
		const [choice, setChoice] = useState(NONE);
		const entriesRef = useRef(entries);
		entriesRef.current = entries;

		const getContent = useCallback(async () => {
			if (choice === NONE) return "";
			const entry = entriesRef.current.find((e) => e.path === choice);
			if (entry?.type === "project") {
				// TODO: load project file
				return entry.path;
			}
			return "";
		}, [choice]);

		useEffect(() => {
			onContentReady(getContent);
		});

		const handleChange = useCallback((value: string) => {
			setChoice(value);
		}, []);

		return (
			<div className="space-y-2">
				<Label htmlFor="template">Template</Label>
				<EntriesDropdown entries={entries} value={choice} onValueChange={handleChange} />
			</div>
		);
	});
}

const ItemsSelector = createHookSelector(() => useProjectContext().contents.items);
const BlocksSelector = createHookSelector(() => useProjectContext().contents.blocks);
const UnitsSelector = createHookSelector(() => useProjectContext().contents.units);
const LiquidsSelector = createHookSelector(() => useProjectContext().contents.liquids);
const StatusesSelector = createHookSelector(() => useProjectContext().contents.statuses);
const SectorsSelector = createHookSelector(() => useProjectContext().contents.sectors);

export function TemplateSelector({
	type,
	onContentReady,
}: {
	type: string;
	onContentReady: (fn: () => Promise<string>) => void;
	name?: string;
}) {
	switch (type) {
		case "item":
			return <ItemsSelector onContentReady={onContentReady} />;
		case "block":
			return <BlocksSelector onContentReady={onContentReady} />;
		case "unit":
			return <UnitsSelector onContentReady={onContentReady} />;
		case "liquid":
			return <LiquidsSelector onContentReady={onContentReady} />;
		case "status":
			return <StatusesSelector onContentReady={onContentReady} />;
		case "sector":
			return <SectorsSelector onContentReady={onContentReady} />;
		default:
			return null;
	}
}
