const fs = require('fs');
const path = require('path');
const util = require('util');
const https = require('https');

const readFile = util.promisify(fs.readFile);

async function generate() {
	const config = JSON.parse(await readFile(path.join(__dirname, 'config.json')));
	const abTestsConfig = {
		type: "object",
		properties: {
			'abTestsName': {
				enum: config.tests.map((test) => test.key),
				tsEnumNames: config.tests.map((test) => test.key)
			}
		},
		additionalProperties: false,
	};

	fs.writeFileSync(path.join(__dirname, 'abTestsConfig.json'), JSON.stringify(abTestsConfig))
}

const VERSION = 15;
const url = `https://api.tz.figleafapp.com/api/v1/vantage/tests/config?version=${VERSION}`;

https.get(url, res => {
	res.setEncoding("utf8");
	let body = "";
	res.on("data", data => {
		body += data;
	});
	res.on("end", () => {
		fs.writeFileSync(path.join(__dirname, 'config.json'), body);
		generate();
	});
});
