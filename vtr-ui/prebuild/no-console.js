const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

function parseError(error) {
	const result = [];
	const regex = new RegExp('(\\S+):(\\d+):(\\d+)');
	error.split('\n').forEach((line) => {
		const r = regex.exec(line);
		if (Array.isArray(r) && r.length > 0) {
			if (result.length === 0 || r[1] !== result[result.length - 1]) {
				result.push(r[1]);
			}
		}
	});
	console.log(result.length);
	return result;
}

function removeConsoleLine(file) {
	fs.writeFileSync(file,
		fs.readFileSync(file, 'utf-8')
			.split('\r\n')
			.filter(line => !line.includes('console.'))
			.join('\r\n'),
		'utf-8');
}

exec('git rev-parse --abbrev-ref HEAD', (error, stdout) => {
	if (stdout.trim() === 'master' || stdout.startsWith('release/')) {
		exec('tslint --config prebuild/no-console.json --project .', {
			cwd: path.resolve(__dirname, '..'),
		}, (err, out) => {
			console.log(out);
			parseError(out).forEach(file => removeConsoleLine(file));
		});
	}
});
