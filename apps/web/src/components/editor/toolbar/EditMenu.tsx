import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { ChevronDown } from "lucide-react";
import { toast } from "sonner";
import { useAppStore, useFileString, useProjectSession } from "@project/core";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "~/components/ui/dropdown-menu";
import { cn } from "~/lib/utils";
import { usePath } from "#/hooks/use-path";
import { canFormatFilePath, formatFileContent } from "#/lib/format-file-content";

interface EditMenuProps {
	className?: string;
}

export function EditMenu({ className }: EditMenuProps) {
	const { t } = useTranslation();
	const [path] = usePath();

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<button
					className={cn(
						"inline-flex text-nowrap items-center gap-1 rounded px-2 py-1 text-xs font-medium text-foreground hover:bg-accent active:bg-accent",
						className,
					)}
				>
					{t("edit-menu.label")}
					<ChevronDown className="h-3 w-3 text-muted-foreground" />
				</button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="start" className="w-44">
				{path && <FormatButton path={path} />}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}

function FormatButton({ path }: { path: string }) {
	const { t } = useTranslation();
	const { data, write } = useFileString(path);
	const settings = useAppStore((s) => s.settings);
	const projectId = useProjectSession((s) => s.projectContext?.project.id);
	const canFormat = canFormatFilePath(path);

	const handleFormat = useCallback(() => {
		if (!projectId || !path || !canFormatFilePath(path)) {
			return;
		}

		if (!data) {
			return;
		}

		try {
			const formatted = formatFileContent(path, data, { indent: settings.tabSize });
			write(formatted);
		} catch (error) {
			toast.error(
				t("edit-menu.format-failed", {
					error: error instanceof Error ? error.message : String(error),
				}),
			);
		}
	}, [projectId, path, data, settings.tabSize, write, t]);

	return (
		<DropdownMenuItem onClick={handleFormat} disabled={!canFormat}>
			{t("edit-menu.format")}
		</DropdownMenuItem>
	);
}
