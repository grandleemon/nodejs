const net = require("node:net");

const server = net.createServer();

const clients = [];

server.on("connection", (socket) => {
	const clientId = clients.length + 1;

	console.log("A new connection to the server");

	socket.write(`id-${clientId}`)

	console.log("socket write");

	clients.forEach(({ socket }) => {
		socket.write(`\nUser ${clientId} joined`);
	})

	socket.on("data", (data) => {
		const message = data.toString("utf8").split("-message-");
		const id = message[0];
		const msg = message[1];

		clients.forEach(({ socket }) => {
			socket.write(`User ${id}: ${msg}`);
		})
	});

	socket.on("error", () => {
		clients.forEach(({ socket }) => {
			socket.write(`\nUser ${clientId} left`);
		})
	})

	clients.push({
		id: clientId.toString(),
		socket
	});
});

server.listen(3000, "127.0.0.1", () => {
	console.log("Opened server on: ", server.address());
});