const fs = require("node:fs/promises");

(async () => {
	const createFile = async (path) => {
		try {
			await fs.access(path);
			return console.log(`The file ${path} already exists`);
		} catch (e) {
			await fs.writeFile(path, "");
			console.log("A new file was successfully created");
		}
	}

	const CREATE_FILE = "create a file";

	const file = await fs.open("./content.txt", "r");
	const watcher = fs.watch("./content.txt");

	file.on("change", async () => {
		const size = (await file.stat()).size;

		const buffer = Buffer.alloc(size);
		const offset = 0;
		const length = buffer.byteLength;
		const position = 0;

		await file.read(buffer, offset, length, position);

		const command = buffer.toString("utf8");

		if (command.includes(CREATE_FILE)) {
			const filePath = command.substring(CREATE_FILE.length + 1);
			await createFile(filePath)
		}
	});

	for await (const event of watcher) {
		if (event.eventType === "change") {
			file.emit("change");
		}
	}
})();