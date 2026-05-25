import { Button } from "#/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogTitle, DialogTrigger } from "#/components/ui/dialog";
import { InputGroup, InputGroupInput, InputGroupAddon, InputGroupText } from "#/components/ui/input-group";
import { useCurrentProject } from "@project/state";
import { Plus } from "lucide-react";
import { useQueryState } from "nuqs";
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";

export function CreateNewContentDialog() {
	const { t } = useTranslation();
	const [name, setName] = useState("");
	const context = useCurrentProject();
	const [path, setPath] = useQueryState("path");

	const handleCreate = useCallback(() => {
		if (name.length === 0) {
			return;
		}

        const filePath = `${path}/${name}.json`
		context.fs.writeJsonFile(filePath, {});
        setPath(filePath);
		setName("");
	}, [name]);

	return (
		<Dialog>
			<DialogTrigger asChild>
				<button className="flex flex-col items-center gap-1.5 rounded-lg border border-dashed border-border p-3 hover:bg-accent transition-colors">
					<Plus className="h-8 w-8 text-muted-foreground" />
					<span className="text-xs text-center text-muted-foreground">{t("editor.createNewContentDialog.create")}</span>
				</button>
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
