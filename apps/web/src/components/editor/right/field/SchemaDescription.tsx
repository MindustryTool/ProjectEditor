import { FormDescription } from "#/components/ui/form";
import { getSchemaMetadata, type AnySchema } from "@project/schema";
import React from "react";
import { useTranslation } from "react-i18next";

export const SchemaDescription = React.memo(function SchemaDescription({ entrySchema }: { entrySchema: AnySchema }) {
	const { t } = useTranslation();
	const _t = t as (key: string) => string;
	const metadata = getSchemaMetadata(entrySchema);

	if (!metadata?.description) return null;

	return <FormDescription>{_t(metadata.description)}</FormDescription>;
});
