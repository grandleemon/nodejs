const net = require("node:net");
const fs = require("node:fs/promises");
const path = require("node:path");

const PORT = 5050;
const HOST = "::1";

const client = net.createConnection({
	host: HOST,
	port: PORT
}, async () => {
	const filePath = process.argv[2];
	const fileName = path.basename(filePath);

	const fileHandle = await fs.open(filePath, "r");
	const readStream = fileHandle.createReadStream();

	client.write(`fileName: ${fileName}-`)

	readStream.on("data", (data) => {
		if (!client.write(data)) {
			readStream.pause();
		}
	});

	client.on("drain", () => {
		readStream.resume();
	});

	readStream.on("end", () => {
		console.log("The file was successfully uploaded");
		client.end();
	});
});