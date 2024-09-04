const fs = require("node:fs/promises");

(async () => {
	const dest = await fs.open("dest.txt", "r");

	const buffer = await dest.readFile();

	const arr = buffer.toString("utf8").split("  ");

	arr.forEach((item, index) => {
		const currentNumber = Number(item);
		const nextNumber = Number(arr[index + 1]);

		if(!nextNumber && index === arr.length - 1) {
			return;
		}

		if (currentNumber + 2 !== nextNumber) {
			throw new Error(`${currentNumber + 2} is not equal to ${nextNumber}`);
		}

	});

	console.log("Success");
})();

// const MAX_CHUNK_BYTE_LENGTH = 64 * 1024;
//
// (async () => {
// 	const file = await fs.open("dest.txt", "r");
//
// 	const stream = file.createReadStream();
//
// 	let split = "";
// 	let chunkLastNumber = null;
//
// 	stream.on("data", chunk => {
// 		const arr = chunk.toString("utf8").split("  ");
//
// 		if (Number(arr[0]) !== Number(arr[1]) - 1) {
// 			if (split) arr[0] = split + arr[0];
// 		}
//
// 		if (Number(arr[arr.length - 2]) + 1 !== Number(arr[arr.length - 1])) {
// 			split = arr.pop();
// 		}
//
// 		const byteLength = chunk.byteLength;
//
// 		arr.forEach((item, index) => {
// 			const currentNumber = Number(item);
// 			const nextNumber = Number(arr.at(index + 1));
//
// 			if (byteLength === MAX_CHUNK_BYTE_LENGTH && !nextNumber) {
// 				chunkLastNumber = currentNumber;
// 			}
//
// 			if (byteLength < MAX_CHUNK_BYTE_LENGTH) {
// 				chunkLastNumber = null;
// 			}
//
// 			if (
// 				currentNumber === Number(arr.at(-1))
// 				&& !nextNumber
// 				&& byteLength < MAX_CHUNK_BYTE_LENGTH
// 			)
// 			{
// 				return console.log("Success");
// 			}
//
// 			if (((chunkLastNumber || currentNumber) + 2 !== nextNumber) && !chunkLastNumber) {
// 				throw new Error(`${(chunkLastNumber || currentNumber) + 2} is not equal to ${nextNumber}`);
// 			}
// 		});
// 	});
// })();