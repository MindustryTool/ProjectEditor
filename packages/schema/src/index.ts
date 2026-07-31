import * as v from "valibot";

export const SettingsSchema = v.object({
	theme: v.picklist(["light", "dark", "system"]),
	fontSize: v.pipe(v.number(), v.minValue(8), v.maxValue(32)),
	tabSize: v.pipe(v.number(), v.minValue(1), v.maxValue(8)),
	autoSave: v.boolean(),
	autoSaveDelay: v.pipe(v.number(), v.minValue(500), v.maxValue(10000)),
});

export { AbilityHjsonSchema } from "./ability";
export { AttributesSchema } from "./attributes";
export { BlockGroupSchema } from "./block-group";
export { BlockFlagSchema } from "./block-flag";
export { BlockHjsonSchema } from "./block";
export { BuildVisibilitySchema } from "./build-visibility";
export { BulletHjsonSchema } from "./bullet";
export { CacheLayerSchema } from "./cache-layer";
export { CategorySchema } from "./category";
export { Interps } from "./interps";
export { ItemHjsonSchema } from "./item";
export { ItemStackSchema } from "./item-stack";
export { LiquidHjsonSchema } from "./liquid";
export { LiquidStackSchema } from "./liquid-stack";
export { WeatherHjsonSchema } from "./weather";
export { MindustryHexColorSchema } from "./mindustry-hex-color";
export { ModHjsonSchema } from "./mod-hjson";
export type { ModHjsonData } from "./mod-hjson";
export { AppSettingsSchema, ProjectRecordSchema } from "./project";
export type { AppSettings, ProjectRecord } from "./project";
export { ResearchSchema } from "./research";
export type { Research } from "./research";
export { PlanetHjsonSchema, PlanetSchema } from "./planet";
export { SectorHjsonSchema } from "./sector";
export { SoundHjsonSchema } from "./sound";
export { SpriteFieldSchema } from "./sprite";
export { StatusHjsonSchema } from "./status";
export { TeamSchema } from "./team";
export { TextureFieldSchema } from "./texture";
export { ArrayTextureSchema } from "./textures";
export { UnitHjsonSchema } from "./unit";
export {
	CachedSchema,
	collectEnginePositions,
	collectHitboxPosition,
	collectPartPositions,
	collectUnitPositions,
	collectWaveTrailPositions,
	collectWeaponPositions,
	detectSchemaType,
	findContent,
	getArrayItemSchema,
	getSchemaEntries,
	getSchemaFromPath,
	getSchemaMetadata,
	hasNullableWrapper,
	metadata,
	resolveSchema,
	unwrapSchema,
	getDefaults,
} from "./utils";
export type {
	AnySchema,
	BasePosition,
	DrawPositionData,
	EnginePositionData,
	HitboxPositionData,
	PartPositionData,
	PositionData,
	SchemaFn,
	SchemaMetadata,
	ShootPositionData,
	SpritePositionData,
	Type,
	UnknownPositionData,
	WaveTrailPositionData,
} from "./utils";

export { DrawFieldSchema, DrawHjsonSchema, drawClasses } from "./draw";
export type { DrawClass } from "./draw";
export { WeaponHjsonSchema } from "./weapon";
export { ClassMap, classSchema } from "./class";
export { Envs, EnvValues } from "./envs";
