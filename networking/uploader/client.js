const net = require("node:net");
const fs = require("node:fs/promises");
const path = require("node:path");

const PORT = 5050;
const HOST = "16.171.3.75";

const clearLine = (dir) => {
	return new Promise((res, rej) => {
		process.stdout.clearLine(dir, () => {
			res();
		});
	});
};

const moveCursor = (dx, dy) => {
	return new Promise((res, rej) => {
		process.stdout.moveCursor(dx, dy, () => {
			res();
		});
	});
};

const client = net.createConnection({
	host: HOST,
	port: PORT
}, async () => {
	const filePath = process.argv[2];
	const fileName = path.basename(filePath);

	const fileHandle = await fs.open(filePath, "r");
	const readStream = fileHandle.createReadStream();

	let bytesRead = 0;
	const totalBytes = (await fileHandle.stat()).size;

	client.write(`fileName: ${fileName}-`);

	readStream.on("data", async (data) => {
		if (!client.write(data)) {
			readStream.pause();
		}

		await moveCursor(0, -1);
		await clearLine(0);

		if (bytesRead === 0) console.log("Uploading started");

		bytesRead += data.byteLength;

		const progress = ((bytesRead / totalBytes) * 100).toFixed(0);

		console.log(`Uploading progress: ${progress}%`);
	});

	client.on("drain", () => {
		readStream.resume();
	});

	readStream.on("end", () => {
		console.log("The file was successfully uploaded");
		client.end();
	});
});