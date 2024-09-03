// const fs = require("node:fs/promises");
//
// (async () => {
// 	console.time("Test")
//
// 	const file = await fs.open("test.txt", "w");
//
// 	for (let i = 0; i < 1000000; i++) {
// 		await file.write(` ${i} `);
// 	}
//
// 	console.timeEnd("Test");
//
// 	await file.close();
// })()

// const fs = require("node:fs");
//
// console.time("Test")
//
// fs.open("test.txt", "w", (err, fd) => {
// 	for (let i = 0; i < 1000000; i++) {
// 		fs.writeSync(fd, ` ${i} `);
// 	}
// });
//
// console.timeEnd("Test");

// const fs = require("node:fs/promises");
//
// (async () => {
// 	console.time("Test");
//
// 	const file = await fs.open("test.txt", "w");
//
// 	const stream = file.createWriteStream();
//
// 	for (let i = 0; i < 1000000; i++) {
// 		const buffer = Buffer.from(` ${i} `);
// 		stream.write(buffer);
// 	}
//
// 	console.timeEnd("Test");
// })();

const fs = require("node:fs/promises");

(async () => {
	console.time("Test");

	const file = await fs.open("test.txt", "w");

	const stream = file.createWriteStream();
	let i = 0;

	const write = () => {
		while (i < 1000000) {
			const buffer = Buffer.from(` ${i} `);

			if (i === 999999) {
				return stream.end(buffer);
			}

			if (!stream.write(buffer)) break;

			i++;
		}
	};

	write();

	stream.on("drain", (arg) => {
		write();
	});

	stream.on("finish", () => {
		console.timeEnd("Test");
		file.close();
	});

})();