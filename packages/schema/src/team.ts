import * as v from "valibot";

// TODO: Add Team schema
// Java: mindustry.game.Team - team color/definition
// Reference by team name string
export const teamNames = ["derelict", "sharded", "crux", "malis", "green", "blue", "purple"] as const;

export const TeamSchema = v.lazy((input) => {
	if (typeof input === "string") {
		return v.picklist(teamNames);
	}

	if (typeof input === "number") {
		return v.pipe(v.number(), v.integer(), v.minValue(0), v.maxValue(254));
	}

	return v.never("Invalid team value");
});
