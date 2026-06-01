import * as v from "valibot";
import { HjsonNode } from "@project/hjson";

export const effectClasses = ["ParticleEffect"] as const;

export type EffectClass = (typeof effectClasses)[number];

const classSchemaMap: Record<EffectClass, v.ObjectSchema<v.ObjectEntries, v.ErrorMessage<v.ObjectIssue> | undefined>> = {
	ParticleEffect: v.object({
		type: v.literal("ParticleEffect"),
	}),
};

export const EffectSchema = (value: HjsonNode) => {
	if (value.isObject()) {
		const baseSchema = v.object({
			type: v.picklist(effectClasses),
		});

		const type = value.get("type");

		if (type.isString() && classSchemaMap[type.valueOf() as EffectClass]) {
			const schema = classSchemaMap[type.valueOf() as EffectClass];
			return v.intersect([baseSchema, schema]);
		}

		return baseSchema;
	}

	return v.pipe(v.string(), v.minLength(1), v.maxLength(127));
};
