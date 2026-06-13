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

	return metadata?.name ? (
		<span className="first-letter:uppercase lowercase flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50">
			{(t as (key: string) => string)(metadata.name)}
		</span>
	) : (
		<span className="flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50">
			{name}
		</span>
	);
});
