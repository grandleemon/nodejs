const net = require("node:net");
const fs = require("node:fs/promises");

const PORT = 5050;
const HOST = "::1";

const server = net.createServer(() => {});



server.on("connection", (socket) => {
	console.log("New connection");

	let fileHandle;
	let writeStream;

	socket.on("data", async (data) => {
		if (!fileHandle) {
			socket.pause();

			const indexOfDivider = data.indexOf("-");
			const fileName = data.subarray(10, indexOfDivider).toString("utf8");

			fileHandle = await fs.open(`storage/${fileName}`, "w");
			writeStream = fileHandle.createWriteStream();

			writeStream.write(data.subarray(indexOfDivider + 1));

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