let { version } = require('../package.json');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const file = path.resolve('./postbuild/Tangram.Client.Experience.nuspec');

version = `${version}.${process.argv[2]}`;
exec('git rev-parse --abbrev-ref HEAD', (error, stdout) => {
	const branchName = stdout.trim();

	fs.writeFileSync(file,
		fs.readFileSync(file, 'utf-8')
			.split('\r\n')
			.map(line => {
				if (line.includes('<id>')) {
					return line.replace('</id>', `_(${branchName})</id>`);
				}
				if (line.includes('<version>')) {
					return line.replace(/>.+</, `>${version}<`);
				}
				return line;
			})
			.join('\r\n'),
		'utf-8');
});


