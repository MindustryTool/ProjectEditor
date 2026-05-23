import { defineConfig } from "vitest/config";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
	resolve: { tsconfigPaths: true },
	plugins: [viteReact(), tailwindcss()],
	test: {
		environment: "node",
	},
});
