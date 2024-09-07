const { Transform } = require("node:stream");
const fs = require("node:fs/promises");

class Encrypt extends Transform {
	_transform(chunk, encoding, callback) {
		for (let i = 0; i < chunk.length; i++) {
			if (chunk[i] !== 255) {
				chunk[i] += 1;
			}
		}

		callback(null, chunk);
	}
}


(async () => {
	const encrypt = new Encrypt();

	const readFileHandle = await fs.open("read.txt", "r");
	const writeFileHandle = await fs.open("write.txt", "w");

	const readStream = readFileHandle.createReadStream();
	const writeStream = writeFileHandle.createWriteStream();

	readStream.pipe(encrypt).pipe(writeStream);
})();
