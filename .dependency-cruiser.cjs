module.exports = {
	forbidden: [
		{
			name: "no-circular",
			severity: "error",
			from: {
				pathNot: "src/routeTree.gen.ts|src/router.tsx",
			},
			to: { circular: true },
		},
	],
	options: {
		doNotFollow: {
			dependencyTypes: ["npm", "npm-dev", "npm-optional", "npm-peer", "npm-bundled", "npm-no-pkg"],
		},
		tsPreCompilationDeps: true,
		tsConfig: {
			fileName: "tsconfig.json",
		},
		enhancedResolveOptions: {
			exportsFields: ["exports"],
			conditionNames: ["import", "require", "default"],
		},
	},
};
