import type {Config} from "jest";
import {dependsOn} from "./utils/dependsOn.js";
import {getRepoMetadata} from "./utils/getRepoMetadata.js";

/** https://jestjs.io/docs/configuration */
export const makeJestConfig = async (): Promise<Config> => {
	/** Set the test environment based on whether or not the repo has any frontend dependencies. */
	const testEnvironment = (await dependsOn(["pug", "react"]))
		? "jsdom"
		: "node";

	const {absoluteRootDir, dependencyPartialPath, isDevDepsRepo} =
		getRepoMetadata();

	/** Binary file extensions 1) to ignore in test coverage, and 2) to transform the imported values to filenames. */
	const binaryFileExtensions = {
		list: [".jpg", ".png", ".woff2"],
		makeTransformRegExp() {
			return `(${this.list.join("|")})`;
		},
	} as const;

	/** Folder/file patterns to ignore for all repos. */
	const ignorePatterns = [
		"<rootDir>/lib/",
		"<rootDir>/node_modules/",
		"<rootDir>/www/",
		".mock.(js|ts)",
	] as const;

	/**
	 * Folder/file patterns to ignore for this dr-devdeps repo because
	 * the unit tests are using `vi` instead of `jest` for mocking.
	 */
	// const devDepsIgnorePatterns = !isDevDepsRepo
	// 	? ([
	// 			"<rootDir>/scripts/",
	// 			"<rootDir>/src/utils/",
	// 			"<rootDir>/src/jest.config.ts",
	// 			"<rootDir>/src/jest.config.test.ts",
	// 		] as const)
	// 	: ([] as const);

	/** The base path to the files/packages used as Jest transformers. */
	const transformerBasePath = isDevDepsRepo
		? // If running tests on this `dr-devdeps` repo, set the path relative to the Jest <rootDir>.
			("<rootDir>" as const)
		: // If running tests on a `consuming-repo`, set the path relative to its `dr-devdeps` dependency.
			(`<rootDir>/${dependencyPartialPath}` as const);

	return {
		// Specify `collectCoverageFrom` to ensure that Jest collects test coverage for all JavaScript and TypeScript files.
		// Excerpt from https://jestjs.io/docs/configuration#collectcoveragefrom-array:
		// > An array of glob patterns indicating a set of files for which coverage information should be collected.
		// > If a file matches the specified glob pattern, coverage information will be collected for it even if
		// > no tests exist for this file and it's never required in the test suite.
		collectCoverageFrom: ["**/*.{js,jsx,ts,tsx}"],
		// https://stackoverflow.com/questions/69567201/coveragepathignorepatterns-ignore-files-with-specific-ending
		coveragePathIgnorePatterns: [
			...ignorePatterns,
			...binaryFileExtensions.list,
			// ...devDepsIgnorePatterns,
		],
		// Set coverage provider as v8 to align with the Vitest default.
		coverageProvider: "v8",
		// Specify `coverageReporters` to prevent the default reporters from writing a coverage/ directory to disk.
		coverageReporters: ["text", "text-summary"],
		coverageThreshold: {
			global: {
				branches: 100,
				functions: 100,
				lines: 100,
				statements: 100,
			},
		},
		// Excerpt from https://jestjs.io/docs/configuration#extensionstotreatasesm-arraystring:
		// > Jest will run `.mjs` and `.js` files with nearest `package.json`'s `type` field set to `module` as ECMAScript Modules.
		// > If you have any other files that should run with native ESM, you need to specify their file extension here.
		extensionsToTreatAsEsm: [".jsx", ".ts", ".tsx"],
		// Excerpt from https://jestjs.io/docs/configuration#modulefileextensions-arraystring:
		// > We recommend placing the extensions most commonly used in your project on the left, so if you are
		// > using TypeScript, you may want to consider moving "ts" and/or "tsx" to the beginning of the array.
		moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json"],
		// TypeScript knows how to map imported files with the ".js" extension to their ".ts" counterparts. Jest
		// doesn't handle this automatically, so specify `moduleNameMapper` to handle `.js` and `.jsx` file extensions.
		// Excerpt from https://jestjs.io/docs/configuration#modulenamemapper-objectstring-string--arraystring:
		// > A map from regular expressions to module names or to arrays of module names that
		// > allow to stub out resources, like images or styles with a single module.
		moduleNameMapper: {
			// https://github.com/kulshekhar/ts-jest/issues/1057#issuecomment-1482644543:
			"^(\\.\\.?\\/.+)\\.(js|jsx)": "$1",
		},
		// Note that while `rootDir` is set to an absolute path here, Jest also knows how to interpret relative paths. For example,
		// a consuming repo depending on dr-devdeps could use "../../../" as the path to traverse three levels upwards to hit root.
		// (i.e. starting from lib/, move upwards three times: dr-devdeps/ ^ node_modules/ ^ consuming-repo/)
		// Excerpt from https://jestjs.io/docs/configuration#rootdir-string:
		// > The root directory that Jest should scan for tests and modules within.
		// > Oftentimes, you'll want to set this to `"src"` or `"lib"`, corresponding to where in your repository the code is stored.
		rootDir: absoluteRootDir,
		// Excerpt from https://jestjs.io/docs/configuration#testenvironment-string:
		// > The test environment that will be used for testing. The default environment in Jest is a Node.js environment.
		// > If you are building a web app, you can use a browser-like environment through `jsdom` instead.
		testEnvironment,
		testPathIgnorePatterns: [
			...ignorePatterns,
			// ...devDepsIgnorePatterns
		],
		// Excerpt from https://jestjs.io/docs/configuration#transform-objectstring-pathtotransformer--pathtotransformer-object:
		// > A map from regular expressions to paths to transformers.
		// > Jest runs the code of your project as JavaScript, hence a transformer is needed if you use some syntax
		// > not supported by Node out of the box (such as JSX, TypeScript, Vue templates).
		transform: {
			[binaryFileExtensions.makeTransformRegExp()]: `${transformerBasePath}/lib/jest-transformers/binaryFile.js`,
			// Both Babel and ts-jest are cumbersome to use for transforming TypeScript, so use @swc/jest instead for its simplicity.
			// https://github.com/swc-project/pkgs/tree/main/packages/jest
			".(js|jsx|ts|tsx)": "@swc/jest",
			".svg": `${transformerBasePath}/lib/jest-transformers/svgFile.js`,
		},
		// Don't transform anything in node_modules/ and don't transform .json files.
		transformIgnorePatterns: ["<rootDir>/node_modules/", ".json"],
		verbose: true,
	} as const;
};

export default makeJestConfig();
