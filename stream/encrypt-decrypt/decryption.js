const { Transform } = require("node:stream");
const fs = require("node:fs/promises");

class Decrypt extends Transform {
	constructor({ totalBytes }) {
		super();

		this.totalBytes = totalBytes;
		this.totalBytesRead = 0;
		this.numberOfRead = 0;
	}

	_transform(chunk, encoding, callback) {
		for (let i = 0; i < chunk.length; i++) {
			if (chunk[i] !== 255) {
				chunk[i] -= 1;
			}
		}
		++this.numberOfRead;

		if (this.totalBytesRead === 0) {
			console.log("Decryption started.");
		}

		this.totalBytesRead += chunk.length;

		const progress = ((this.totalBytesRead / this.totalBytes) * 100).toFixed(0);

		if (this.numberOfRead % 2 === 0) {
			console.log("Decryption progress -> ", progress, "%");
		}

		if (chunk.length < 65536) {
			console.log("Decryption finished.");
		}

		callback(null, chunk);
	}
}


(async () => {

	const readFileHandle = await fs.open("write.txt", "r");
	const totalReadBytes = (await readFileHandle.stat()).size;
	const writeFileHandle = await fs.open("decrypted.txt", "w");

	const decrypt = new Decrypt({ totalBytes: totalReadBytes });

	const readStream = readFileHandle.createReadStream();
	const writeStream = writeFileHandle.createWriteStream();

	readStream.pipe(decrypt).pipe(writeStream);
})();
