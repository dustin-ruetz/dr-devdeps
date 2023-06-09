// These imports are ESModule files, so specifying the ".js" file extension is required.
import {appendPrettierConfigFile} from "./utils/appendPrettierConfigFile.js";
import {copyCompiledFilesToLib} from "./utils/copyCompiledFilesToLib.js";
import {copyUncompiledFilesToLib} from "./utils/copyUncompiledFilesToLib.js";
import {deleteDirectoriesInLib} from "./utils/deleteDirectoriesInLib.js";
import {renameFilesInLibCJS} from "./utils/renameFilesInLibCJS.js";
import {renameFilesInLibESM} from "./utils/renameFilesInLibESM.js";

export const postbuild = async () => {
	// Make use of `Promise.all` to kick off multiple asynchronous operations simultaneously
	// and wait for all of them to resolve before proceeding to the next block of operations.
	await Promise.all([renameFilesInLibCJS(), renameFilesInLibESM()]);
	// Append certain files in lib/cjs/ with a `module.exports` line in order to:
	// 1. simplify the codebase by keeping everything in src/ written in ESModule syntax,
	// 2. export both CommonJS- and ESModule-compatible code from the lib/ directory, and
	// 3. use tsc for building/compiling without needing to install additional dependencies.
	await appendPrettierConfigFile();
	await Promise.all([copyCompiledFilesToLib(), copyUncompiledFilesToLib()]);
	// Delete lib/cjs/ and lib/esm/ now that their child files have been copied to the lib/ directory.
	await deleteDirectoriesInLib();
};

// Refer to scripts/prebuild.js file for why these lines are being excluded from the test coverage report.
/* istanbul ignore next */
if (process.env.NODE_ENV !== "test") {
	postbuild();
}
