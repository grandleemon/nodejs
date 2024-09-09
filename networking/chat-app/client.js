const net = require("node:net");
const readline = require("node:readline/promises");

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
});

const client = net.createConnection({
	port: 3000,
	host: "127.0.0.1"
}, async () => {
	console.log("Connect to the server");

	const message = await rl.question("Enter a message: ");
	client.write(message);
});

client.on("data", (data) => {
	console.log(data.toString("utf8"));
});

client.on("end", () => {
	console.log("Connection was ended");
});

