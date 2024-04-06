/** https://prettier.github.io/plugin-pug/guide/ */
export const pugPrettierPlugin = {
	config: {
		// > Choose when to use commas to separate attributes in tags.
		pugAttributeSeparator: "as-needed",
		// > Define where classes will be placed.
		// > `"before-attributes"` - Forces all valid class literals to be placed before attributes.
		pugClassLocation: "before-attributes",
		// > Define how classes should be formatted.
		// > `"literal"` - Forces all valid classes to be printed as literals.
		pugClassNotation: "literal",
		// > Change behavior of spaces within comments.
		pugCommentPreserveSpaces: "keep-all",
		// > Change behavior of boolean attributes.
		// > `"as-is"` - Nothing is changed.
		pugEmptyAttributes: "as-is",
		// > Define if a `div` tag should _always_ be printed with literal class and id formatting.
		pugExplicitDiv: true,
		// > Define how ids should be formatted.
		// > `"literal"` - Forces all valid ids to be printed as literals.
		pugIdNotation: "literal",
		// > Define if brackets should be preserved while formatting attributes, even if empty.
		pugPreserveAttributeBrackets: false,
		// > Sort attributes that are not on _beginning_ and _end_ patterns.
		// > `"asc"` - Sort attributes is ascending alphabetical order.
		pugSortAttributes: "asc",
		// > Define the maximum amount of attributes that an element can appear with on one line before it gets wrapped.
		// > `-1` - Only wrap attributes as needed.
		pugWrapAttributesThreshold: -1,
	},
	name: "@prettier/plugin-pug",
} as const;
