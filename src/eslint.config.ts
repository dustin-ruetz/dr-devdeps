import type {Linter} from "eslint";

/** https://eslint.org/docs/latest/use/configure/ */
export const eslintConfig: Linter.Config = {
	// Excerpt from https://eslint.org/docs/latest/use/configure/language-options#specifying-environments:
	// > An environment provides predefined global variables.
	env: {
		browser: true,
		es2024: true,
		jest: true,
		node: true,
	},
	// Excerpt from https://eslint.org/docs/latest/use/configure/configuration-files#extending-configuration-files:
	// > A configuration file, once extended, can inherit all the traits of another configuration file
	// > (including rules, plugins, and language options) and modify all the options.
	extends: [
		// Excerpt from https://eslint.org/docs/latest/use/configure/configuration-files#using-eslintrecommended:
		// > Using `"eslint:recommended"` in the `extends` property enables a subset of core rules that report common problems.
		"eslint:recommended",
		// Excerpt from https://typescript-eslint.io/linting/configs#eslint-recommended:
		// > This ruleset is meant to be used after extending `eslint:recommended`. It disables core ESLint rules
		// > that are already checked by the TypeScript compiler. Additionally, it enables rules that promote
		// > using the more modern constructs TypeScript allows for.
		"plugin:@typescript-eslint/recommended",
	],
	// By default ESLint ignores dotfiles, so use a negated ignore pattern to include them when linting.
	// Note that negating them in .eslintignore results in ESLint reporting errors via the CLI
	// but _not_ the IDE extension; negate them here too to ensure they're linted in the editor.
	// Excerpt from https://eslint.org/docs/latest/use/configure/ignore:
	// > dot-files (except for `.eslintrc.*`) as well as dot-folders and their contents are ignored.
	ignorePatterns: ["!*.*.js", "!*.*.ts"],
	// Excerpt from https://eslint.org/docs/latest/use/configure/parser:
	// > You can use custom parsers to convert JavaScript code into an abstract syntax tree for ESLint to evaluate.
	// > @typescript-eslint/parser - A parser that converts TypeScript into an ESTree-compatible form so it can be used in ESLint.
	parser: "@typescript-eslint/parser",
	// Excerpts from https://eslint.org/docs/latest/use/configure/language-options#specifying-parser-options:
	// > ESLint allows you to specify the JavaScript language options you want to support. By default,
	// > ESLint expects ECMAScript 5 syntax. You can override that setting to enable support for other
	// > ECMAScript versions and JSX using parser options.
	parserOptions: {
		// > Set to `"script"` (default) or `"module"` if your code is in ECMAScript modules.
		sourceType: "module",
	},
	// https://eslint.org/docs/latest/use/configure/plugins
	plugins: ["@typescript-eslint"],
	root: true,
	// https://eslint.org/docs/latest/use/configure/rules
	rules: {
		// https://eslint.org/docs/latest/rules/#possible-problems
		"array-callback-return": ["error", {checkForEach: true}],
		"no-await-in-loop": "error",
		"no-constant-binary-expression": "error",
		"no-constructor-return": "error",
		"no-duplicate-imports": "error",
		"no-new-native-nonconstructor": "error",
		"no-promise-executor-return": "error",
		"no-self-compare": "error",
		"no-template-curly-in-string": "error",
		"no-unmodified-loop-condition": "error",
		"no-unreachable-loop": "error",
		"no-unused-private-class-members": "error",
		"no-use-before-define": "error",
		"require-atomic-updates": "error",
		// https://eslint.org/docs/latest/rules/#suggestions
		"arrow-body-style": "error",
		camelcase: "error",
		curly: "error",
		// Ideally the "dot-notation" rule would be set to "error" below, but this rule often conflicts with the strictest tsconfig
		// `"compilerOptions"` setting the `"noPropertyAccessFromIndexSignature"` option to `true`. Having these errors typechecked
		// is valuable and constantly disabling the `"dot-notation"` rule is tedious, so just don't enable this rule.
		// "dot-notation": "error",
		eqeqeq: "error",
		"guard-for-in": "error",
		"no-array-constructor": "error",
		"no-console": "warn",
		"no-empty-function": "error",
		"no-empty-static-block": "error",
		"no-eq-null": "error",
		"no-eval": "error",
		"no-extend-native": "error",
		"no-extra-bind": "error",
		"no-implicit-coercion": "error",
		"no-implied-eval": "error",
		"no-invalid-this": "error",
		"no-iterator": "error",
		"no-label-var": "error",
		"no-labels": "error",
		"no-lonely-if": "error",
		"no-loop-func": "error",
		"no-magic-numbers": [
			"error",
			{
				enforceConst: true,
				// Allow the following numbers since they're commonly used when working with array methods.
				ignore: [-1, 0, 1],
				// Allow numbers to be used directly when working with arrays to avoid overly-verbose `const firstIndex = 0` declarations.
				ignoreArrayIndexes: true,
			},
		],
		"no-multi-assign": "error",
		"no-multi-str": "error",
		"no-new": "error",
		"no-new-func": "error",
		"no-new-wrappers": "error",
		"no-object-constructor": "error",
		"no-octal-escape": "error",
		"no-param-reassign": "error",
		"no-plusplus": ["error", {allowForLoopAfterthoughts: true}],
		"no-proto": "error",
		"no-return-assign": "error",
		"no-script-url": "error",
		"no-throw-literal": "error",
		"no-undef-init": "error",
		"no-undefined": "error",
		"no-unneeded-ternary": "error",
		"no-unused-expressions": "error",
		"no-useless-call": "error",
		"no-useless-computed-key": "error",
		"no-useless-concat": "error",
		"no-useless-constructor": "error",
		"no-useless-rename": "error",
		"no-useless-return": "error",
		"no-var": "error",
		"object-shorthand": "error",
		"one-var": ["error", "never"],
		"prefer-const": "error",
		"prefer-numeric-literals": "error",
		"prefer-object-has-own": "error",
		"prefer-object-spread": "error",
		"prefer-promise-reject-errors": "error",
		"prefer-spread": "error",
		radix: "error",
		"require-await": "error",
		yoda: "error",
	},
	// Excerpt from https://eslint.org/docs/latest/use/configure/configuration-files#how-do-overrides-work:
	// > It is possible to override settings based on file glob patterns in your configuration by using the `overrides` key.
	overrides: [
		// It's useful to reference arbitrary numbers directly in unit test files, so disable the "no-magic-numbers" rule for tests.
		{
			files: ["*.test.+(js|jsx|ts|tsx)"],
			rules: {
				"no-magic-numbers": "off",
			},
		},
	],
} as const;
