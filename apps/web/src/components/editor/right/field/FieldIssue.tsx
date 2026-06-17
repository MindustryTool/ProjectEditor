import { useValidationStore } from "@project/core";
import React from "react";
import { useTranslation } from "react-i18next";
import { useShallow } from "zustand/react/shallow";
import { EMPTY_ARRAY } from "#/lib/utils";

export const FieldIssue = React.memo(function FieldIssue({
	path,
	jsonPath,
	showChildErrors,
}: {
	path: string;
	jsonPath: string;
	showChildErrors?: boolean;
}) {
	const { t } = useTranslation();
	const issues = useValidationStore(
		useShallow((state) =>
			(state.results.resultsByPath[path] || EMPTY_ARRAY).filter((issue) =>
				showChildErrors ? issue.field?.startsWith(jsonPath) : issue.field === jsonPath,
			),
		),
	);

	if (issues.length === 0) return null;

	return (
		<p className="text-xs text-destructive">
			{issues.map((issue, index) => (
				<span key={index + (issue.field || "")}>
					{(t as (key: string, params?: Record<string, unknown>) => string)(issue.messageKey, issue.messageParams) || issue.messageKey}
				</span>
			))}
		</p>
	);
});
