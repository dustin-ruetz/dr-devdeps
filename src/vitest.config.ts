// Instructions for using Vitest as the test runner:
// 1. `npm install --save --save-exact vitest @vitest/coverage-v8`
// 2. In the package.json file `scripts.githooks:pre-commit` command, set the
//		`TEST_RUNNER=vitest` environment variable right before `lint-staged`.
// 3. Replace Jest methods and types (`jest.fn`, `jest.mock`, `jest.MockedFunction`, etc.) with the `vi` equivalents
//		and add `import {type MockedFunction, vi} from "vitest"` statements wherever necessary.

// import {defineConfig, type UserConfig} from "vitest/config";

/** https://vitest.dev/config/ */
export const makeVitestConfig = () =>
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

// export default defineConfig(makeVitestConfig());
