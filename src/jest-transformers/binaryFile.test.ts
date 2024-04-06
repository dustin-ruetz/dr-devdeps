import jestTransformerBinaryFile from "./binaryFile.js";

test('it transforms binary file paths into `module.exports = "name.extension"`', () => {
	const sourceText = "";

	const transformedJPG = jestTransformerBinaryFile.process(
		sourceText,
		"images/image.jpg",
	);
	const transformedPNG = jestTransformerBinaryFile.process(
		sourceText,
		"images/image.png",
	);
	const transformedWOFF2 = jestTransformerBinaryFile.process(
		sourceText,
		"fonts/font.woff2",
	);

	expect(transformedJPG.code).toEqual('module.exports = "image.jpg"');
	expect(transformedPNG.code).toEqual('module.exports = "image.png"');
	expect(transformedWOFF2.code).toEqual('module.exports = "font.woff2"');
});
