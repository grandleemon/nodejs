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
		if (!fileHandle) {
			socket.pause();
			fileHandle = await fs.open(`storage/test.txt`, "w");
			writeStream = fileHandle.createWriteStream();

			writeStream.write(data);

			socket.resume();

			writeStream.on("drain", () => {
				socket.resume();
			});
		} else {
			if (!writeStream.write(data)) {
				socket.pause();
			}
		}
	});


	socket.on("end", () => {
		fileHandle.close();
		fileHandle = null;
		writeStream = null;
		console.log("Connection closed");
	});
});

server.listen(PORT, HOST, () => {
	console.log("Uploader server opened on: ", server.address());
});