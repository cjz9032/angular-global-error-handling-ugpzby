const fs = require('fs');
const path = require('path');
const util = require('util');

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

	console.log(abTestsConfig.properties);

	fs.writeFileSync(path.join(__dirname, 'abTestsConfig.json'), JSON.stringify(abTestsConfig))
}

generate();
