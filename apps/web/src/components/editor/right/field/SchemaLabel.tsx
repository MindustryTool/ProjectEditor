import type { SchemaMetadata } from "@project/schema";
import React from "react";
import { useTranslation } from "react-i18next";

export const SchemaLabel = React.memo(function SchemaLabel({ name, entrySchema }: { name: string; entrySchema: SchemaMetadata | null }) {
	const { t } = useTranslation();
	const _t = t as (key: string) => string;

	return <>{entrySchema?.name ? _t(entrySchema.name) : name}</>;
});
