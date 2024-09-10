const net = require("node:net");
const fs = require("node:fs/promises");

const PORT = 5050;
const HOST = "::1";

const server = net.createServer(() => {});

let fileHandle;
let writeStream;

server.on("connection", (socket) => {
	console.log("New connection");

	socket.on("data", async (data) => {
		fileHandle = await fs.open(`storage/test.txt`, "w");

		writeStream = fileHandle.createWriteStream();
		writeStream.write(data);
	});

	socket.on("end", () => {
		console.log("Connection closed");
		fileHandle.close();
	});
});

server.listen(PORT, HOST, () => {
	console.log("Uploader server opened on: ", server.address());
});