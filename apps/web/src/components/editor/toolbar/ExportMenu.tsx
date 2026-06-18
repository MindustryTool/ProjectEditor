import { useState, useCallback, type ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { useProjectSession } from "@project/core";
import { cn } from "#/lib/utils";
import { ExportMenuContent } from "./ExportMenuContent";
import { Button } from "#/components/ui/button";

interface ExportMenuProps {
	className?: string;
    children?: ReactNode;
}

export function ExportMenu({ className, children }: ExportMenuProps) {
	const { t } = useTranslation();
	const projectContext = useProjectSession((s) => s.projectContext);
	const [open, setOpen] = useState(false);

	const handleOpen = useCallback(() => {
		if (!projectContext) return;
		setOpen(true);
	}, [projectContext]);

	return (
		<>
			<Button
                variant="ghost"
				onClick={handleOpen}
				className={cn(
					className,
				)}
			>
				{t("export-menu.label")}
                {children}
			</Button>
			<ExportMenuContent open={open} onOpenChange={setOpen} />
		</>
	);
}
