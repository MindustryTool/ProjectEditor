import { useEffect, useState } from "react";
import { useParams, useNavigate } from "@tanstack/react-router";
import { useAppStore, useProjectSession } from "@project/core";
import { EditorShell } from "./EditorShell";
import { useTranslation } from "react-i18next";
import { Progress } from "#/components/ui/progress";
import { usePath } from "#/hooks/use-path";
import { useInterval } from "usehooks-ts";
import { toast } from "sonner";

export function EditorPage() {
	const [path] = usePath();
	const [isLoading, setIsLoading] = useState(true);
	const [loading, setLoading] = useState(0);
	const { t } = useTranslation();
	const navigate = useNavigate();
	const openProject = useAppStore((s) => s.openProject);
	const { id, lang } = useParams({ from: "/$lang/projects/$id" });

	const projectContext = useProjectSession((s) => s.projectContext);

	function handleLoad(percent: number) {
		setLoading((prev) => (prev > percent ? prev + 1 : percent));
	}

	function randomLoad() {
		const added = Math.floor(Math.random() * 10 + 5);
		setLoading((prev) => (prev > 70 ? prev : Math.min(100, prev + added)));
	}

	useEffect(() => {
		if (projectContext !== null && id === projectContext.project.id) {
			setLoading(100);
			setTimeout(() => {
				setIsLoading(false);
			}, 1000);
			return;
		}

		const load = async () => {
			try {
				const record = useAppStore.getState().projects[id];
				if (record) {
					await openProject(record);
					handleLoad(50);
				} else {
					navigate({ to: `/${lang}/projects`, replace: true });
				}
			} catch (e) {
				toast.error(String(e));
			} finally {
				setLoading(100);
				setTimeout(() => {
					setIsLoading(false);
				}, 1000);
			}
		};

		load();
	}, [projectContext, id, openProject, navigate, lang]);

	useInterval(() => {
		if (!isLoading) {
			return;
		}
		randomLoad();
	}, 100);

	if (isLoading) {
		return (
			<div className="m-auto flex flex-col gap-1 text-sm w-sm max-w-[80vw]">
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
		}, 300);

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
