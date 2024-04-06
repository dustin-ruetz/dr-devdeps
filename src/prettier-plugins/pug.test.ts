import {pugPrettierPlugin} from "./pug.js";

test("it has the correct types", () => {
	expect(typeof pugPrettierPlugin).toEqual("object");
	expect(typeof pugPrettierPlugin.config).toEqual("object");
	expect(typeof pugPrettierPlugin.name).toEqual("string");
});

test("the most important configuration options and the plugin name are correct", () => {
	expect(pugPrettierPlugin.config.pugAttributeSeparator).toEqual("as-needed");
	expect(pugPrettierPlugin.config.pugExplicitDiv).toBe(true);
	expect(pugPrettierPlugin.config.pugSortAttributes).toEqual("asc");
	expect(pugPrettierPlugin.name).toEqual("@prettier/plugin-pug");
});
