const fs = require("node:fs/promises");


(async () => {
	console.time("Test")

	const file = await fs.open("test.txt", "w");

	for (let i = 0; i < 1000000; i++) {
		await file.write(` ${i} `);
	}

	console.timeEnd("Test");

	await file.close();
})()

// console.time("Test")
//
// const fs = require("node:fs");
//
// fs.open("test.txt", "w", (err, fd) => {
// 	console.log(fd);
// 	for (let i = 0; i < 1000000; i++) {
// 		fs.writeSync(fd, ` ${i} `);
// 	}
// });
//
// console.timeEnd("Test");
