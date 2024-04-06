import {fileURLToPath} from "node:url";
import {getRepoMetadata} from "./getRepoMetadata.js";

jest.mock("node:url", () => ({
	fileURLToPath: jest.fn(),
}));
// Paraphrased excerpt from https://www.mikeborozdin.com/post/changing-jest-mocks-between-tests:
// > Typecast the imported mocked module into a mocked function with writeable properties.
const mockFileURLToPath = fileURLToPath as jest.MockedFunction<
	typeof fileURLToPath
>;

/** Object of static strings and helper methods meant to keep code DRY and organized. */
const absolutePaths = {
	// Start by defining the static partials that comprise the absolute paths.
	base: "/Users/username/repos",
	name: "dr-devdeps",
	partial: "utils/getRepoMetadata",
	// Combine the static partials in the return values of the methods.
	/**
	 * - Simulates path of dr-devdeps being installed as a dependency running from a `node_modules/` folder.
	 * - Rationale: Test the value of `getRepoMetadata().absoluteRootDir` when used by a repository that depends on the `dr-deveps` package.
	 */
	asDependency() {
		return `${this.base}/consuming-repo/node_modules/${this.name}/lib/${this.partial}.js`;
	},
	/**
	 * - Simulates path of this dr-devdeps repo running a compiled `.js` file.
	 * - Rationale: Test the value of `getRepoMetadata().absoluteRootDir` when used in a `lib/*.js` file.
	 */
	asLibraryJavaScriptFile() {
		return `${this.base}/${this.name}/lib/${this.partial}.js`;
	},
	/**
	 * - Simulates path of this dr-devdeps repo running a source `.ts` file.
	 * - Rationale: Test the value of `getRepoMetadata().absoluteRootDir` during a test run in a `src/*.ts` test file.
	 */
	asSourceTypeScriptFile() {
		return `${this.base}/${this.name}/src/${this.partial}.ts`;
	},
} as const;

test("throws an error if partialPath is not present within absolutePath", () => {
	const absolutePath = `${absolutePaths.base}/bad-path`;
	mockFileURLToPath.mockReturnValue(absolutePath);

	expect(() => {
		getRepoMetadata();
	}).toThrow(/ERR_PATH_MISMATCH/);
});

describe("it determines the correct absolute root directory", () => {
	test("when installed as a dependency running from a `node_modules/` folder", () => {
		const absolutePath = absolutePaths.asDependency();
		mockFileURLToPath.mockReturnValue(absolutePath);

		const {absoluteRootDir, dependencyPartialPath, isDevDepsRepo} =
			getRepoMetadata();

		expect(absoluteRootDir).toEqual("/Users/username/repos/consuming-repo");
		expect(dependencyPartialPath).toEqual("node_modules/dr-devdeps");
		expect(isDevDepsRepo).toBe(false);
	});

	test("when run as a JavaScript file inside the lib/ folder", () => {
		const absolutePath = absolutePaths.asLibraryJavaScriptFile();
		mockFileURLToPath.mockReturnValue(absolutePath);

		const {absoluteRootDir, isDevDepsRepo} = getRepoMetadata();

		expect(absoluteRootDir).toEqual("/Users/username/repos/dr-devdeps");
		expect(isDevDepsRepo).toBe(true);
	});

	test("when run as a TypeScript file inside the src/ folder", () => {
		const absolutePath = absolutePaths.asSourceTypeScriptFile();
		mockFileURLToPath.mockReturnValue(absolutePath);

		const {absoluteRootDir, isDevDepsRepo} = getRepoMetadata();

		expect(absoluteRootDir).toEqual("/Users/username/repos/dr-devdeps");
		expect(isDevDepsRepo).toBe(true);
	});
});
