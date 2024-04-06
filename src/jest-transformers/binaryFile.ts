import path from "node:path";

/**
 * Excerpt from https://jestjs.io/docs/code-transformation#transforming-images-to-their-path:
 * > Importing [binary files like fonts or] images is a way to include them in your browser bundle, but they are
 * > not valid JavaScript. One way of handling it in Jest is to replace the imported value with its filename.
 */
const jestTransformerBinaryFile = {
	// Prefix the `sourceText` parameter with an underscore to tell TypeScript that the variable isn't being used.
	process(_sourceText: string, sourcePath: string) {
		return {
			// Keep this as `module.exports` because `export default` breaks the Jest transformer.
			code: `module.exports = ${JSON.stringify(path.basename(sourcePath))}`,
		};
	},
} as const;

export default jestTransformerBinaryFile;
