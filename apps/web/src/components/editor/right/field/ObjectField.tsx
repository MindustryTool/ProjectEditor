import React from "react";
import { ChevronRight } from "lucide-react";
import { Button } from "#/components/ui/button";
import { SchemaLabel } from "#/components/editor/right/field/SchemaLabel";
import type { SchemaRendererProps } from "#/components/editor/right/field/types";
import { useProjectSession } from "@project/core";

export const ObjectField = React.memo(function ObjectField({
	name,
	jsonPath,
	metadata,
}: SchemaRendererProps) {
	const setCurrentJsonPath = useProjectSession((s) => s.setCurrentJsonPath);

	return (
		<Button
			variant="secondary"
			className="flex border border-input justify-start items-center gap-2 flex-99"
			onClick={() => setCurrentJsonPath(jsonPath)}
		>
			<ChevronRight className="size-4 shrink-0" />
			<SchemaLabel name={name} metadata={metadata} />
		</Button>
	);
});


