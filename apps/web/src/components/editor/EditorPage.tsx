import { useQueryState } from "nuqs";
import { useEffect, useState } from "react";
import { useAppStore, useProjectSession } from "@project/state";
import { NoProjectScreen } from "./NoProjectScreen";
import { EditorShell } from "./EditorShell";
import { useProjectActions } from "./useProjectActions";
import { useTranslation } from "react-i18next";
import { Progress } from "#/components/ui/progress";

export function EditorPage() {
	const [path] = useQueryState("path");
	const [isLoading, setIsLoading] = useState(true);
	const [loading, setLoading] = useState(0);
	const { t } = useTranslation();

	const projectContext = useProjectSession((s) => s.projectContext);
	const lastProjectId = useAppStore((s) => s.lastProjectId);
	const hydrated = useAppStore((s) => s.hydrated);

	const { openProjectFromRecord } = useProjectActions();

	useEffect(() => {
		if (projectContext !== null) {
			setLoading(100);
			setIsLoading(false);
			return;
		}

		if (!lastProjectId) {
			if (hydrated) {
				setLoading(100);
				setTimeout(() => setIsLoading(false), 1000);
			} else {
				setLoading(20);
			}
			return;
		}

		let cancelled = false;

		(async () => {
			try {
				const record = useAppStore.getState().projects[lastProjectId];
				if (record && !cancelled) {
					await openProjectFromRecord(record);
					setLoading(50);
				}
			} finally {
				setLoading(100);
				setTimeout(() => setIsLoading(false), 1000);
			}
		})();

		return () => {
			cancelled = true;
		};
	}, [lastProjectId, projectContext, hydrated, setLoading, setIsLoading, openProjectFromRecord]);

	if (isLoading) {
		return (
			<div className="m-auto flex flex-col gap-1 text-sm w-sm">
				<div className="flex items-center">
					{t("editor.loading")}
					<LoadingDot />
				</div>
				<Progress value={loading} max={100} />
			</div>
		);
	}

	if (projectContext === null) {
		return <NoProjectScreen />;
	}

	return <EditorShell path={path} />;
}

function LoadingDot() {
	const [value, setValue] = useState(1);

	useEffect(() => {
		const interval = setInterval(() => {
			setValue((v) => (v + 1) % 4);
		}, 400);

		return () => clearInterval(interval);
	}, []);

	return (
		<div>
			{Array.from({ length: 4 }, (_, i) => (
				<span key={i} className={i >= value ? "opacity-0" : ""}>
					.
				</span>
			))}
		</div>
	);
}
