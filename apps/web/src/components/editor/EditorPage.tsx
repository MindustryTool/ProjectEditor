import { useEffect, useState } from "react";
import { useParams, useNavigate } from "@tanstack/react-router";
import { useAppStore, useProjectSession } from "@project/state";
import { EditorShell } from "./EditorShell";
import { useProjectActions } from "./use-project-actions";
import { useTranslation } from "react-i18next";
import { Progress } from "#/components/ui/progress";
import { usePath } from "#/hooks/use-path";

export function EditorPage() {
	const [path] = usePath();
	const [isLoading, setIsLoading] = useState(true);
	const [loading, setLoading] = useState(0);
	const { t } = useTranslation();
	const navigate = useNavigate();
	const { id, lang } = useParams({ from: "/$lang/projects/$id" });

	const projectContext = useProjectSession((s) => s.projectContext);
	const hydrated = useAppStore((s) => s.hydrated);

	const { openProjectFromRecord } = useProjectActions();

	useEffect(() => {
		if (projectContext !== null) {
			setLoading(100);
			setIsLoading(false);
			return;
		}

		if (!hydrated) {
			setLoading(20);
			return;
		}

		if (!id) {
			navigate({ to: `/${lang}/projects`, replace: true });
			setLoading(100);
			setTimeout(() => setIsLoading(false), 1000);
			return;
		}

		let cancelled = false;

		(async () => {
			try {
				const record = useAppStore.getState().projects[id];
				if (record && !cancelled) {
					await openProjectFromRecord(record);
					setLoading(50);
				} else if (!cancelled) {
					navigate({ to: `/${lang}/projects`, replace: true });
				}
			} finally {
				setLoading(100);
				setTimeout(() => setIsLoading(false), 1000);
			}
		})();

		return () => {
			cancelled = true;
		};
	}, [projectContext, hydrated, id, openProjectFromRecord, navigate, lang]);

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
		return null;
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
