import type {UserConfig} from "@commitlint/types";

/** https://commitlint.js.org/#/reference-configuration */
const commitlintConfig: UserConfig = {
	extends: ["@commitlint/config-conventional"],
} as const;

export default commitlintConfig;
