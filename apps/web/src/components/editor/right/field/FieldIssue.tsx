import { useValidationStore } from "@project/core";
import React from "react";
import { useTranslation } from "react-i18next";
import { useShallow } from "zustand/react/shallow";
import { EMPTY_ARRAY } from "#/lib/utils";
import { FieldMessage } from "#/components/editor/right/field/Field";

export const FieldIssue = React.memo(function FieldIssue({ path, jsonPath }: { path: string; jsonPath: string }) {
	const { t } = useTranslation();
	const issues = useValidationStore(
		useShallow((state) => (state.results.resultsByPath[path] || EMPTY_ARRAY).filter((issue) => issue.field === jsonPath)),
	);

	if (issues.length === 0) return null;

	return (
		<FieldMessage>
			{issues.map((issue, index) => (
				<span key={index + (issue.field || "")}>
					{(t as (key: string, params?: Record<string, unknown>) => string)(issue.messageKey, issue.messageParams) || issue.messageKey}
				</span>
			))}
		</FieldMessage>
	);
});
