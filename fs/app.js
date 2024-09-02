const fs = require("node:fs/promises");

(async () => {
	const watcher = fs.watch("./content.txt");

	for await (const event of watcher) {
		if (event.eventType === "change") {
			console.log("The file was changed");
		}
	}
})();