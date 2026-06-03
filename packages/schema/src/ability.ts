import * as v from "valibot";
import { type SchemaFn } from "./base";

export const AbilityHjsonSchema: SchemaFn = () => v.object({});

export const AbilityFieldSchema: SchemaFn = (context) => v.union([v.string(), AbilityHjsonSchema(context)]);
