/** Custom class that 1) requires an error `message` and `code`, and 2) supports an optional `values` object. */
export class ValidationError extends Error {
	constructor(
		message: string,
		options: {
			cause: {
				code: string;
				values?: {
					[value: string]: unknown;
				};
			};
		},
	) {
		// Combine the error's code and message so that all of the most useful information (including the stack trace) is thrown.
		super(`${options.cause.code} - ${message}`);
		// Excerpt from https://github.com/microsoft/TypeScript-wiki/blob/main/Breaking-Changes.md#extending-built-ins-like-error-array-and-map-may-no-longer-work:
		//
		// > # Breaking-Changes.md - TypeScript 2.1
		// >
		// > ## Extending built-ins like Error, Array, and Map may no longer work
		// >
		// > As part of substituting the value of `this` with the value returned by a `super(...)` call, subclassing `Error`, `Array`,
		// > and others may no longer work as expected. This is due to the fact that constructor functions for `Error`, `Array`,
		// > and the like use ECMAScript 6's `new.target` to adjust the prototype chain; however, there is no way to ensure a value
		// > for `new.target` when invoking a constructor in ECMAScript 5. Other downlevel compilers generally have the same
		// > limitation by default.
		// >
		// > As a recommendation, you can manually adjust the prototype immediately after any `super(...)` calls.
		Object.setPrototypeOf(this, ValidationError.prototype);

		// Note 1: The practice of throwing errors with both a human-readable `message` and a machine-readable `cause` object is taken directly from MDN.
		// Excerpt from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error/cause#providing_structured_data_as_the_error_cause:
		// > ### Providing structured data as the error cause
		// > Error messages written for human consumption may be inappropriate for machine parsing — since they're subject to rewording or
		// > punctuation changes that may break any existing parsing written to consume them. So when throwing an error from a function,
		// > as an alternative to a human-readable error message, you can instead provide the cause as structured data for machine parsing.
		//
		// Note 2: `error.message` doesn't need to be manually added to `this` since it's always available on the Error object by default.
		// `options` and `options.cause` are optional properties, so set `this.cause` to ensure that they're included on the thrown Error.
		this.cause = options.cause;
		// Set `this.name` to ensure that the error name is set correctly; not setting it here will result
		// in `error.name` being set to the generic `Error` instead of the specific `ValidationError`.
		this.name = this.constructor.name;
	}
}
