import React from "react";
import type { SchemaRendererProps } from "#/components/editor/right/field/renderer";
import { schemaRenderers } from "#/components/editor/right/field/renderer";

export const SelectField = React.memo(function SelectField(_props: SchemaRendererProps) {
	return null;
});

schemaRenderers.set("select", SelectField);
