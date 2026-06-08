import type { SchemaMetadata } from "@project/schema";
import React from "react";
import { useTranslation } from "react-i18next";

export const SchemaDescription = React.memo(function SchemaDescription({ metadata }: { metadata: SchemaMetadata | null }) {
	const { t } = useTranslation("schema");

	if (!metadata?.description) {
		return null;
	}

	return (
		<p className="first-letter:uppercase lowercase text-xs text-muted-foreground">
			{(t as (key: string) => string)(metadata.description)}
		</p>
	);
});
