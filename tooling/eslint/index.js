import tseslint from "typescript-eslint";
import reactPlugin from "eslint-plugin-react";
import reactHooksPlugin from "eslint-plugin-react-hooks";

export default tseslint.config(
	{ ignores: ["**/dist/**", "**/.next/**", "**/node_modules/**"] },
	{
		extends: [...tseslint.configs.recommended],
		plugins: {
			react: reactPlugin,
			"react-hooks": reactHooksPlugin,
		},
		rules: {
			"no-var": "error",
			"react-hooks/rules-of-hooks": "error",
			"react-hooks/exhaustive-deps": "error",
			"@typescript-eslint/no-explicit-any": "error",
			"@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
			"@typescript-eslint/consistent-type-imports": "error",
			"no-restricted-imports": [
				"error",
				{
					patterns: [
						{
							group: ["./../**"],
							message: "Relative imports to parent directories are not allowed. Use absolute imports instead.",
						},
					],
				},
			],
			"no-restricted-syntax": [
				"error",
				{
					selector: "TSImportType[qualifier.name]",
					message: "Use `import type { ... }` instead of inline type import syntax.",
				},
			],
			"@typescript-eslint/consistent-type-assertions": [
				"error",
				{
					assertionStyle: "as", // Enforces 'value as Type'
					objectLiteralTypeAssertions: "never", // Disallows 'as Type' on object literals
				},
			],
		},
		settings: {
			react: { version: "detect" },
		},
	},
);
