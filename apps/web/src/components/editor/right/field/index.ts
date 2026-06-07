import { StringField } from "./StringField";
import { NumberField } from "./NumberField";
import { BooleanField } from "./BooleanField";
import { ObjectField } from "./ObjectField";
import { ArrayField } from "./ArrayField";
import { ColorField } from "./ColorField";
import { ResearchField } from "./ResearchField";
import { EffectField } from "./EffectField";
import { PickListField } from "./PickListField";
import { LiquidsListField } from "./LiquidsListField";
import { SelectField } from "./SelectField";

export { StringField } from "./StringField";
export { NumberField } from "./NumberField";
export { BooleanField } from "./BooleanField";
export { ObjectField } from "./ObjectField";
export { ArrayField } from "./ArrayField";
export { ColorField } from "./ColorField";
export { ResearchField } from "./ResearchField";
export { EffectField } from "./EffectField";
export { PickListField } from "./PickListField";
export { LiquidsListField } from "./LiquidsListField";
export { SelectField } from "./SelectField";
export { FieldCategory } from "./FieldCategory";
export { SchemaLabel } from "./SchemaLabel";
export { SchemaDescription } from "./SchemaDescription";
export { FieldIssue } from "./FieldIssue";
export { ItemGrid } from "./ItemGrid";
export { SchemaArrayItemEditor } from "./SchemaArrayItemEditor";
export { TextureField } from "./TextureField";
export { Field } from "./Field";
export { removeByJsonPath } from "./util";

import type { SchemaRenderer } from "#/components/editor/right/FieldsRenderer";
import type { Type } from "@project/schema";
import { TextureField } from "#/components/editor/right/field/TextureField";
import { TexturesField } from "#/components/editor/right/field/TexturesField";

export const schemaRenderers: Partial<Record<Type, SchemaRenderer>> = {
	string: StringField,
	number: NumberField,
	boolean: BooleanField,
	object: ObjectField,
	array: ArrayField,
	color: ColorField,
	research: ResearchField,
	effect: EffectField,
	picklist: PickListField,
	liquids: LiquidsListField,
	select: SelectField,
	texture: TextureField,
    textures: TexturesField,
};
