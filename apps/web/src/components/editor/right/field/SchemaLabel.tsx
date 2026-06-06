import type { SchemaMetadata } from "@project/schema";
import React from "react";
import { useTranslation } from "react-i18next";

export const SchemaLabel = React.memo(function SchemaLabel({ name, metadata }: { name: string; metadata: SchemaMetadata | null }) {
	const { t } = useTranslation();
	const _t = t as (key: string) => string;

	return <span className="first-letter:uppercase lowercase">{metadata?.name ? _t(metadata.name) : name}</span>;
});
