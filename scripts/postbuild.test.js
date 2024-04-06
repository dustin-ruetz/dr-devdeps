import {appendFile, rename} from "node:fs/promises";
import {postbuild} from "./postbuild.js";

jest.mock("node:fs/promises");

test("it runs all of the necessary post-build file system operations", async () => {
	await postbuild();

	// Verify that the ESLint config file was renamed (from the .js to .cjs file extension).
	expect(rename).toHaveBeenCalledTimes(1);
	expect(rename).toHaveBeenCalledWith(
		"lib/eslint.config.js",
		"lib/eslint.config.cjs",
	);

	// Verify that the ESLint config file was appended to make it work with CommonJS.
	expect(appendFile).toHaveBeenCalledTimes(1);
	expect(appendFile).toHaveBeenCalledWith(
		"lib/eslint.config.cjs",
		"module.exports = exports.eslintConfig;",
	);
});
