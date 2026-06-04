import { getSchemaMetadata, type AnySchema } from "@project/schema";
import React from "react";
import { useTranslation } from "react-i18next";

export const SchemaLabel = React.memo(function SchemaLabel({ name, entrySchema }: { name: string; entrySchema: AnySchema }) {
	const { t } = useTranslation();
	const _t = t as (key: string) => string;
	const metadata = getSchemaMetadata(entrySchema);

	return <>{metadata?.name ? _t(metadata.name) : name}</>;
});
