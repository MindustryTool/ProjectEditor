import { lazy, memo, Suspense } from "react";
import { useFileString } from "@project/core";
import { getLanguageFromPath } from "#/lib/monaco/languageMap";
import { Spinner } from "#/components/ui/spinner";
import { ErrorBoundary } from "#/components/ui/error-boundary";

const MonacoEditor = lazy(() => import("#/components/editor/monaco/MonacoEditor").then((mod) => ({ default: mod.MonacoEditor })));

export const TextEditor = memo(function TextEditor({ path }: { path: string }) {
	const { data, isLoading, write } = useFileString(path);
	const language = getLanguageFromPath(path);

	if (isLoading) {
		return (
			<div className="flex w-full h-full items-center justify-center">
				<Spinner />
			</div>
		);
	}

	if (data === null) {
		return <div className="flex w-full h-full items-center justify-center">File not found</div>;
	}

	return (
		<Suspense>
			<ErrorBoundary>
				<MonacoEditor path={path} value={data} onChange={write} language={language} />
			</ErrorBoundary>
		</Suspense>
	);
});
