import {rm} from "node:fs/promises";
import {prebuild} from "../prebuild";

test("it removes the lib/ directory with the force and recursive options", async () => {
	await prebuild();

	expect(rm).toHaveBeenCalledTimes(1);
	expect(rm).toHaveBeenCalledWith("lib/", {
		force: true,
		recursive: true,
	});
});
