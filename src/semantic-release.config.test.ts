import type {Options} from "semantic-release";
import semanticReleaseCfg from "./semantic-release.config.cjs";

const semanticReleaseConfig: Options = semanticReleaseCfg;

test("it exports a configuration object and the most important config options are correct", () => {
	expect(typeof semanticReleaseConfig).toEqual("object");

	expect(semanticReleaseConfig.plugins).toStrictEqual([
		"@semantic-release/commit-analyzer",
		[
			"@semantic-release/release-notes-generator",
			{preset: "conventionalcommits"},
		],
		[
			"@semantic-release/changelog",
			{
				changelogFile: "CHANGELOG.md",
				changelogTitle: "# CHANGELOG",
			},
		],
		"@semantic-release/npm",
		[
			"@semantic-release/git",
			{
				assets: ["CHANGELOG.md", "package-lock.json", "package.json"],
				message:
					// eslint-disable-next-line no-template-curly-in-string
					"chore(🤖 release): v${nextRelease.version} [skip ci]\n\n${nextRelease.notes}",
			},
		],
		"@semantic-release/github",
	]);
});
