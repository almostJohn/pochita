import eslintRecommended from "@eslint/js";

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
		rules: {
			"no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
			eqeqeq: ["error", "always"],
			curly: "error",
			semi: ["error", "always"],
			quotes: ["error", "double"],
		},
	},
];
