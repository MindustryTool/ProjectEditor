import { FieldDescription } from "#/components/editor/right/field/Field";
import type { SchemaMetadata } from "@project/schema";
import React from "react";
import { useTranslation } from "react-i18next";

export const SchemaDescription = React.memo(function SchemaDescription({ metadata }: { metadata: SchemaMetadata | null }) {
	const { t } = useTranslation();
	const _t = t as (key: string) => string;

	if (!metadata?.description) return null;

	return <FieldDescription className="first-letter:uppercase lowercase">{_t(metadata.description)}</FieldDescription>;
});
