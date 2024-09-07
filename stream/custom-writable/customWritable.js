const { Writable } = require("node:stream");
const fs = require("node:fs");

class FileWriteStream extends Writable {
	constructor({ highWaterMark, fileName }) {
		super({ highWaterMark });

		this.fileName = fileName;
		this.fd = null;q
		this.chunks = [];
		this.chunksSize = 0;
		this.numberOfWrites = 0;
	}

	_construct(callback) {
		fs.open(this.fileName, "w", (err, fd) => {
			if (err) {
				callback(err);
			} else {
				this.fd = fd;
				callback();
			}
		});
	}

	_write(chunk, encoding, callback) {
		this.chunks.push(chunk);
		this.chunksSize += chunk.length;

		if (this.chunksSize > this.writableHighWaterMark) {
			fs.write(this.fd, Buffer.concat(this.chunks), (err) => {
				if (err) {
					return callback(err);
				}

				this.chunks = [];
				this.chunksSize = 0;
				++this.numberOfWrites;
				callback();
			});
		} else {
			callback();
		}
	}

	_final(callback) {
		fs.write(this.fd, Buffer.concat(this.chunks), (err) => {
			if (err) {
				return callback(err)
			}

			this.chunks = [];
			this.chunksSize = 0;
			callback();
		})
	}

	_destroy(error, callback) {
		console.log(this.numberOfWrites);
		if (this.fd) {
			fs.close(this.fd, (err) => {
				callback(err || error)
			})
		} else {
			callback(error)
		}
	}
}

const stream =

(async () => {
	console.time("Test");

	const stream = new FileWriteStream({ fileName: "test.txt" });
	let i = 0;

	const write = () => {
		while (i < 1000000) {
			const buffer = Buffer.from(` ${i} `);

			if (i === 999999) {
				return stream.end(buffer);
			}

			i++;

			if (!stream.write(buffer)) break;
		}
	};

	write();

	stream.on("drain", (arg) => {
		write();
	});

	stream.on("finish", () => {
		console.timeEnd("Test");
	});
})();