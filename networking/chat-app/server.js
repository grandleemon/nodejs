const net = require("node:net");

const server = net.createServer();

const clients = [];

server.on("connection", (socket) => {
	console.log("A new connection to the server");

	clients.push(socket);

	socket.on("data", (data) => {
		clients.forEach(socket => {
			socket.write(data);
		})
	});
});

server.listen(3000, "127.0.0.1", () => {
	console.log("Opened server on: ", server.address());
});