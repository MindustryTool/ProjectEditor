import type { SchemaMetadata } from "@project/schema";
import React from "react";
import { useTranslation } from "react-i18next";

export const SchemaLabel = React.memo(function SchemaLabel({
	name,
	metadata,
}: {
	name: string;
	metadata: SchemaMetadata | null | undefined;
}) {
	const { t } = useTranslation("schema");
	const translatedName = metadata?.name ? t(metadata.name) : name;

	return (
		<span className="flex items-center gap-2 text-sm leading-none font-medium select-none">
			{name} {translatedName !== name && `(${translatedName})`}
		</span>
	);
});
