import jestTransformerSVGFile from "./svgFile.js";

test('it transforms SVG files into `module.exports = "<svg>{...}</svg>"`', () => {
	const sourceText = `
<svg
	xmlns="http://www.w3.org/2000/svg"
  aria-labelledby="svg-id"
  role="img"
>
  <title id="svg-id">SVG title.</title>
</svg>
`;

	const transformedSVG = jestTransformerSVGFile.process(sourceText);

	expect(transformedSVG.code).toContain("module.exports =");
	expect(transformedSVG.code).toContain("<svg");
	expect(transformedSVG.code).toContain("svg-id");
	expect(transformedSVG.code).toContain("SVG title.");
	expect(transformedSVG.code).toContain("</svg>");
});
