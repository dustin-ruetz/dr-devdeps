const jestTransformerSVGFile = {
	process(sourceText: string) {
		return {
			// Replace the SVG file import with its file contents.
			code: `module.exports = ${JSON.stringify(sourceText)}`,
		};
	},
} as const;

export default jestTransformerSVGFile;
