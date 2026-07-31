import * as v from "valibot";
import { describe, expect, it } from "vitest";
import { WeatherHjsonSchema } from "@project/schema";
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
	weathers: [],
	name: "test-mod",
};

describe("WeatherHjsonSchema", () => {
	it("validates a basic ParticleWeather with required fields", () => {
		const schema = WeatherHjsonSchema(mockContext);
		const weather = {
			name: "test-weather",
			type: "ParticleWeather",
			color: "ffffff",
			drawNoise: true,
			duration: 36000,
		};
		const result = v.safeParse(schema, weather);
		expect(result.success).toBe(true);
	});

	it("defaults type to ParticleWeather", () => {
		const schema = WeatherHjsonSchema(mockContext);
		const weather = { name: "test-weather" };
		const result = v.safeParse(schema, weather);
		expect(result.success).toBe(true);
		if (result.success) {
			expect(result.output).toMatchObject({ type: "ParticleWeather" });
		}
	});

	it("applies Java defaults for missing ParticleWeather fields", () => {
		const schema = WeatherHjsonSchema(mockContext);
		const weather = { name: "test-weather", type: "ParticleWeather" };
		const result = v.safeParse(schema, weather);
		expect(result.success).toBe(true);
		if (result.success) {
			expect(result.output).toMatchObject({
				hidden: false,
				drawParticles: true,
				useWindVector: false,
				statusAir: true,
				statusGround: true,
				randomParticleRotation: false,
			});
		}
	});

	it("applies Java defaults for missing RainWeather fields", () => {
		const schema = WeatherHjsonSchema(mockContext);
		const weather = { name: "test-weather", type: "RainWeather" };
		const result = v.safeParse(schema, weather);
		expect(result.success).toBe(true);
		if (result.success) {
			expect(result.output).toMatchObject({
				yspeed: 5,
				xspeed: 1.5,
				sizeMin: 8,
				sizeMax: 40,
				splashTimeScale: 22,
				color: "7a95eaff",
			});
		}
	});

	it("rejects an invalid hex color", () => {
		const schema = WeatherHjsonSchema(mockContext);
		expect(v.safeParse(schema, { name: "test-weather", type: "ParticleWeather", color: "not-a-color" }).success).toBe(false);
	});

	it("rejects an unknown weather type", () => {
		const schema = WeatherHjsonSchema(mockContext);
		expect(v.safeParse(schema, { name: "test-weather", type: "NotAWeather" }).success).toBe(false);
	});

	it("accepts a known liquid reference for RainWeather", () => {
		const ctx: ProjectContents = {
			...mockContext,
			liquids: [{ name: "test-mod-water", type: "project", path: "", contentType: "liquids" }],
		};
		const schema = WeatherHjsonSchema(ctx);
		const weather = { name: "test-weather", type: "RainWeather", liquid: "water" };
		const result = v.safeParse(schema, weather);
		expect(result.success).toBe(true);
	});

	it("rejects an unknown liquid reference for RainWeather", () => {
		const ctx: ProjectContents = {
			...mockContext,
			liquids: [{ name: "test-mod-water", type: "project", path: "", contentType: "liquids" }],
		};
		const schema = WeatherHjsonSchema(ctx);
		const weather = { name: "test-weather", type: "RainWeather", liquid: "unknown-liquid" };
		const result = v.safeParse(schema, weather);
		expect(result.success).toBe(false);
	});

	it("accepts a known status reference", () => {
		const ctx: ProjectContents = {
			...mockContext,
			statuses: [{ name: "test-mod-wet", type: "project", path: "", contentType: "statuses" }],
		};
		const schema = WeatherHjsonSchema(ctx);
		const weather = { name: "test-weather", type: "ParticleWeather", status: "wet" };
		const result = v.safeParse(schema, weather);
		expect(result.success).toBe(true);
	});
});
