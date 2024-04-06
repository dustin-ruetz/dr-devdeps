import {ValidationError} from "./ValidationError.js";

describe("ValidationError is thrown correctly", () => {
	const errorMessage = "error message";

	test("with its cause object, code/message string, and name", () => {
		const validationError = new ValidationError(errorMessage, {
			cause: {code: "ERR_CODE"},
		});

		expect(validationError.cause).toStrictEqual({code: "ERR_CODE"});
		expect(validationError.message).toEqual("ERR_CODE - error message");
		expect(validationError.name).toEqual("ValidationError");
	});

	test("*with* a `values` object when it's provided", () => {
		const validationError = new ValidationError(errorMessage, {
			cause: {code: "ERR_CODE_WITH_VALUES", values: {parameter: "argument"}},
		});

		expect(validationError.cause).toStrictEqual({
			code: "ERR_CODE_WITH_VALUES",
			values: {parameter: "argument"},
		});
	});

	test("*without* a `values` object when it's not provided", () => {
		const validationError = new ValidationError(errorMessage, {
			cause: {code: "ERR_CODE_WITHOUT_VALUES"},
		});

		expect(validationError.cause).toStrictEqual({
			code: "ERR_CODE_WITHOUT_VALUES",
		});
	});
});
