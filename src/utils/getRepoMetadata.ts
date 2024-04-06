import {fileURLToPath} from "node:url";
import {ValidationError} from "./ValidationError.js";

/**
 * The purpose of this function is to provide a more robust alternative to `process.cwd()`. As per
 * the Node.js documentation on https://nodejs.org/docs/latest-v20.x/api/process.html#processcwd:
 * > The `process.cwd()` method returns the current working directory of the Node.js process.
 *
 * The problem with relying on this method is that it's dependent on the directory where the Node.js process was started from;
 * if it's run from anywhere but the root of the repository then it will not return the desired path.
 *
 * This function uses the known location of the `utils/getRepoMetadata` file within the repo's structure and uses it as an anchor point
 * to determine the absolute root directory of the repo where it's being called from. It can return the absolute path of either:
 * 1. The consuming repository where the `dr-devdeps` package is installed as a dependency; or
 * 2. This `dr-devdeps` repo itself.
 *
 * **Important:** Note that the `absoluteRootDir` path is intentionally returned _without_ a trailing slash.
 */
export const getRepoMetadata = () => {
	const absolutePath = fileURLToPath(import.meta.url);
	/**
	 * `partialPath` is known and stable; it's agnostic of differences between
	 * folder locations (`lib` or `src`) and file extensions (`.js` or `.ts`).
	 */
	const partialPath = "utils/getRepoMetadata";

	// This function depends on its path being known (i.e. the folder being `/utils/` and the
	// filename being `getRepoMetadata`), so throw an early error if these don't align.
	if (!absolutePath.includes(partialPath)) {
		throw new ValidationError(
			"`partialPath` string is not present within `absolutePath` string.",
			{
				cause: {
					code: "ERR_PATH_MISMATCH",
					values: {absolutePath, partialPath},
				},
			},
		);
	}
	/** `dependencyPartialPath` is known and stable; it's the location where the `dr-devdeps` package is installed as a dependency. */
	const dependencyPartialPath = "node_modules/dr-devdeps";
	/**
	 * `relativePath` is defined as a regular expression so that it covers two types of paths:
	 * 1. A compiled JavaScript file in the lib/ directory; and
	 * 2. A TypeScript file in the src/ directory.
	 */
	const relativePath = new RegExp(`(lib|src)/${partialPath}.(js|ts)`);
	/** `dependencyRelativePath` is defined as a regular expression built from the previous variables. */
	const dependencyRelativePath = new RegExp(
		`${dependencyPartialPath}/${relativePath.source}`,
	);
	let absoluteRootDir;
	if (absolutePath.includes(dependencyPartialPath)) {
		absoluteRootDir = absolutePath.replace(dependencyRelativePath, "");
	} else {
		absoluteRootDir = absolutePath.replace(relativePath, "");
	}
	// Remove the last character in the string, i.e. the path's trailing slash.
	absoluteRootDir = absoluteRootDir.slice(0, -1);

	const isDevDepsRepo = absoluteRootDir.endsWith("/dr-devdeps");

	return {absoluteRootDir, dependencyPartialPath, isDevDepsRepo} as const;
};
