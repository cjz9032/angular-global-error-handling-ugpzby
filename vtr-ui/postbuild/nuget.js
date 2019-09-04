const { version } = require('../package.json');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const file = path.resolve('./postbuild/Tangram.Client.Experience.nuspec');

exec('git rev-parse --abbrev-ref HEAD', (error, stdout) => {
	const branchName = stdout.trim();

	fs.writeFileSync(file,
		fs.readFileSync(file, 'utf-8')
			.split('\r\n')
			.map(line => {
				if (line.includes('<version>')) {
					return line.replace(/>.+</, `>${version}<`);
				} else if (line.includes('<id>')) {
					return line.replace('</id>', ` (${branchName})</id>`);
				}
				return line;
			})
			.join('\r\n'),
		'utf-8');
});


