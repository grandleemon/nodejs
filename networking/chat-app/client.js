const net = require("node:net");

const client = net.createConnection({
	port: 3000,
	host: "127.0.0.1"
}, () => {
	console.log("Connect to the server");
});
