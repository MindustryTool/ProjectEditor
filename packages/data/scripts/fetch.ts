import axios, { type AxiosError } from "axios";
import { API_BASE_URL } from "@project/config";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const GENERATED_DIR = path.resolve(__dirname, "../src/generated");

const client = axios.create({
	baseURL: API_BASE_URL,
	timeout: 30_000,
	headers: { Accept: "application/json" },
});

type Endpoint = {
	path: string;
	exportName: string;
	typeName: string;
	filterMod: boolean;
	fileName: string;
};

const ENDPOINTS: Endpoint[] = [
	{ path: "/items", exportName: "baseItems", typeName: "Item", filterMod: true, fileName: "items" },
	{ path: "/blocks", exportName: "baseBlocks", typeName: "Block", filterMod: true, fileName: "blocks" },
	{ path: "/env-blocks", exportName: "baseEnvBlocks", typeName: "EnvBlock", filterMod: true, fileName: "env-blocks" },
	{ path: "/liquids", exportName: "baseLiquids", typeName: "Liquid", filterMod: true, fileName: "liquids" },
	{ path: "/units", exportName: "baseUnits", typeName: "Unit", filterMod: true, fileName: "units" },
	{ path: "/sectors", exportName: "baseSectors", typeName: "Sector", filterMod: true, fileName: "sectors" },
	{ path: "/effects", exportName: "baseEffects", typeName: "Effect", filterMod: false, fileName: "effects" },
	{ path: "/statuses", exportName: "baseStatuses", typeName: "Status", filterMod: true, fileName: "statuses" },
	{ path: "/sounds", exportName: "baseSounds", typeName: "Sound", filterMod: false, fileName: "sounds" },
];

const SPRITES_DIR = path.resolve(__dirname, "../../../apps/web/public/sprites");

async function collectSpritePaths(): Promise<string[]> {
	const paths: string[] = [];

	async function walk(dir: string): Promise<void> {
		const entries = await fs.readdir(dir, { withFileTypes: true });
		for (const entry of entries) {
			const fullPath = path.join(dir, entry.name);
			if (entry.isDirectory()) {
				await walk(fullPath);
			} else if (entry.isFile()) {
				const relative = path.relative(SPRITES_DIR, fullPath).replace(/\\/g, "/");
				paths.push(relative);
			}
		}
	}

	await walk(SPRITES_DIR);
	return paths.sort();
}

async function sleep(ms: number) {
	return new Promise((r) => setTimeout(r, ms));
}

async function fetchWithRetry<T>(endpoint: Endpoint, attempt = 1): Promise<T[]> {
	try {
		const response = await client.get<T[]>(endpoint.path);
		let data = response.data;
		if (endpoint.filterMod) {
			data = data.filter((item) => (item as { mod: string | null }).mod === null);
		}
		return data;
	} catch (err) {
		const error = err as AxiosError;
		console.error(`Failed to fetch ${endpoint.path} (attempt ${attempt}/3): ${error.message}`);
		if (attempt < 3) {
			const delay = 1000 * 2 ** (attempt - 1);
			await sleep(delay);
			return fetchWithRetry<T>(endpoint, attempt + 1);
		}
		const status = error.response?.status ? ` (HTTP ${error.response.status})` : "";
		console.error(`FATAL: Could not fetch ${endpoint.path} after 3 attempts${status}`);
		process.exit(1);
	}
}

type TypeImport = { typeName: string; source: string };

function generateFileContent(endpoint: Endpoint, data: unknown[], imports: TypeImport[]): string {
	const typeName = endpoint.typeName;
	const lines: string[] = [];

	for (const imp of imports) {
		lines.push(`import type { ${imp.typeName} } from "${imp.source}";`);
	}
	lines.push("");
	lines.push(`export const ${endpoint.exportName}: readonly ${typeName}[] = ${JSON.stringify(data, null, 2)} as const;`);
	lines.push("");

	return lines.join("\n");
}

async function main() {
	await fs.mkdir(GENERATED_DIR, { recursive: true });

	console.log("Collecting sprite assets...");
	const spritePaths = await collectSpritePaths();
	console.log(`Found ${spritePaths.length} sprite assets`);

	console.log("Fetching base game data from", API_BASE_URL);

	const results = await Promise.all(
		ENDPOINTS.map(async (endpoint) => {
			const data = await fetchWithRetry<Record<string, unknown>>(endpoint);
			return { endpoint, data };
		}),
	);

	for (const { endpoint, data } of results) {
		const imports: TypeImport[] = [{ typeName: endpoint.typeName, source: "@project/api" }];
		const content = generateFileContent(endpoint, data, imports);
		const filePath = path.join(GENERATED_DIR, `${endpoint.fileName}.ts`);
		await fs.writeFile(filePath, content, "utf-8");
		console.log(`Generated ${endpoint.fileName}.ts (${data.length} entries)`);
	}

	const spriteContent = `export const spriteAssets: readonly string[] = ${JSON.stringify(spritePaths, null, 2)} as const;\n`;
	await fs.writeFile(path.join(GENERATED_DIR, "sprites.ts"), spriteContent, "utf-8");
	console.log(`Generated sprites.ts (${spritePaths.length} entries)`);

	console.log("All base game data fetched and generated successfully.");
}

main().catch((err) => {
	console.error("Fatal error:", err);
	process.exit(1);
});
