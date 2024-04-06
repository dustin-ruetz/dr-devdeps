/** https://github.com/prettier/plugin-xml */
export const xmlPrettierPlugin = {
	config: {
		// Excerpts from https://github.com/prettier/plugin-xml#configuration:
		xmlQuoteAttributes: "double",
		// > Adds a space before self-closing tags.
		xmlSelfClosingSpace: true,
		// > Orders XML attributes by key alphabetically while prioritizing `xmlns` attributes.
		xmlSortAttributesByKey: true,
		// Excerpts from https://github.com/prettier/plugin-xml#whitespace:
		// > In XML, by default, all whitespace inside elements has semantic meaning. For Prettier to maintain its contract of not changing
		// > the semantic meaning of your program, this means the default for `xmlWhitespaceSensitivity` is `"strict"`. When running in
		// > this mode, Prettier's ability to rearrange your markup is somewhat limited, as it has to maintain the exact amount of whitespace
		// > that you input within elements.
		// >
		// > If you're sure that the XML files that you're formatting do not require whitespace sensitivity, you can use the `"ignore"` option,
		// > as this will produce a standardized amount of whitespace. This will fix any indentation issues, and collapse excess blank lines
		// > (max of 1 blank line). For most folks most of the time, this is probably the option that you want.
		// >
		// > You can also use the `"preserve"` option, if you want to preserve the whitespace of text nodes within XML elements and attributes.
		xmlWhitespaceSensitivity: "ignore",
	},
	name: "@prettier/plugin-xml",
} as const;
