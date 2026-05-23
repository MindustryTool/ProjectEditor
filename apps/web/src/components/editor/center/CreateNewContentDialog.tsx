import { Button } from "#/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "#/components/ui/dialog";
import { InputGroup, InputGroupInput, InputGroupAddon, InputGroupText } from "#/components/ui/input-group";
import { useState } from "react";
import { useTranslation } from "react-i18next";

export function CreateNewContentDialog() {
	const { t } = useTranslation();
	const [name, setName] = useState("");

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button>{t("editor.createNewContentDialog.create")}</Button>
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
						<InputGroupText>.zip</InputGroupText>
					</InputGroupAddon>
				</InputGroup>
			</DialogContent>
		</Dialog>
	);
}
