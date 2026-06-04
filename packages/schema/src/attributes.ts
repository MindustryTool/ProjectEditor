import * as v from "valibot";

// TODO: Add Attributes schema
// Java: mindustry.world.meta.Attributes - Map<String, Float> for tile attributes
// Fields: array of { attribute: string, value: number } or Record<string, number>
export const AttributesSchema = v.record(v.string(), v.number());
