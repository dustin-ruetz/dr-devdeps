import {xmlPrettierPlugin} from "./xml.js";

test("it has the correct types", () => {
	expect(typeof xmlPrettierPlugin).toEqual("object");
	expect(typeof xmlPrettierPlugin.config).toEqual("object");
	expect(typeof xmlPrettierPlugin.name).toEqual("string");
});

test("the most important configuration options and the plugin name are correct", () => {
	expect(xmlPrettierPlugin.config.xmlQuoteAttributes).toEqual("double");
	expect(xmlPrettierPlugin.config.xmlSortAttributesByKey).toBe(true);
	expect(xmlPrettierPlugin.config.xmlWhitespaceSensitivity).toEqual("ignore");
	expect(xmlPrettierPlugin.name).toEqual("@prettier/plugin-xml");
});
