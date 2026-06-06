import type { SchemaMetadata } from "@project/schema";
import React from "react";
import { useTranslation } from "react-i18next";

export const SchemaLabel = React.memo(function SchemaLabel({ name, metadata }: { name: string; metadata: SchemaMetadata | null }) {
	const { t } = useTranslation();

	return <span className="first-letter:uppercase lowercase">{metadata?.name ? (t as (key: string) => string)(metadata.name) : name}</span>;
});
