import * as v from "valibot";
import { databaseContent } from "./content";
import { cached, metadata } from "./utils";
import { SectorFieldSchema } from "./sector";
import { MindustryHexColorSchema } from "./mindustry-hex-color";
import { AttributesSchema } from "./attributes";
import { ResearchSchema } from "./research";
import type { SchemaFn } from "./utils";
import type { ProjectContents } from "@project/types";

const meshTypes= ["NoiseMesh", "SunMesh", "HexSkyMesh", "MatMesh", "MultiMesh"];

const NoiseMeshSchema = v.pipe(
	v.object({
		type: v.pipe(v.optional(v.picklist(meshTypes), "NoiseMesh"), metadata({ name: "editor.planet.mesh.type" })),
		seed: v.pipe(
			v.optional(v.number(), 0),
			metadata({ name: "editor.planet.mesh.seed", description: "editor.planet.mesh.seed-description" }),
		),
		divisions: v.pipe(
			v.optional(v.pipe(v.number(), v.integer(), v.minValue(1)), 1),
			metadata({ name: "editor.planet.mesh.divisions", description: "editor.planet.mesh.divisions-description" }),
		),
		radius: v.pipe(
			v.optional(v.pipe(v.number(), v.gtValue(0)), 1),
			metadata({ name: "editor.planet.mesh.radius", description: "editor.planet.mesh.radius-description" }),
		),
		octaves: v.pipe(
			v.optional(v.pipe(v.number(), v.integer(), v.minValue(1)), 1),
			metadata({ name: "editor.planet.mesh.octaves", description: "editor.planet.mesh.octaves-description" }),
		),
		persistence: v.pipe(
			v.optional(v.number(), 0.5),
			metadata({ name: "editor.planet.mesh.persistence", description: "editor.planet.mesh.persistence-description" }),
		),
		scale: v.pipe(
			v.optional(v.number(), 1),
			metadata({ name: "editor.planet.mesh.scale", description: "editor.planet.mesh.scale-description" }),
		),
		mag: v.pipe(
			v.optional(v.number(), 0.5),
			metadata({ name: "editor.planet.mesh.mag", description: "editor.planet.mesh.mag-description" }),
		),
		color1: v.pipe(
			v.optional(MindustryHexColorSchema),
			metadata({ name: "editor.planet.mesh.color1", description: "editor.planet.mesh.color1-description" }),
		),
		color2: v.pipe(
			v.optional(MindustryHexColorSchema),
			metadata({ name: "editor.planet.mesh.color2", description: "editor.planet.mesh.color2-description" }),
		),
		colorOct: v.pipe(
			v.optional(v.pipe(v.number(), v.integer(), v.minValue(1)), 1),
			metadata({ name: "editor.planet.mesh.color-oct", description: "editor.planet.mesh.color-oct-description" }),
		),
		colorPersistence: v.pipe(
			v.optional(v.number(), 0.5),
			metadata({ name: "editor.planet.mesh.color-persistence", description: "editor.planet.mesh.color-persistence-description" }),
		),
		colorScale: v.pipe(
			v.optional(v.number(), 1),
			metadata({ name: "editor.planet.mesh.color-scale", description: "editor.planet.mesh.color-scale-description" }),
		),
		colorThreshold: v.pipe(
			v.optional(v.number(), 0.5),
			metadata({ name: "editor.planet.mesh.color-threshold", description: "editor.planet.mesh.color-threshold-description" }),
		),
	}),
	metadata({ option: "NoiseMesh" }),
);

const SunMeshSchema = v.pipe(
	v.object({
		type: v.pipe(v.optional(v.picklist(meshTypes), "SunMesh"), metadata({ name: "editor.planet.mesh.type" })),
		divisions: v.pipe(
			v.optional(v.pipe(v.number(), v.integer(), v.minValue(1)), 1),
			metadata({ name: "editor.planet.mesh.divisions", description: "editor.planet.mesh.divisions-description" }),
		),
		octaves: v.pipe(
			v.optional(v.pipe(v.number(), v.integer(), v.minValue(1)), 1),
			metadata({ name: "editor.planet.mesh.octaves", description: "editor.planet.mesh.octaves-description" }),
		),
		persistence: v.pipe(
			v.optional(v.number(), 0.5),
			metadata({ name: "editor.planet.mesh.persistence", description: "editor.planet.mesh.persistence-description" }),
		),
		scl: v.pipe(
			v.optional(v.number(), 1),
			metadata({ name: "editor.planet.mesh.scl", description: "editor.planet.mesh.scl-description" }),
		),
		pow: v.pipe(
			v.optional(v.number(), 1),
			metadata({ name: "editor.planet.mesh.pow", description: "editor.planet.mesh.pow-description" }),
		),
		mag: v.pipe(
			v.optional(v.number(), 0.5),
			metadata({ name: "editor.planet.mesh.mag", description: "editor.planet.mesh.mag-description" }),
		),
		colorScale: v.pipe(
			v.optional(v.number(), 1),
			metadata({ name: "editor.planet.mesh.color-scale", description: "editor.planet.mesh.color-scale-description" }),
		),
		colors: v.pipe(
			v.optional(v.array(MindustryHexColorSchema)),
			metadata({ name: "editor.planet.mesh.colors", description: "editor.planet.mesh.colors-description" }),
		),
	}),
	metadata({ option: "SunMesh" }),
);

const HexSkyMeshSchema = v.pipe(
	v.object({
		type: v.pipe(v.optional(v.picklist(meshTypes), "HexSkyMesh"), metadata({ name: "editor.planet.mesh.type" })),
		seed: v.pipe(
			v.optional(v.number(), 0),
			metadata({ name: "editor.planet.mesh.seed", description: "editor.planet.mesh.seed-description" }),
		),
		speed: v.pipe(
			v.optional(v.number(), 0),
			metadata({ name: "editor.planet.mesh.speed", description: "editor.planet.mesh.speed-description" }),
		),
		radius: v.pipe(
			v.optional(v.pipe(v.number(), v.gtValue(0)), 1),
			metadata({ name: "editor.planet.mesh.radius", description: "editor.planet.mesh.radius-description" }),
		),
		divisions: v.pipe(
			v.optional(v.pipe(v.number(), v.integer(), v.minValue(3)), 3),
			metadata({ name: "editor.planet.mesh.divisions", description: "editor.planet.mesh.divisions-description" }),
		),
		color: v.pipe(
			v.optional(MindustryHexColorSchema),
			metadata({ name: "editor.planet.mesh.color", description: "editor.planet.mesh.color-description" }),
		),
		octaves: v.pipe(
			v.optional(v.pipe(v.number(), v.integer(), v.minValue(1)), 1),
			metadata({ name: "editor.planet.mesh.octaves", description: "editor.planet.mesh.octaves-description" }),
		),
		persistence: v.pipe(
			v.optional(v.number(), 0.5),
			metadata({ name: "editor.planet.mesh.persistence", description: "editor.planet.mesh.persistence-description" }),
		),
		scale: v.pipe(
			v.optional(v.number(), 1),
			metadata({ name: "editor.planet.mesh.scale", description: "editor.planet.mesh.scale-description" }),
		),
		thresh: v.pipe(
			v.optional(v.number(), 0.5),
			metadata({ name: "editor.planet.mesh.thresh", description: "editor.planet.mesh.thresh-description" }),
		),
	}),
	metadata({ option: "HexSkyMesh" }),
);

const MatMeshSchema = v.pipe(
	v.object({
		type: v.pipe(v.optional(v.picklist(meshTypes), "MatMesh"), metadata({ name: "editor.planet.mesh.type" })),
		mesh: v.pipe(v.optional(v.any()), metadata({ name: "editor.planet.mesh.mesh", description: "editor.planet.mesh.mesh-description" })),
		mat: v.pipe(
			v.optional(v.object({})),
			metadata({ name: "editor.planet.mesh.mat", description: "editor.planet.mesh.mat-description" }),
		),
	}),
	metadata({ option: "MatMesh" }),
);

const MultiMeshObjectSchema = v.pipe(
	v.object({
		type: v.pipe(v.optional(v.picklist(meshTypes), "MultiMesh"), metadata({ name: "editor.planet.mesh.type" })),
		meshes: v.pipe(
			v.optional(v.array(v.any())),
			metadata({ name: "editor.planet.mesh.meshes", description: "editor.planet.mesh.meshes-description" }),
		),
	}),
	metadata({ option: "MultiMesh" }),
);

const meshObjectSchema = v.pipe(
	v.lazy((input) => {
		const type = input && typeof input === "object" && "type" in input ? String(input.type) : "NoiseMesh";
		switch (type) {
			case "SunMesh":
				return SunMeshSchema;
			case "HexSkyMesh":
				return HexSkyMeshSchema;
			case "MatMesh":
				return MatMeshSchema;
			case "MultiMesh":
				return MultiMeshObjectSchema;
			default:
				return NoiseMeshSchema;
		}
	}),
	metadata({
		type: "options",
		options: [NoiseMeshSchema, SunMeshSchema, HexSkyMeshSchema, MatMeshSchema, MultiMeshObjectSchema],
	}),
);

const singleMeshSchema = meshObjectSchema;
const multiMeshSchema = v.pipe(v.array(singleMeshSchema), metadata({ option: "multimesh" }));

const meshSchema = v.pipe(
	v.lazy((input) => {
		if (Array.isArray(input)) {
			return multiMeshSchema;
		}

		return singleMeshSchema;
	}),
	metadata({
		type: "options",
		options: [singleMeshSchema, multiMeshSchema],
	}),
);

export const PlanetSchema = cached((context: ProjectContents) =>
	v.object({
		...databaseContent,
		mesh: v.optional(meshSchema),
		cloudMesh: v.optional(meshSchema),
		radius: v.optional(v.pipe(v.number(), v.gtValue(0)), 1),
		sectorSize: v.optional(v.pipe(v.number(), v.minValue(0), v.integer()), 0),
		rules: v.optional(v.object({})),
		position: v.optional(v.object({ x: v.number(), y: v.number(), z: v.number() })),
		sectors: v.optional(v.array(SectorFieldSchema(context))),
		orbitSpacing: v.optional(v.number(), 12),
		camRadius: v.optional(v.number(), 0),
		minZoom: v.pipe(
			v.optional(v.number(), 0.5),
			metadata({ name: "editor.planet.min-zoom", description: "editor.planet.min-zoom-description" }),
		),
		maxZoom: v.pipe(
			v.optional(v.number(), 2),
			metadata({ name: "editor.planet.max-zoom", description: "editor.planet.max-zoom-description" }),
		),
		drawOrbit: v.pipe(
			v.optional(v.boolean(), true),
			metadata({ name: "editor.planet.draw-orbit", description: "editor.planet.draw-orbit-description" }),
		),
		atmosphereRadIn: v.pipe(
			v.optional(v.number(), 0),
			metadata({ name: "editor.planet.atmosphere-rad-in", description: "editor.planet.atmosphere-rad-in-description" }),
		),
		atmosphereRadOut: v.pipe(
			v.optional(v.number(), 0.3),
			metadata({ name: "editor.planet.atmosphere-rad-out", description: "editor.planet.atmosphere-rad-out-description" }),
		),
		clipRadius: v.pipe(
			v.optional(v.number(), -1),
			metadata({ name: "editor.planet.clip-radius", description: "editor.planet.clip-radius-description" }),
		),
		orbitTime: v.pipe(
			v.optional(v.number()),
			metadata({ name: "editor.planet.orbit-time", description: "editor.planet.orbit-time-description" }),
		),
		rotateTime: v.pipe(
			v.optional(v.number(), 1440),
			metadata({ name: "editor.planet.rotate-time", description: "editor.planet.rotate-time-description" }),
		),
		orbitOffset: v.pipe(
			v.optional(v.number()),
			metadata({ name: "editor.planet.orbit-offset", description: "editor.planet.orbit-offset-description" }),
		),
		tidalLock: v.pipe(
			v.optional(v.boolean(), false),
			metadata({ name: "editor.planet.tidal-lock", description: "editor.planet.tidal-lock-description" }),
		),
		bloom: v.pipe(
			v.optional(v.boolean(), false),
			metadata({ name: "editor.planet.bloom", description: "editor.planet.bloom-description" }),
		),
		visible: v.pipe(
			v.optional(v.boolean(), true),
			metadata({ name: "editor.planet.visible", description: "editor.planet.visible-description" }),
		),
		icon: v.pipe(
			v.optional(v.string(), "planet"),
			metadata({ name: "editor.planet.icon", description: "editor.planet.icon-description" }),
		),
		hasAtmosphere: v.pipe(
			v.optional(v.boolean(), true),
			metadata({ name: "editor.planet.has-atmosphere", description: "editor.planet.has-atmosphere-description" }),
		),
		landCloudColor: v.pipe(
			v.optional(MindustryHexColorSchema),
			metadata({ name: "editor.planet.land-cloud-color", description: "editor.planet.land-cloud-color-description" }),
		),
		lightColor: v.pipe(
			v.optional(MindustryHexColorSchema),
			metadata({ name: "editor.planet.light-color", description: "editor.planet.light-color-description" }),
		),
		atmosphereColor: v.pipe(
			v.optional(MindustryHexColorSchema),
			metadata({ name: "editor.planet.atmosphere-color", description: "editor.planet.atmosphere-color-description" }),
		),
		iconColor: v.pipe(
			v.optional(MindustryHexColorSchema),
			metadata({ name: "editor.planet.icon-color", description: "editor.planet.icon-color-description" }),
		),
		accessible: v.pipe(
			v.optional(v.boolean(), true),
			metadata({ name: "editor.planet.accessible", description: "editor.planet.accessible-description" }),
		),
		defaultEnv: v.pipe(
			v.optional(v.number()),
			metadata({ name: "editor.planet.default-env", description: "editor.planet.default-env-description" }),
		),
		defaultAttributes: v.pipe(
			v.optional(AttributesSchema),
			metadata({ name: "editor.planet.default-attributes", description: "editor.planet.default-attributes-description" }),
		),
		updateLighting: v.pipe(
			v.optional(v.boolean(), true),
			metadata({ name: "editor.planet.update-lighting", description: "editor.planet.update-lighting-description" }),
		),
		lightSrcFrom: v.pipe(
			v.optional(v.pipe(v.number(), v.minValue(0), v.maxValue(1)), 0),
			metadata({ name: "editor.planet.light-src-from", description: "editor.planet.light-src-from-description" }),
		),
		lightSrcTo: v.pipe(
			v.optional(v.pipe(v.number(), v.minValue(0), v.maxValue(1)), 0.8),
			metadata({ name: "editor.planet.light-src-to", description: "editor.planet.light-src-to-description" }),
		),
		lightDstFrom: v.pipe(
			v.optional(v.pipe(v.number(), v.minValue(0), v.maxValue(1)), 0.2),
			metadata({ name: "editor.planet.light-dst-from", description: "editor.planet.light-dst-from-description" }),
		),
		lightDstTo: v.pipe(
			v.optional(v.pipe(v.number(), v.minValue(0), v.maxValue(1)), 1),
			metadata({ name: "editor.planet.light-dst-to", description: "editor.planet.light-dst-to-description" }),
		),
		startSector: v.pipe(
			v.optional(v.pipe(v.number(), v.integer()), 0),
			metadata({ name: "editor.planet.start-sector", description: "editor.planet.start-sector-description" }),
		),
		sectorSeed: v.pipe(
			v.optional(v.pipe(v.number(), v.integer()), -1),
			metadata({ name: "editor.planet.sector-seed", description: "editor.planet.sector-seed-description" }),
		),
		launchCapacityMultiplier: v.pipe(
			v.optional(v.number(), 0.25),
			metadata({
				name: "editor.planet.launch-capacity-multiplier",
				description: "editor.planet.launch-capacity-multiplier-description",
			}),
		),
		enemyBuildSpeedMultiplier: v.pipe(
			v.optional(v.number(), 1),
			metadata({
				name: "editor.planet.enemy-build-speed-multiplier",
				description: "editor.planet.enemy-build-speed-multiplier-description",
			}),
		),
		enemyFactoryActivationDelay: v.pipe(
			v.optional(v.number(), 0),
			metadata({
				name: "editor.planet.enemy-factory-activation-delay",
				description: "editor.planet.enemy-factory-activation-delay-description",
			}),
		),
		enemyInfiniteItems: v.pipe(
			v.optional(v.boolean(), true),
			metadata({ name: "editor.planet.enemy-infinite-items", description: "editor.planet.enemy-infinite-items-description" }),
		),
		enemyCoreSpawnReplace: v.pipe(
			v.optional(v.boolean(), false),
			metadata({ name: "editor.planet.enemy-core-spawn-replace", description: "editor.planet.enemy-core-spawn-replace-description" }),
		),
		prebuildBase: v.pipe(
			v.optional(v.boolean(), true),
			metadata({ name: "editor.planet.prebuild-base", description: "editor.planet.prebuild-base-description" }),
		),
		allowWaves: v.pipe(
			v.optional(v.boolean(), false),
			metadata({ name: "editor.planet.allow-waves", description: "editor.planet.allow-waves-description" }),
		),
		allowLaunchSchematics: v.pipe(
			v.optional(v.boolean(), false),
			metadata({ name: "editor.planet.allow-launch-schematics", description: "editor.planet.allow-launch-schematics-description" }),
		),
		allowLaunchLoadout: v.pipe(
			v.optional(v.boolean(), false),
			metadata({ name: "editor.planet.allow-launch-loadout", description: "editor.planet.allow-launch-loadout-description" }),
		),
		allowSectorInvasion: v.pipe(
			v.optional(v.boolean(), false),
			metadata({ name: "editor.planet.allow-sector-invasion", description: "editor.planet.allow-sector-invasion-description" }),
		),
		allowLegacyLaunchPads: v.pipe(
			v.optional(v.boolean(), false),
			metadata({ name: "editor.planet.allow-legacy-launch-pads", description: "editor.planet.allow-legacy-launch-pads-description" }),
		),
		clearSectorOnLose: v.pipe(
			v.optional(v.boolean(), false),
			metadata({ name: "editor.planet.clear-sector-on-lose", description: "editor.planet.clear-sector-on-lose-description" }),
		),
		allowLaunchToNumbered: v.pipe(
			v.optional(v.boolean(), true),
			metadata({ name: "editor.planet.allow-launch-to-numbered", description: "editor.planet.allow-launch-to-numbered-description" }),
		),
		allowCampaignRules: v.pipe(
			v.optional(v.boolean(), false),
			metadata({ name: "editor.planet.allow-campaign-rules", description: "editor.planet.allow-campaign-rules-description" }),
		),
		showRtsAIRule: v.pipe(
			v.optional(v.boolean(), false),
			metadata({ name: "editor.planet.show-rts-ai-rule", description: "editor.planet.show-rts-ai-rule-description" }),
		),
		loadPlanetData: v.pipe(
			v.optional(v.boolean(), false),
			metadata({ name: "editor.planet.load-planet-data", description: "editor.planet.load-planet-data-description" }),
		),
		parent: v.pipe(v.optional(v.string()), metadata({ name: "editor.planet.parent", description: "editor.planet.parent-description" })),
		generator: v.pipe(
			v.optional(v.string()),
			metadata({ name: "editor.planet.generator", description: "editor.planet.generator-description" }),
		),
		statParent: v.pipe(
			v.optional(v.string()),
			metadata({ name: "editor.planet.stat-parent", description: "editor.planet.stat-parent-description" }),
		),
		defaultCore: v.pipe(
			v.optional(v.string()),
			metadata({ name: "editor.planet.default-core", description: "editor.planet.default-core-description" }),
		),
		launchMusic: v.pipe(
			v.optional(v.string()),
			metadata({ name: "editor.planet.launch-music", description: "editor.planet.launch-music-description" }),
		),
		techTree: v.pipe(
			v.optional(v.string()),
			metadata({ name: "editor.planet.tech-tree", description: "editor.planet.tech-tree-description" }),
		),
		launchCandidates: v.pipe(
			v.optional(v.array(v.string())),
			metadata({ name: "editor.planet.launch-candidates", description: "editor.planet.launch-candidates-description" }),
		),
		unlockedOnLand: v.pipe(
			v.optional(v.array(v.string())),
			metadata({ name: "editor.planet.unlocked-on-land", description: "editor.planet.unlocked-on-land-description" }),
		),
		sectorCaptureReplacements: v.pipe(
			v.optional(v.record(v.string(), v.string())),
			metadata({
				name: "editor.planet.sector-capture-replacements",
				description: "editor.planet.sector-capture-replacements-description",
			}),
		),
	}),
);

export const PlanetHjsonSchema: SchemaFn = (context) =>
	v.object({
		...PlanetSchema(context).entries,
		research: v.optional(ResearchSchema(context)),
	});
