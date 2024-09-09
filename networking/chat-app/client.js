const net = require("node:net");
const readline = require("node:readline/promises");

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
});

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
	port: 3000,
	host: "127.0.0.1"
}, async () => {
	console.log("Connect to the server");

	const ask = async () => {
		const message = await rl.question("Enter a message: ");
		await moveCursor(0, -1);
		await clearLine(0);
		client.write(message);
	};

	await ask();

	client.on("data", async (data) => {
		console.log();
		await moveCursor(0, -1);
		await clearLine(0);
		console.log(data.toString("utf8"));

		await ask();
	});
});



client.on("end", () => {
	console.log("Connection was ended");
});

