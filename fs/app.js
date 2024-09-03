const fs = require("node:fs/promises");

(async () => {
	const CREATE_FILE = "create a file";
	const DELETE_FILE = "delete the file";
	const RENAME_FILE = "rename the file";
	const ADD_TO_FILE = "add to the file";

	const createFile = async (path) => {
		try {
			await fs.access(path);
			return console.log(`The file ${path} already exists`);
		} catch (e) {
			await fs.writeFile(path, "");
			console.log("A new file was successfully created");
		}
	};

	const deleteFile = async (path) => {
		try {
			await fs.rm(path);
			console.log(`The file ${path} was successfully deleted`);
		} catch (e) {
			console.log(`The file ${path} not found`);
		}
	};

	const renameFile = async (path, newPath) => {
		try {
			await fs.rename(path, newPath);
			console.log(`The file ${path} was successfully renamed`);
		} catch (e) {
			console.log(e);
			console.log(`The file ${path} not found`);
		}
	};

	const addToFile = async (path, content) => {
		try {
			await fs.appendFile(path, content);
			console.log(`The content for ${path} was successfully added`);
		} catch (e) {
			console.log(e);
			console.log(`The file ${path} not found`);
		}
	};

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
			await createFile(filePath);
		}

		if (command.includes(DELETE_FILE)) {
			const filePath = command.substring(DELETE_FILE.length + 1);
			await deleteFile(filePath);
		}

		if (command.includes(RENAME_FILE)) {
			const index = command.indexOf(" to ");
			const oldFilePath = command.substring(RENAME_FILE.length + 1, index);
			const newFilePath = command.substring(index + 4);
			await renameFile(oldFilePath, newFilePath);
		}

		if (command.includes(ADD_TO_FILE)) {
			const index = command.indexOf(" this content: ");
			const filePath = command.substring(ADD_TO_FILE.length + 1, index);
			const content = command.substring(index + 15);
			await addToFile(filePath, content);
		}
	});

	for await (const event of watcher) {
		if (event.eventType === "change") {
			file.emit("change");
		}
	}
})();