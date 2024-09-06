const fs = require("node:fs/promises");

// // Big memory usage
// (async () => {
// 	const file = await fs.readFile("test.txt");
//
// 	console.log(file);
//
// 	const fileBuffer = Buffer.from(file);
//
// 	await fs.writeFile(`copy-test.txt`, fileBuffer)
// })()

const CHUNK_SIZE = 16384;

(async () => {
	const srcFile = await fs.open("test.txt", "r");
	const destFile = await fs.open("test-copy.txt", "w");

	let bytesRead = -1;

	while (bytesRead !== 0) {
		const readResult = await srcFile.read();
		bytesRead = readResult.bytesRead;

		if (bytesRead !== CHUNK_SIZE) {
			const indexOfNotFilled = readResult.buffer.indexOf(0);
			const newBuffer = Buffer.alloc(indexOfNotFilled);
			readResult.buffer.copy(newBuffer, 0, 0, indexOfNotFilled);
			await destFile.write(newBuffer);
			continue;
		}

		await destFile.write(readResult.buffer);
	}
})();