import {dependsOn} from "./dependsOn.js";

jest.mock("./dependsOn.js", () => ({
	dependsOn: jest.fn(),
}));

/**
 * Call `dependsOnMock.mockResolvedValue(false|true)` based on the array of dependencies that are passed in to the `dependsOn` function.
 *
 * @example
 * ```
 * // The following line of code checks the repository's package.json file to determine
 * // whether or not the project depends on either the Pug or React packages.
 * const testEnvironment = await dependsOn(["pug", "react"]) ? "jsdom" : "node";
 *
 * // Use the mocked implementation of `dependsOn` by resolving its promise to the value needed for the test.
 * const doesDependOnFrontendPackages = dependsOnMock.mockResolvedValue(true)
 * const doesNotDependOnFrontendPackages = dependsOnMock.mockResolvedValue(false)
 * ```
 * */
export const dependsOnMock = dependsOn as jest.MockedFunction<typeof dependsOn>;
