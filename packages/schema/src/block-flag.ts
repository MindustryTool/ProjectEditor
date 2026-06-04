import * as v from "valibot";

// TODO: Add BlockFlag schema
// Java: mindustry.world.meta.BlockFlag
export const blockFlags = [
	"producesPower",
	"consumesPower",
	"battery",
	"reactor",
	"turret",
	"unitFactory",
	"unitAssembler",
	"drill",
	"factory",
	"repair",
	"healing",
	"pad",
	"conveyor",
	"launchPad",
	"liquid",
	"heat",
	"heatProducer",
	"commandCenter",
	"core",
	"storage",
	"generator",
	"message",
	"duct",
	"logic",
	"mender",
	"tank",
	"heatTank",
	"oilExtractor",
	"ore",
	"oreBlock",
] as const;

export const BlockFlagSchema = v.picklist(blockFlags);
