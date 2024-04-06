import type {Config} from "lint-staged";
import lintstagedConfig from "./lint-staged.config.js";

test("it exports a configuration object", () => {
	expect(typeof lintstagedConfig).toEqual("object");
});

describe("it runs the correct commands for", () => {
	const relativePaths = ["src/lint-staged.config.ts"] as const;
	const [relativePath] = relativePaths;

	test("formatting", () => {
		expect(lintstagedConfig["*" as keyof Config]).toEqual(
			"npm run format -- --ignore-unknown --write",
		);
	});

	const [lintCommand, typecheckCommand] =
		// @ts-expect-error TODO: Figure out how to correctly type the function on this configuration object.
		lintstagedConfig["*.{js,jsx,ts,tsx}"](relativePaths);

	test("linting", () => {
		expect(lintCommand).toEqual(`npm run lint -- --fix ${relativePath}`);
	});

	test("typechecking", () => {
		expect(typecheckCommand).toEqual("npm run typecheck");
	});

	describe("unit testing when the TEST_RUNNER environment variable is set to", () => {
		test("jest", () => {
			process.env["TEST_RUNNER"] = "jest";
			// @ts-expect-error TODO: See above comment.
			expect(lintstagedConfig["*.{js,jsx,json,ts,tsx}"](relativePaths)).toEqual(
				`npm run test:coverage -- --findRelatedTests --collectCoverageFrom= ${relativePath}`,
			);
		});

		test("vitest", () => {
			process.env["TEST_RUNNER"] = "vitest";
			// @ts-expect-error TODO: See above comment.
			expect(lintstagedConfig["*.{js,jsx,json,ts,tsx}"](relativePaths)).toEqual(
				`npm run vitest -- related --run ${relativePath} --coverage.enabled --coverage.include=${relativePath}`,
			);
		});
	});
});
