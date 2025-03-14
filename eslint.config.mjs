import eslintRecommended from "@eslint/js";
import importPlugin from "eslint-plugin-import";

export default [
	eslintRecommended.configs.recommended,
	{
		languageOptions: {
			globals: {
				console: "readonly",
				module: "readonly",
				process: "readonly",
			},
		},
		plugins: { import: importPlugin },
		rules: {
			"no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
			eqeqeq: ["error", "always"],
			curly: "error",
			semi: ["error", "always"],
			quotes: ["error", "double"],
		},
	},
];
