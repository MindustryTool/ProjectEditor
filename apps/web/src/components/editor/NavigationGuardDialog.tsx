import { useTranslation } from "react-i18next";
import {
	AlertDialog,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "#/components/ui/alert-dialog";
import { Button } from "#/components/ui/button";
import { useNavigationGuard } from "#/hooks/use-navigation-guard";

interface NavigationGuardDialogProps {
	projectId: string | null;
}

export function NavigationGuardDialog({ projectId }: NavigationGuardDialogProps) {
	const { t } = useTranslation();
	const blocker = useNavigationGuard(projectId);

	const handleOpenChange = (open: boolean) => {
		if (!open && blocker.status === "blocked") {
			blocker.reset?.();
		}
	};

	const handleStay = () => {
		blocker.reset?.();
	};

	const handleLeave = () => {
		blocker.proceed?.();
	};

	return (
		<AlertDialog open={blocker.status === "blocked"} onOpenChange={handleOpenChange}>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>{t("navigationGuard.title", "Unsaved Changes")}</AlertDialogTitle>
					<AlertDialogDescription>
						{t("navigationGuard.description", "You have unsaved changes. Are you sure you want to leave?")}
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<Button variant="outline" onClick={handleStay}>
						{t("navigationGuard.stay", "Stay")}
					</Button>
					<Button variant="default" onClick={handleLeave}>
						{t("navigationGuard.leave", "Leave")}
					</Button>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
