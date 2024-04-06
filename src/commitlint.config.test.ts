import commitlintConfig from "./commitlint.config.js";

test("it exports a configuration object", () => {
	expect(typeof commitlintConfig).toEqual("object");
});

test("the configuration options are correct", () => {
	expect(commitlintConfig.extends).toStrictEqual([
		"@commitlint/config-conventional",
	]);
});
