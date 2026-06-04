import { FormMessage } from "#/components/ui/form";
import { useValidationStore } from "@project/core";
import React from "react";
import { useTranslation } from "react-i18next";
import { useShallow } from "zustand/react/shallow";
import { EMPTY_ARRAY } from "#/lib/utils";

export const FieldIssue = React.memo(function FieldIssue({ path, jsonPath }: { path: string; jsonPath: string }) {
	const { t } = useTranslation();
	const issues = useValidationStore(
		useShallow((state) => (state.results.resultsByPath[path] || EMPTY_ARRAY).filter((issue) => issue.field?.startsWith(jsonPath))),
	);

	if (issues.length === 0) return null;

	return (
		<FormMessage>
			{issues.map((issue, index) => (
				<span key={index + (issue.field || "")}>
					{(t as (key: string, params?: Record<string, unknown>) => string)(issue.messageKey, issue.messageParams)}
				</span>
			))}
		</FormMessage>
	);
});
