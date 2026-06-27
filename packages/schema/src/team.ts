import * as v from "valibot";

export const teamNames = ["derelict", "sharded", "crux", "malis", "green", "blue", "purple"] as const;

export const TeamSchema = v.lazy((input) => {
	if (typeof input === "number") {
		return v.pipe(v.number(), v.integer(), v.minValue(0), v.maxValue(254));
	}

	return v.picklist(teamNames);
});
