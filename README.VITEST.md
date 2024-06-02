# Switching from Jest to Vitest

- [Vitest](https://vitest.dev/) works well as an alternative backup test runner to Jest.
- Note 1: It has out-of-the-box support for ES Modules, JSX and TypeScript.
- Note 2: I haven't tested how it handles transforms (ex: when importing a SVG file into a JS/TS file).

## Package(s) to install

```shell
npm install --save --save-exact vitest @vitest/coverage-v8
```

## Changes to `package.json` file

```json
{
	"scripts": {
		"test:unit": "vitest --config ./lib/vitest.config.js",
		"test:unit:coverage": "npm run test:run -- --coverage.enabled",
		"test:unit:run": "npm run test:unit -- run",
		"test:unit:watch": "npm run test:unit -- watch"
	}
}
```

## Changes to `src/lint-staged.config.test.ts` file

```ts
test("unit testing", () => {
	// @ts-expect-error TODO: Figure out how to correctly type the function on this configuration object.
	expect(lintstagedConfig["*.{js,jsx,json,ts,tsx}"](relativePaths)).toEqual(
		`npm run test:unit -- related --run ${relativePath} --coverage.enabled --coverage.include=${relativePath}`,
	);
});
```

## Changes to `src/lint-staged.config.ts` file

```ts
const lintstagedConfig: Config = {
	// This repo has unit tests for JSON files, so include them in the glob pattern.
	"*.{js,jsx,json,ts,tsx}": (relativePaths) => {
		const filesToIncludeInCoverage = relativePaths.map(
			// Use `--coverage.include` to generate a scoped test coverage report.
			(relativePath) => `--coverage.include=${relativePath}`,
		);

		const vitestCommand =
			"npm run vitest --" +
			// Excerpt from https://vitest.dev/guide/cli.html#vitest-related:
			// > Run only tests that cover a list of source files. All files should be relative to root folder.
			` related --run ${relativePaths.join(" ")}` +
			// > Excerpt from https://vitest.dev/config/#coverage-include:
			// > List of files included in coverage as glob patterns.
			` --coverage.enabled ${filesToIncludeInCoverage.join(" ")}`;

		return vitestCommand;
	},
};
```

## `src/vitest.config.test.ts`

```ts
import {makeVitestConfig} from "./vitest.config.js";

// jest.mock("vitest/config", () => ({
// 	// Explicitly mock out `defineConfig` to prevent the following warning from being logged during the Jest test run:
// 	// > warnCjsUsage - The CJS build of Vite's Node API is deprecated.
// 	defineConfig: jest.fn(),
// }));

test("it exports a configuration object and the most important config options are correct", () => {
	const vitestConfig = makeVitestConfig();

	expect(typeof vitestConfig).toEqual("object");

	expect(vitestConfig.test?.coverage?.provider).toEqual("v8");
	expect(vitestConfig.test?.globals).toBe(true);
});
```

## `src/vitest.config.ts`

```ts
import {defineConfig, type UserConfig} from "vitest/config";

/** https://vitest.dev/config/ */
export const makeVitestConfig = (): UserConfig =>
	({
		test: {
			exclude: ["**/lib/**", "**/node_modules/**"],
			coverage: {
				// Excerpt from https://vitest.dev/config/#coverage-exclude:
				// > List of files excluded from coverage as glob patterns.
				exclude: [
					"lib/**",
					// Vitest excludes certain configuration files by default; use a negated ignore pattern to include them in the coverage report.
					"!src/*.config.*",
				],
				provider: "v8",
				reporter: ["text", "text-summary"],
				thresholds: {
					"100": true,
				},
			},
			// Excerpt from https://vitest.dev/config/#globals:
			// > By default, `vitest` does not provide global APIs for explicitness. If you prefer to use the APIs globally
			// > like Jest, you can pass the `--globals` option to CLI or add `globals: true` in the config.
			//
			// Excerpt from https://vitest.dev/guide/migration.html#globals-as-a-default:
			// > Jest has their globals API enabled by default. Vitest does not. You can either enable globals via the
			// > `globals` configuration setting or update your code to use imports from the `vitest` module instead.
			// >
			// > If you decide to keep globals disabled, be aware that common libraries like `testing-library` will not run auto DOM cleanup.
			globals: true,
		},
	}) as const;

export default defineConfig(makeVitestConfig());
```

## Changes to unit test files

Replace Jest methods and types (`jest.fn`, `jest.mock`, `jest.MockedFunction`, etc.) with the `vi` equivalents and add `import {type MockedFunction, vi} from "vitest"` statements wherever necessary.
