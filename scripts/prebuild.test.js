import {rm} from "node:fs/promises";
import {prebuild} from "./prebuild.js";

jest.mock("node:fs/promises");

test("it removes the lib/ directory with the force and recursive options", async () => {
	await prebuild();

	expect(rm).toHaveBeenCalledTimes(1);
	expect(rm).toHaveBeenCalledWith("lib/", {
		force: true,
		recursive: true,
	});
});
