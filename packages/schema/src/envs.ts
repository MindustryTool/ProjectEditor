import * as v from "valibot";

export const Envs = {
	none: 0,
	terrestrial: 1,
	space: 1 << 1,
	underwater: 1 << 2,
	spores: 1 << 3,
	scorching: 1 << 4,
	groundOil: 1 << 5,
	groundWater: 1 << 6,
	oxygen: 1 << 7,
	any: 0xffffffff,
} as const satisfies Record<string, number>;

export const EnvValues = Object.values(Envs);

export const EnvSchema = v.pipe(v.number(), v.picklist(EnvValues), v.metadata({ type: "env" }));
