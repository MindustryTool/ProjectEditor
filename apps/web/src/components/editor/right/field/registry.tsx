import { ArrayField } from "#/components/editor/right/field/ArrayField";
import { BooleanField } from "#/components/editor/right/field/BooleanField";
import { ColorField } from "#/components/editor/right/field/ColorField";
import { EffectField } from "#/components/editor/right/field/EffectField";
import { EnvField } from "#/components/editor/right/field/EnvField";
import { ItemRequirementField } from "#/components/editor/right/field/ItemRequirementField";
import { LiquidsListField } from "#/components/editor/right/field/LiquidsListField";
import { NumberField } from "#/components/editor/right/field/NumberField";
import { ObjectField } from "#/components/editor/right/field/ObjectField";
import { PickListField } from "#/components/editor/right/field/PickListField";
import { ResearchField } from "#/components/editor/right/field/ResearchField";
import { SelectField } from "#/components/editor/right/field/SelectField";
import { StringField } from "#/components/editor/right/field/StringField";
import { TextureField } from "#/components/editor/right/field/TextureField";
import { TexturesField } from "#/components/editor/right/field/TexturesField";
import type { SchemaRenderer } from "#/components/editor/right/field/types";
import { VariantField } from "#/components/editor/right/field/VariantField";
import type { Type } from "@project/schema";

const renderers: Partial<Record<Type, SchemaRenderer>> = {
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
	"item-stack": ItemRequirementField,
	texture: TextureField,
	textures: TexturesField,
	env: EnvField,
	variant: VariantField,
};

export function getRenderer(type: Type) {
	return renderers[type];
}
