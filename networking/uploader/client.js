const net = require("node:net");
const fs = require("node:fs/promises");

const PORT = 5050;
const HOST = "::1";

const client = net.createConnection({
	host: HOST,
	port: PORT
}, async () => {
	const filePath = "text.txt";

	const fileHandle = await fs.open(filePath, "r");
	const readStream = fileHandle.createReadStream();

	readStream.on("data", (data) => {
		if (!client.write(data)) {
			console.log("here");
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