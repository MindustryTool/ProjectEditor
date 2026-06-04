import type { SchemaRenderer } from "#/components/editor/right/FieldsRenderer";
import type { Type } from "@project/schema";

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
