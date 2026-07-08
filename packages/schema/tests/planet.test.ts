import * as v from "valibot";
import { describe, expect, it } from "vitest";
import { PlanetSchema, PlanetHjsonSchema } from "@project/schema";
import type { ProjectContents } from "@project/types";

const mockContext: ProjectContents = {
	items: [],
	blocks: [],
	liquids: [],
	sectors: [],
	statuses: [],
	units: [],
	sprites: [],
	effects: [],
	sounds: [],
	name: "test-mod",
};

describe("PlanetSchema", () => {
	it("validates a basic planet with required fields", () => {
		const schema = PlanetSchema(mockContext);
		const planet = {
			name: "test-planet",
			radius: 1,
			sectorSize: 6,
			orbitSpacing: 12,
			camRadius: 0,
			position: { x: 0, y: 0, z: 0 },
		};
		const result = v.safeParse(schema, planet);
		expect(result.success).toBe(true);
	});

	it("defaults radius to 1 when not provided", () => {
		const schema = PlanetSchema(mockContext);
		const planet = { name: "test-planet" };
		const result = v.safeParse(schema, planet);
		expect(result.success).toBe(true);
		if (result.success) {
			expect(result.output.radius).toBe(1);
		}
	});

	it("rejects zero or negative radius", () => {
		const schema = PlanetSchema(mockContext);
		expect(v.safeParse(schema, { name: "test", radius: 0 }).success).toBe(false);
		expect(v.safeParse(schema, { name: "test", radius: -1 }).success).toBe(false);
	});

	it("rejects non-integer sectorSize", () => {
		const schema = PlanetSchema(mockContext);
		expect(v.safeParse(schema, { name: "test", sectorSize: 1.5 }).success).toBe(false);
	});

	it("validates orbital boolean fields", () => {
		const schema = PlanetSchema(mockContext);
		const planet = {
			name: "test",
			drawOrbit: true,
			tidalLock: false,
			bloom: false,
			visible: true,
			hasAtmosphere: true,
		};
		const result = v.safeParse(schema, planet);
		expect(result.success).toBe(true);
	});

	it("validates atmosphere color hex values", () => {
		const schema = PlanetSchema(mockContext);
		const planet = {
			name: "test",
			landCloudColor: "ffffff",
			lightColor: "ff0000",
			atmosphereColor: "4cb2ff",
			iconColor: "ffffff",
		};
		const result = v.safeParse(schema, planet);
		expect(result.success).toBe(true);
	});

	it("rejects invalid hex color values", () => {
		const schema = PlanetSchema(mockContext);
		expect(v.safeParse(schema, { name: "test", atmosphereColor: "xyz" }).success).toBe(false);
		expect(v.safeParse(schema, { name: "test", lightColor: "ghijklmn" }).success).toBe(false);
	});

	it("validates normalized light values (0-1)", () => {
		const schema = PlanetSchema(mockContext);
		const planet = {
			name: "test",
			lightSrcFrom: 0,
			lightSrcTo: 0.8,
			lightDstFrom: 0.2,
			lightDstTo: 1,
		};
		const result = v.safeParse(schema, planet);
		expect(result.success).toBe(true);
	});

	it("rejects light values outside 0-1 range", () => {
		const schema = PlanetSchema(mockContext);
		expect(v.safeParse(schema, { name: "test", lightSrcFrom: -0.1 }).success).toBe(false);
		expect(v.safeParse(schema, { name: "test", lightSrcTo: 1.5 }).success).toBe(false);
	});

	it("validates content reference fields as strings", () => {
		const schema = PlanetSchema(mockContext);
		const planet = {
			name: "test",
			parent: "serpulo",
			generator: "mindustry.maps.planet.SerpuloPlanetGenerator",
			statParent: "serpulo",
			defaultCore: "core-shard",
			launchMusic: "music.launch",
			techTree: "serpulo-tech",
		};
		const result = v.safeParse(schema, planet);
		expect(result.success).toBe(true);
	});

	it("validates launchCandidates as string array", () => {
		const schema = PlanetSchema(mockContext);
		const planet = {
			name: "test",
			launchCandidates: ["serpulo", "erekir"],
		};
		const result = v.safeParse(schema, planet);
		expect(result.success).toBe(true);
	});

	it("validates unlockedOnLand as string array", () => {
		const schema = PlanetSchema(mockContext);
		const planet = {
			name: "test",
			unlockedOnLand: ["item1", "item2"],
		};
		const result = v.safeParse(schema, planet);
		expect(result.success).toBe(true);
	});

	it("validates sectorCaptureReplacements as string map", () => {
		const schema = PlanetSchema(mockContext);
		const planet = {
			name: "test",
			sectorCaptureReplacements: { "stone-wall": "metal-floor" },
		};
		const result = v.safeParse(schema, planet);
		expect(result.success).toBe(true);
	});

	it("validates boolean gameplay fields", () => {
		const schema = PlanetSchema(mockContext);
		const planet = {
			name: "test",
			accessible: true,
			enemyInfiniteItems: false,
			prebuildBase: true,
			allowWaves: false,
			allowSectorInvasion: false,
			clearSectorOnLose: false,
		};
		const result = v.safeParse(schema, planet);
		expect(result.success).toBe(true);
	});

	it("validates numeric fields with defaults", () => {
		const schema = PlanetSchema(mockContext);
		const result = v.safeParse(schema, { name: "test" });
		expect(result.success).toBe(true);
		if (result.success) {
			expect(result.output.minZoom).toBe(0.5);
			expect(result.output.maxZoom).toBe(2);
			expect(result.output.rotateTime).toBe(1440);
			expect(result.output.startSector).toBe(0);
			expect(result.output.sectorSeed).toBe(-1);
			expect(result.output.launchCapacityMultiplier).toBe(0.25);
			expect(result.output.enemyBuildSpeedMultiplier).toBe(1);
		}
	});

	it("rejects non-integer startSector", () => {
		const schema = PlanetSchema(mockContext);
		expect(v.safeParse(schema, { name: "test", startSector: 1.5 }).success).toBe(false);
	});
});

describe("PlanetHjsonSchema", () => {
	it("validates a planet with research field", () => {
		const ctx: ProjectContents = {
			...mockContext,
			items: [{ name: "test-mod-test-item", type: "project", path: "", contentType: "items" }],
		};
		const schema = PlanetHjsonSchema(ctx);
		const planet = {
			name: "test-planet",
			radius: 1,
			research: { parent: "test-item", requirements: [] },
		};
		const result = v.safeParse(schema, planet);
		expect(result.success).toBe(true);
	});

	it("accepts planet without research", () => {
		const schema = PlanetHjsonSchema(mockContext);
		const planet = { name: "test-planet", radius: 1 };
		const result = v.safeParse(schema, planet);
		expect(result.success).toBe(true);
	});
});

describe("Planet mesh schemas", () => {
	it("validates a NoiseMesh via planet mesh field", () => {
		const schema = PlanetSchema(mockContext);
		const planet = {
			name: "test",
			mesh: { type: "NoiseMesh", divisions: 4, octaves: 2, color1: "ff0000", color2: "00ff00" },
		};
		const result = v.safeParse(schema, planet);
		expect(result.success).toBe(true);
	});

	it("validates NoiseMesh with default values", () => {
		const schema = PlanetSchema(mockContext);
		const planet = {
			name: "test",
			mesh: { divisions: 4, octaves: 2 },
		};
		const result = v.safeParse(schema, planet);
		expect(result.success).toBe(true);
		if (result.success) {
			expect(result.output.mesh.seed).toBe(0);
			expect(result.output.mesh.radius).toBe(1);
			expect(result.output.mesh.persistence).toBe(0.5);
		}
	});

	it("rejects NoiseMesh with zero divisions", () => {
		const schema = PlanetSchema(mockContext);
		expect(v.safeParse(schema, { name: "test", mesh: { divisions: 0 } }).success).toBe(false);
	});

	it("rejects invalid hex color in NoiseMesh", () => {
		const schema = PlanetSchema(mockContext);
		expect(v.safeParse(schema, { name: "test", mesh: { color1: "xyz" } }).success).toBe(false);
	});

	it("validates a SunMesh via planet mesh field", () => {
		const schema = PlanetSchema(mockContext);
		const planet = {
			name: "test",
			mesh: { type: "SunMesh", divisions: 4, octaves: 2, colors: ["ff0000", "00ff00", "0000ff"] },
		};
		const result = v.safeParse(schema, planet);
		expect(result.success).toBe(true);
	});

	it("validates SunMesh with minimal fields", () => {
		const schema = PlanetSchema(mockContext);
		const planet = {
			name: "test",
			mesh: { type: "SunMesh", colors: ["ffffff"] },
		};
		const result = v.safeParse(schema, planet);
		expect(result.success).toBe(true);
		if (result.success) {
			expect(result.output.mesh.divisions).toBe(1);
			expect(result.output.mesh.persistence).toBe(0.5);
		}
	});

	it("validates a HexSkyMesh via planet mesh field", () => {
		const schema = PlanetSchema(mockContext);
		const planet = {
			name: "test",
			mesh: { type: "HexSkyMesh", divisions: 6, color: "4cb2ff", speed: 0.5 },
		};
		const result = v.safeParse(schema, planet);
		expect(result.success).toBe(true);
	});

	it("validates HexSkyMesh with default values", () => {
		const schema = PlanetSchema(mockContext);
		const planet = {
			name: "test",
			mesh: { type: "HexSkyMesh" },
		};
		const result = v.safeParse(schema, planet);
		expect(result.success).toBe(true);
		if (result.success) {
			expect(result.output.mesh.divisions).toBe(3);
			expect(result.output.mesh.radius).toBe(1);
		}
	});

	it("validates a MatMesh with nested mesh", () => {
		const schema = PlanetSchema(mockContext);
		const planet = {
			name: "test",
			mesh: { type: "MatMesh", mesh: { type: "NoiseMesh", divisions: 4, octaves: 2 }, mat: {} },
		};
		const result = v.safeParse(schema, planet);
		expect(result.success).toBe(true);
	});

	it("validates a MultiMesh object form", () => {
		const schema = PlanetSchema(mockContext);
		const planet = {
			name: "test",
			mesh: { type: "MultiMesh", meshes: [{ divisions: 2, octaves: 1 }, { divisions: 3, octaves: 2 }] },
		};
		const result = v.safeParse(schema, planet);
		expect(result.success).toBe(true);
	});

	it("validates a mesh array (multiMesh shorthand)", () => {
		const schema = PlanetSchema(mockContext);
		const planet = {
			name: "test",
			mesh: [{ divisions: 2, octaves: 1 }, { divisions: 3, octaves: 2 }],
		};
		const result = v.safeParse(schema, planet);
		expect(result.success).toBe(true);
	});

	it("validates cloudMesh with mesh schema", () => {
		const schema = PlanetSchema(mockContext);
		const planet = {
			name: "test",
			cloudMesh: { type: "HexSkyMesh", divisions: 4, color: "ffffff" },
		};
		const result = v.safeParse(schema, planet);
		expect(result.success).toBe(true);
	});
});
