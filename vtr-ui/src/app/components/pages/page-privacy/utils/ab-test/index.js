const fs = require('fs');
const path = require('path');
const util = require('util');

const readFile = util.promisify(fs.readFile);

async function generate() {
	const config = JSON.parse(await readFile(path.join(__dirname, 'config.json')));
	const mySchema = {
		properties: {
			"ab-tests-name": {
				"enum": Object.keys(config.tests),
				"tsEnumNames": Object.keys(config.tests)
			}
		}
	};

	fs.writeFileSync(path.join(__dirname, 'mySchema.json'), JSON.stringify(mySchema))
}

generate();
