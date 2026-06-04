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
import { SpriteField } from "./SpriteField";

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
export { SpriteField } from "./SpriteField";
export { SchemaLabel } from "./SchemaLabel";
export { SchemaDescription } from "./SchemaDescription";
export { FieldIssue } from "./FieldIssue";
export { ItemGrid } from "./ItemGrid";
export { SchemaArrayItemEditor } from "./SchemaArrayItemEditor";
export { removeByJsonPath } from "./util";

import type { SchemaRenderer } from "#/components/editor/right/FieldsRenderer";
import type { Type } from "@project/schema";


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
	sprite: SpriteField,
};
