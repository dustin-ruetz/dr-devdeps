import {readFile} from "node:fs/promises";
import {getRepoMetadata} from "./getRepoMetadata.js";
import {ValidationError} from "./ValidationError.js";

/**
 * Given a list of dependencies, check the repository's package.json file
 * and determine whether or not the project depends on any of them.
 */
export const dependsOn = async (deps: string[]) => {
	// It's possible to use this function directly from the compiled lib/ .js file,
	// so start with some manual typechecking and throw errors early if needed.
	if (!Array.isArray(deps) || deps.length === 0) {
		throw new ValidationError(
			"Argument for the `deps` parameter must be an array of strings with a length >= 1.",
			{
				cause: {
					code: "ERR_INVALID_DEPS_ARRAY",
					values: {deps, "typeof deps": typeof deps},
				},
			},
		);
	}
	deps.forEach((dep) => {
		if (typeof dep !== "string") {
			throw new ValidationError(
				"All values in the `deps` array argument must be strings.",
				{
					cause: {
						code: "ERR_TYPEOF_DEP_NOT_STRING",
						values: {deps, dep, "typeof dep": typeof dep},
					},
				},
			);
		}
	});

	// Read the package.json file and parse its string contents into an object,
	// then merge its three dependency objects into one combined object.
	const packageJsonPath = `${getRepoMetadata().absoluteRootDir}/package.json`;
	const packageJsonContents = await readFile(packageJsonPath, {
		encoding: "utf-8",
	});
	const packageJson = JSON.parse(packageJsonContents);
	const allDependencies = {
		...packageJson.dependencies,
		...packageJson.devDependencies,
		...packageJson.peerDependencies,
	};

	// Determine whether or not the package.json file has any of the passed dependencies.
	let hasDependency = false;
	deps.forEach((dep) => {
		if (allDependencies[dep]) {
			hasDependency = true;
		}
	});

	return hasDependency;
};
