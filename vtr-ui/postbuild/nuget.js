let { version } = require('../package.json');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const file = path.resolve('./postbuild/Tangram.Client.Experience.nuspec');


exec('git rev-parse --abbrev-ref HEAD', (error, stdout) => {
	version = `${version}.${new Date().toISOString().slice(0, 16).replace(/[-T:]/g, '')}`;

	fs.writeFileSync(file,
		fs.readFileSync(file, 'utf-8')
			.split('\n')
			.map(line => {
				if (line.includes('<version>')) {
					console.log(`before : ${line}`);
					line = line.replace(/>.+</, `>${version}<`);
					console.log(`after  : ${line}`);
				}
				return line;
			})
			.join('\n'),
		'utf-8');
});


