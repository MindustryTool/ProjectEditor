import { useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useProjectSession } from "@project/core";
import { cn } from "#/lib/utils";
import { ExportMenuContent } from "./ExportMenuContent";

interface ExportMenuProps {
	className?: string;
}

export function ExportMenu({ className }: ExportMenuProps) {
	const { t } = useTranslation();
	const projectContext = useProjectSession((s) => s.projectContext);
	const [open, setOpen] = useState(false);

	const handleOpen = useCallback(() => {
		if (!projectContext) return;
		setOpen(true);
	}, [projectContext]);

	return (
		<>
			<button
				onClick={handleOpen}
				className={cn(
					"inline-flex items-center text-nowrap gap-1 rounded px-2 py-1 text-xs font-medium text-foreground hover:bg-accent active:bg-accent",
					className,
				)}
			>
				{t("export-menu.label")}
			</button>
			<ExportMenuContent open={open} onOpenChange={setOpen} />
		</>
	);
}
