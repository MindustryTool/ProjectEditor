import { FileIcon } from "#/components/editor/FileIcon";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "#/components/ui/dialog";
import { InputGroup, InputGroupAddon, InputGroupInput } from "#/components/ui/input-group";
import { usePath } from "#/hooks/use-path";
import { levenshtein } from "#/lib/utils";
import { useProjectSession } from "@project/core";
import { Search } from "lucide-react";
import { VisuallyHidden } from "radix-ui";
import { useState } from "react";
import { useTranslation } from "react-i18next";

export function FileSearchDialog() {
	const { t } = useTranslation();

	return (
		<Dialog>
			<DialogTrigger className="w-full pb-1">
				<InputGroup className="w-full h-8 rounded">
					<InputGroupAddon>
						<Search className="size-4" />
					</InputGroupAddon>
					<InputGroupInput className="h-7 w-full" placeholder="Find files..." />
				</InputGroup>
			</DialogTrigger>
			<DialogContent className="max-h-[50dvh] h-full overflow-hidden flex flex-col">
				<DialogTitle>{t("editor.search")}</DialogTitle>
				<VisuallyHidden.Root>
					<DialogDescription />
				</VisuallyHidden.Root>
				<Content />
			</DialogContent>
		</Dialog>
	);
}

function Content() {
	const [filter, setFilter] = useState("");
	const treeSnapshot = useProjectSession((s) => s.treeSnapshot);
	const [, setPath] = usePath();
	const [cursor, setCursor] = useState(100);

	return (
		<>
			<InputGroup>
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
				{filter &&
					levenshtein(treeSnapshot.getEntries(), (entry) => entry.path, filter)
						.slice(0, cursor)
						.map((item) => (
							<DialogClose
								key={item.path}
								className="w-full rounded-md border py-2 px-1 flex gap-2 items-center cursor-pointer bg-accent"
								onClick={() => setPath(item.path)}
							>
								<FileIcon path={item.path} />
								{item.path}
							</DialogClose>
						))}
			</div>
		</>
	);
}
