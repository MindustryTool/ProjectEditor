import type { SchemaMetadata } from "@project/schema";
import React from "react";
import { useTranslation } from "react-i18next";

export const SchemaDescription = React.memo(function SchemaDescription({ metadata }: { metadata: SchemaMetadata | null }) {
	const { t } = useTranslation();
	const _t = t as (key: string) => string;

	if (!metadata?.description) {
		return null;
	}

	return <p className="first-letter:uppercase lowercase text-xs text-muted-foreground">{_t(metadata.description)}</p>;
});
