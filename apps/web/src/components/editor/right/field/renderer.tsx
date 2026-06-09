import type { SchemaRenderer } from "#/components/editor/right/FieldsRenderer";
import type { Type } from "@project/schema";

export const schemaRenderers: Map<Type, SchemaRenderer> = new Map();
