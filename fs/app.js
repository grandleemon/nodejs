const fs = require("node:fs/promises");

(async () => {
	const file = await fs.open("./content.txt", "r");
	const watcher = fs.watch("./content.txt");

	file.on("change", async () => {
		const size = (await file.stat()).size;

		const buffer = Buffer.alloc(size);
		const offset = 0;
		const length = buffer.byteLength;
		const position = 0;

		await file.read(buffer, offset, length, position);

		console.log(buffer.toString("utf8"));
	});

	for await (const event of watcher) {
		if (event.eventType === "change") {
			file.emit("change");
		}
	}
})();