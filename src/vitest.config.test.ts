import {makeVitestConfig} from "./vitest.config.js";

// jest.mock("vitest/config", () => ({
// 	// Explicitly mock out `defineConfig` to prevent the following warning from being logged during the Jest test run:
// 	// > warnCjsUsage - The CJS build of Vite's Node API is deprecated.
// 	defineConfig: jest.fn(),
// }));

test("it exports a configuration object", () => {
	const vitestConfig = makeVitestConfig();

	expect(typeof vitestConfig).toEqual("object");
});

test("the most important configuration options are correct", () => {
	const vitestConfig = makeVitestConfig();

	expect(vitestConfig.test?.coverage?.provider).toEqual("v8");
	expect(vitestConfig.test?.globals).toBe(true);
});
