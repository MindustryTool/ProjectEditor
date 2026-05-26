import { useCurrentProject } from "@project/state";
import React, { useEffect, type ReactNode } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useQueryState } from "nuqs";
import { File, Folder } from "lucide-react";
import { cn, resolveContentSprite } from "~/lib/utils";
import { Button } from "#/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogTitle, DialogTrigger } from "#/components/ui/dialog";
import { InputGroup, InputGroupInput, InputGroupAddon, InputGroupText } from "#/components/ui/input-group";
import { Plus } from "lucide-react";
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";

export function ContentList({ path }: { path: string }) {
	const context = useCurrentProject();
	const queryClient = useQueryClient();
	const [, setPath] = useQueryState("path");

	const { data, isLoading, isError, error } = useQuery({
		queryKey: ["files", path],
		queryFn: () => context.fs.listFiles(path),
		refetchOnMount: "always",
	});

	useEffect(() => {
		context.events.on("file:changed", () => {
			queryClient.invalidateQueries({ queryKey: ["files", path] });
		});
	}, [path]);

	if (isLoading) {
		return null;
	}

	if (isError) {
		return <div>{error.message}</div>;
	}

	return (
		<div className="grid grid-cols-[repeat(auto-fill,minmax(100px,1fr))] gap-2 p-2 w-full mb-auto">
			<CreateNewContentDialog />
			{data?.map((entry) => (
				<Item key={entry.path} onClick={() => setPath(entry.path)}>
					<ItemPreview>
						{entry.kind === "directory" ? (
							<Folder className="text-amber-500 w-full h-full" strokeWidth={1} />
						) : entry.name.endsWith(".json") ? (
							<SpritePreview path={entry.path} />
						) : (
							<File className="text-muted-foreground w-full h-full" strokeWidth={1} />
						)}
					</ItemPreview>
					<ItemName>{entry.name}</ItemName>
				</Item>
			))}
		</div>
	);
}

function SpritePreview({ path }: { path: string }) {
	const [error, setError] = useState<boolean>();
	const src = resolveContentSprite(path);

	if (error || src === null) {
		return <File className="text-muted-foreground w-full h-full" strokeWidth={1} />;
	}

	return <img className="object-contain text-xs w-full h-full" src={src} alt={path} onError={() => setError(true)} />;
}

function Item({ className, children, ...props }: React.ComponentProps<"button">) {
	return (
		<button className={cn("flex flex-col items-center gap-0.5", className)} {...props}>
			{children}
		</button>
	);
}

function ItemPreview({ children }: { children: ReactNode }) {
	return (
		<div className="flex flex-col w-full items-center rounded-md bg-background border border-border p-2 aspect-square hover:bg-accent transition-colors">
			{children}
		</div>
	);
}

function ItemName({ children }: { children: ReactNode }) {
	return <span className="text-xs text-center truncate w-full">{children}</span>;
}

export function CreateNewContentDialog() {
	const { t } = useTranslation();
	const [name, setName] = useState("");
	const context = useCurrentProject();
	const [path, setPath] = useQueryState("path");

	const handleCreate = useCallback(() => {
		if (name.length === 0) {
			return;
		}

		const filePath = `${path}/${name}.json`;
		context.fs.writeJsonFile(filePath, {});
		setPath(filePath);
		setName("");
	}, [name]);

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Item>
					<ItemPreview>
						<Plus className="text-muted-foreground w-full h-full" strokeWidth={1} />
					</ItemPreview>
					<ItemName>{t("editor.createNewContentDialog.create")}</ItemName>
				</Item>
			</DialogTrigger>
			<DialogContent>
				<DialogTitle>{t("editor.createNewContentDialog.create")}</DialogTitle>
				<DialogDescription>{t("editor.createNewContentDialog.description")}</DialogDescription>
				<InputGroup>
					<InputGroupInput
						value={name}
						onChange={(e) => setName(e.target.value)}
						placeholder={t("exportMenu.filenameLabel")}
						aria-invalid={name.length === 0}
					/>
					<InputGroupAddon align="inline-end">
						<InputGroupText>.json</InputGroupText>
					</InputGroupAddon>
				</InputGroup>
				<DialogFooter>
					<DialogClose>{t("editor.createNewContentDialog.cancel")}</DialogClose>
					<DialogClose asChild>
						<Button onClick={handleCreate}>{t("editor.createNewContentDialog.create")}</Button>
					</DialogClose>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
