import type {Config} from "prettier";
import {dependsOn} from "./utils/dependsOn.js";
import {pugPrettierPlugin} from "./prettier-plugins/pug.js";
import {xmlPrettierPlugin} from "./prettier-plugins/xml.js";

/** https://prettier.io/docs/en/options.html */
export const makePrettierConfig = async (): Promise<Config> => {
	const hasPugDependency = await dependsOn(["pug"]);

	return {
		arrowParens: "always",
		bracketSameLine: false,
		bracketSpacing: false,
		// Excerpt from https://prettier.io/docs/en/options.html#embedded-language-formatting:
		// > When Prettier identifies cases where it looks like you've placed some code it knows how to format
		// > within a string in another file, like in a tagged template in JavaScript with a tag named `html`
		// > or in code blocks in Markdown, it will by default try to format that code.
		embeddedLanguageFormatting: "auto",
		// Refer to .gitattributes file for the rationale of leaving `endOfLine` unset.
		// endOfLine
		//
		// Excerpt from https://prettier.io/blog/2018/11/07/1.15.0.html#whitespace-sensitive-formatting:
		// > Whitespace is significant in HTML inline elements.
		// > For this reason, we cannot safely format some HTML code since it may modify the displayed output in the browser.
		// > Instead of breaking your code or just doing nothing, we introduce _whitespace-sensitive formatting_, which:
		// > - follows the default CSS `display` value for every element to identify if the whitespace inside it is significant,
		// > - and wraps the tags in such a way as to avoid adding or removing significant whitespace.
		// > We also allow magic comments (e.g., `<!-- display: block -->`) to tell Prettier
		// > how to format elements due to the fact that CSS display can be changed.
		htmlWhitespaceSensitivity: "css",
		jsxSingleQuote: false,
		// Excerpt from https://prettier.io/docs/en/options.html#print-width:
		// > Specify the line length that the printer will wrap on.
		// > **For readability we recommend against using more than 80 characters.**
		// > Prettier's `printWidth` option [...] is not the hard upper allowed line length limit.
		// > It is a way to say to Prettier roughly how long you'd like lines to be.
		// > Prettier will make both shorter and longer lines, but generally strive to meet the specified `printWidth`.
		printWidth: 80,
		// Don't wrap lines when formatting text in Markdown files since some services use a linebreak-sensitive renderer, e.g. GitHub comments.
		proseWrap: "preserve",
		quoteProps: "as-needed",
		semi: true,
		singleAttributePerLine: false,
		// Prefer double quotes for strings because single quotes are used more often
		// within sentences for contractions and to indicate possession. Examples:
		// - Contraction: "It's a personal preference."
		// - Possession: "This is Dustin's codebase."
		// Excerpt from https://prettier.io/docs/en/options.html#quotes:
		// > If the number of quotes outweighs the other quote, the quote which is less used will be used to format the string. Examples:
		// > - "I'm double quoted" will result in in "I'm double quoted".
		// > - "This \"example\" is single quoted" will result in 'This "example" is single quoted'.
		singleQuote: false,
		tabWidth: 2,
		// Add trailing commas wherever possible to help reduce the number of changed lines when viewing Git diffs.
		trailingComma: "all",
		// Refer to .editorconfig file for the rationale of choosing to indent lines with tabs instead of spaces.
		useTabs: true,
		// Configure the Prettier plugins.
		plugins: [
			// SVG files use XML syntax, so use the corresponding plugin to check and autoformat them.
			xmlPrettierPlugin.name,
			// Conditionally include the Pug plugin in the configuration if the consuming repository has a dependency on the `pug` package.
			...(hasPugDependency ? [pugPrettierPlugin.name] : []),
		],
		...xmlPrettierPlugin.config,
		...(hasPugDependency ? pugPrettierPlugin.config : {}),
	};
};

export default makePrettierConfig();
