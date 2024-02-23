# Upgrading ESLint from v8 to v9

**Important:** Wait ~2-4 weeks before upgrading ESLint-and-friends to v9 to ensure that issues with peer dependencies are resolved.

## Changes to `package.json` file

1. Update dependencies.

```sh
npm uninstall --save @typescript-eslint/eslint-plugin @typescript-eslint/parser

npm install --save --save-exact @eslint/js@9.0.0-beta.1 @types/eslint__js eslint@9.0.0-beta.1 globals

# Note: The following package as of v7.0.2 does not currently support ESLint v9, so just skip installation for now.
# https://github.com/typescript-eslint/typescript-eslint/blob/main/package.json
npm install --save --save-exact typescript-eslint
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
"lint": "DELETE",
"lint:check": "eslint ./",
"lint:fix": "eslint --fix ./",
```

4. Remove `eslintConfig` key.

```json
"// config": "Configuration for Prettier.",
"prettier": "./lib/prettier.config.js"
```

## Create root `eslint.config.js` file

```js
export {default} from "./lib/eslint.config.js";
```

## Changes to `tsconfig` files

1. Create the `tsconfig.build.json` file.

```json
{
	"extends": "./tsconfig.json",
	"exclude": ["**/__tests__/**"]
}
```

2. Delete the `tsconfig.cjs.json` and `tsconfig.esm.json` files.

## Update `lint-staged.config.ts` file

```ts
`eslint --fix ${relativePaths.join(" ")}`;
```

## Delete `postbuild` files

1. `src/__tests__/postbuild.test.js`
1. `src/postbuild.js`

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
