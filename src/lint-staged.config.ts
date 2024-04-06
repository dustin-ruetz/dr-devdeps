import type {Config} from "lint-staged";

/** https://github.com/lint-staged/lint-staged */
const lintstagedConfig: Config = {
	/**
	 * Note: Run "format" and "lint" as their base scripts (i.e. _not_ "format:check" and "lint:check") because
	 * lint-staged passes the staged file(s) by appending the path(s) as the last argument to the commands.
	 */
	// Fix code formatting for all file types that Prettier supports.
	"*": "npm run format -- --ignore-unknown --write",
	"*.{js,jsx,ts,tsx}": (relativePaths) => [
		// Fix code issues for all file types that ESLint supports.
		`npm run lint -- --fix ${relativePaths.join(" ")}`,
		// The "typecheck" script runs the TypeScript compiler (tsc), but tsc ignores the tsconfig.json configuration file due to the
		// file paths that are appended to the command by lint-staged. Work around this limitation by making this config option
		// a function that typechecks the entire codebase, i.e. not just the staged files.
		//
		// Issues with more details:
		// - https://github.com/lint-staged/lint-staged/issues/825
		// - https://github.com/microsoft/TypeScript/issues/27379
		"npm run typecheck",
	],
	// This repo has unit tests for JSON files, so include them in the glob pattern.
	"*.{js,jsx,json,ts,tsx}": (relativePaths) => {
		const testRunners = {
			jest: "jest",
			vitest: "vitest",
		} as const;
		const {TEST_RUNNER} = process.env;

		switch (TEST_RUNNER) {
			case testRunners.jest:
			case typeof "undefined":
			default: {
				const jestCommand =
					"npm run test:coverage --" +
					// Excerpt from https://jestjs.io/docs/cli#--findrelatedtests-spaceseparatedlistofsourcefiles:
					// > Find and run the tests that cover a space-separated list of source files that were passed in as arguments.
					// > Useful for pre-commit hook integration to run the minimal amount of tests necessary.
					" --findRelatedTests" +
					// Excerpt from https://jestjs.io/docs/cli#--collectcoveragefromglob:
					// > A glob pattern relative to `rootDir` matching the files that coverage info needs to be collected from.
					" --collectCoverageFrom=" +
					// Important: Add a space between `--collectCoverageFrom=` and the relative paths to properly scope the coverage report.
					` ${relativePaths.join(" ")}`;

				return jestCommand;
			}
			case testRunners.vitest: {
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
			}
		}
	},
} as const;

export default lintstagedConfig;
