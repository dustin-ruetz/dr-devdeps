import {dependsOnMock} from "./utils/dependsOn.mock.js";
import {makePrettierConfig} from "./prettier.config.js";
import {pugPrettierPlugin} from "./prettier-plugins/pug.js";
import {xmlPrettierPlugin} from "./prettier-plugins/xml.js";

test("it exports a configuration object", async () => {
	const prettierConfig = await makePrettierConfig();

	expect(typeof prettierConfig).toEqual("object");
});

test("the most important configuration options are correct", async () => {
	const prettierConfig = await makePrettierConfig();

	expect(prettierConfig.endOfLine).toBeUndefined();
	expect(prettierConfig.printWidth).toEqual(80);
	expect(prettierConfig.proseWrap).toEqual("preserve");
	expect(prettierConfig.singleQuote).toBe(false);
	expect(prettierConfig.trailingComma).toEqual("all");
	expect(prettierConfig.useTabs).toBe(true);
});

describe("plugin names and configurations are correct", () => {
	test("for the XML plugin", async () => {
		const prettierConfig = await makePrettierConfig();

		expect(prettierConfig.plugins).toStrictEqual(["@prettier/plugin-xml"]);
		expect(prettierConfig).toEqual(
			expect.objectContaining(xmlPrettierPlugin.config),
		);
	});

	describe("for the Pug plugin", () => {
		test("when Pug *is* installed as a dependency", async () => {
			const hasPugDependency = true;
			dependsOnMock.mockResolvedValue(hasPugDependency);

			const prettierConfig = await makePrettierConfig();

			expect(prettierConfig.plugins).toContain("@prettier/plugin-pug");
			expect(prettierConfig).toEqual(
				expect.objectContaining(pugPrettierPlugin.config),
			);
		});

		test("when Pug *is not* installed as a dependency", async () => {
			const hasPugDependency = false;
			dependsOnMock.mockResolvedValue(hasPugDependency);

			const prettierConfig = await makePrettierConfig();

			expect(prettierConfig.plugins).not.toContain("@prettier/plugin-pug");
			expect(prettierConfig).toEqual(
				expect.not.objectContaining(pugPrettierPlugin.config),
			);
		});
	});
});
