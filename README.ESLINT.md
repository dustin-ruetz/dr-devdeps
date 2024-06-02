# Upgrading ESLint from v8 to v9

**Important:** Wait until `typescript-eslint` supports ESLint v9 before trying to upgrade.

## Changes to `package.json` file

1. Update dependencies.

```sh
npm uninstall --save @typescript-eslint/eslint-plugin @typescript-eslint/parser

npm install --save --save-exact @eslint/js@ @types/eslint__js eslint@9 globals typescript-eslint
```

2. Update `build` scripts.

```json
"build:cjs": "DELETE",
"build:esm": "DELETE",
"build": "tsc --project ./tsconfig.build.json",
"postbuild": "DELETE",
```

3. Update `lint` scripts.

```json
"// lint": "Scripts for linting the codebase.",
"lint": "eslint --config ./lib/eslint.config.js",
"lint:check": "npm run lint -- ./",
"lint:fix": "npm run lint -- --fix ./",
```

4. Remove `eslintConfig` key.

## Changes to `.vscode/settings.json` file

```json
// https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint
"eslint.options": {
	"ignore": ".gitignore",
	"overrideConfigFile": "lib/eslint.config.js"
}
```

## Changes to `tsconfig` files

1. Create the `tsconfig.build.json` file.

```json
{
	"extends": "./tsconfig.json",
	"exclude": ["**/*.mock.*", "**/*.test.*"]
}
```

2. Delete the `tsconfig.cjs.json` and `tsconfig.esm.json` files.

## Update `lint-staged.config.ts` file

```ts
`npm run lint -- --fix ${relativePaths.join(" ")}`,
```

## Delete `postbuild` files

1. `scripts/postbuild.test.js`
1. `scripts/postbuild.js`

## Update `eslint.config.ts` file

```ts
import js from "@eslint/js";
import globals from "globals";

const eslintConfig = [
	js.configs.recommended,
	{
		ignores: ["!*.*.js", "!*.*.ts"],
		languageOptions: {
			globals: {
				...globals.browser,
				...globals.jest,
				...globals.node,
			},
		},
		rules: {},
	},
	// Overrides.
	{
		files: ["*.test.+(js|jsx|ts|tsx)"],
		rules: {
			"no-magic-numbers": "off",
		},
	},
] as const;

export default eslintConfig;
```
