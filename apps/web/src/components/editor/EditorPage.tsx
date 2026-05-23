import { useQueryState } from "nuqs";
import { useEffect, useState } from "react";
import { useProjectStore } from "@project/state";
import { getProject } from "@project/storage";
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

	const projectContext = useProjectStore((state) => state.projectContext);
	const lastProjectId = useProjectStore((state) => state.lastProjectId);

	const { openProjectFromRecord } = useProjectActions();

	useEffect(() => {
		if (projectContext !== null) return;

		if (!lastProjectId) {
			setLoading(20);
			return;
		}

		let cancelled = false;

		(async () => {
			try {
				const record = await getProject(lastProjectId);
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
	}, [lastProjectId, projectContext, openProjectFromRecord]);

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
				<span className={i >= value ? "opacity-0" : ""}>.</span>
			))}
		</div>
	);
}
