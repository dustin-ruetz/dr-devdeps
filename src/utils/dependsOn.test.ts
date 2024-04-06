import {readFile} from "node:fs/promises";
import {dependsOn} from "./dependsOn.js";
import {getRepoMetadata} from "./getRepoMetadata.js";

jest.mock("node:fs/promises", () => ({
	readFile: jest.fn(),
}));
// Paraphrased excerpt from https://www.mikeborozdin.com/post/changing-jest-mocks-between-tests:
// > Typecast the imported mocked module into a mocked function with writeable properties.
const mockReadFile = readFile as jest.MockedFunction<typeof readFile>;

jest.mock("./getRepoMetadata.js", () => ({
	getRepoMetadata: jest.fn(() => ({
		absoluteRootDir: "/Users/username/repos/dr-devdeps",
		dependencyPartialPath: "node_modules/dr-devdeps",
		isDevDepsRepo: true,
	})),
}));

afterEach(() => {
	jest.clearAllMocks();
});

test("throws errors if the `deps` argument is invalid", () => {
	expect(async () => {
		// @ts-expect-error if no `deps` argument is passed.
		await dependsOn();
	}).rejects.toThrow(/ERR_INVALID_DEPS_ARRAY/);

	expect(async () => {
		// @ts-expect-error if `deps` argument is not an array.
		await dependsOn("package1");
	}).rejects.toThrow(/ERR_INVALID_DEPS_ARRAY/);

	expect(async () => {
		// Expect an error if `deps` argument is an empty array.
		await dependsOn([]);
	}).rejects.toThrow(/ERR_INVALID_DEPS_ARRAY/);

	expect(async () => {
		// @ts-expect-error if `deps` argument is an array containing non-string values.
		await dependsOn(["package1", 2, "package3"]);
	}).rejects.toThrow(/ERR_TYPEOF_DEP_NOT_STRING/);
});

test("returns `false` if the repo does not depend on the package", async () => {
	const packageJsonContents = `
{
	"dependencies": {
		"dep1": "major.minor.patch"
	}
}
`;
	mockReadFile.mockResolvedValue(packageJsonContents);

	const dependsOnDep0 = await dependsOn(["dep0"]);

	expect(getRepoMetadata).toHaveBeenCalledTimes(1);
	expect(mockReadFile).toHaveBeenCalledWith(
		"/Users/username/repos/dr-devdeps/package.json",
		{encoding: "utf-8"},
	);
	expect(dependsOnDep0).toBe(false);
});

test("returns `true` if the repo does depend on the package", async () => {
	const packageJsonContents = `
{
	"devDependencies": {
		"devDep1": "major.minor.patch"
	}
}
`;
	mockReadFile.mockResolvedValue(packageJsonContents);

	const dependsOnDevDep1 = await dependsOn(["devDep1"]);

	expect(getRepoMetadata).toHaveBeenCalledTimes(1);
	expect(mockReadFile).toHaveBeenCalledTimes(1);
	expect(dependsOnDevDep1).toBe(true);
});

test("returns `true` if the repo depends on at least one of the passed packages", async () => {
	const packageJsonContents = `
{
	"dependencies": {
		"dep1": "major.minor.patch"
	},
	"devDependencies": {
		"devDep1": "major.minor.patch"
	},
	"peerDependencies": {
		"peerDep1": "major.minor.patch"
	}
}
`;
	mockReadFile.mockResolvedValue(packageJsonContents);

	const dependsOnPeerDep1 = await dependsOn(["dep0", "devDep0", "peerDep1"]);

	expect(getRepoMetadata).toHaveBeenCalledTimes(1);
	expect(mockReadFile).toHaveBeenCalledTimes(1);
	expect(dependsOnPeerDep1).toBe(true);
});
