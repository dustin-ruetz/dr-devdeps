import packageJson from "../package.json";

test("the most important configuration options are correct", () => {
	expect(packageJson.author).toEqual("Dustin Ruetz");
	expect(packageJson.name).toEqual("dr-devdeps");
	expect(packageJson.type).toEqual("module");
});

test("that NPM packages are installed with exact version numbers", () => {
	const dependencyVersions = [
		...Object.values(packageJson.dependencies).map((version) => version),
	];

	dependencyVersions.forEach((dependency) => {
		expect(dependency).not.toContain("^");
	});
});
