const fs = require('fs');
const path = require('path');
const util = require('util');
const https = require('https');

const readFile = util.promisify(fs.readFile);

const argv = (() => {
	const arguments = {};
	process.argv.slice(2).map( (element) => {
		const matches = element.match( '--([a-zA-Z0-9]+)=(.*)');
		if ( matches ){
			arguments[matches[1]] = matches[2]
				.replace(/^['"]/, '').replace(/['"]$/, '');
		}
	});
	return arguments;
})();

const VERSION = argv.version;
const url = `https://api.tz.figleafapp.com/api/v1/vantage/tests/config?version=${VERSION}`;

console.log(`Generate test config for ${VERSION} version`);

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
