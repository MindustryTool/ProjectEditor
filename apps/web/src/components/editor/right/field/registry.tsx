import { ArrayField } from "#/components/editor/right/field/ArrayField";
import { BooleanField } from "#/components/editor/right/field/BooleanField";
import { ColorField } from "#/components/editor/right/field/ColorField";
import { EnvField } from "#/components/editor/right/field/EnvField";
import { ItemRequirementField } from "#/components/editor/right/field/ItemRequirementField";
import { LiquidRequirementField } from "#/components/editor/right/field/LiquidRequirementField";
import { LiquidsListField } from "#/components/editor/right/field/LiquidsListField";
import { NumberField } from "#/components/editor/right/field/NumberField";
import { ObjectField } from "#/components/editor/right/field/ObjectField";
import { PickListField } from "#/components/editor/right/field/PickListField";
import { ContentField } from "#/components/editor/right/field/ContentField";
import { SelectField } from "#/components/editor/right/field/SelectField";
import { StringField } from "#/components/editor/right/field/StringField";
import { TextureField } from "#/components/editor/right/field/TextureField";
import { TexturesField } from "#/components/editor/right/field/TexturesField";
import type { SchemaRenderer } from "#/components/editor/right/field/types";
import { OptionsField } from "#/components/editor/right/field/OptionsField";
import type { Type } from "@project/schema";
import { SoundField } from "#/components/editor/right/field/SoundField";

const renderers: Partial<Record<Type, SchemaRenderer>> = {
	string: StringField,
	number: NumberField,
	boolean: BooleanField,
	object: ObjectField,
	array: ArrayField,
	color: ColorField,
	content: ContentField,
	picklist: PickListField,
	liquids: LiquidsListField,
	select: SelectField,
	"item-stack": ItemRequirementField,
    'liquid-stack': LiquidRequirementField,
	texture: TextureField,
	textures: TexturesField,
	env: EnvField,
	options: OptionsField,
    sound: SoundField
};

export function getRenderer(type: Type) {
	return renderers[type];
}
