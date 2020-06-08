const glob = require("glob")
const fs = require('fs');

const getDirectories = function (src, callback) {
	glob(src + '/**/!(*.jpg|*.woff|*.spec.ts|*.md|*.svg|*.png)', callback);
};

const excludesList = [
	'https://stackoverflow.com'
];

const pattern = /https:\/\/[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,256}\b([-a-zA-Z0-9()@:${}\[\]%_\+.~#?&//=]*)?/gi;
let outputContents = '';
const output = `tools/https-list.txt`;
getDirectories('src', function (err, res) {
	if (err) {
		console.log('Error: ', err);
		return;
	}

	fs.writeFileSync(output, '');

	res.forEach(path => {
		if (fs.lstatSync(path).isDirectory()) return;

		const contents = fs.readFileSync(path, {encoding: "utf-8"});
		if (!contents) {
			console.log(`read file ${path} error`);
			return;
		}

		while ((match = pattern.exec(contents)) != null) {
			if (excludesList.findIndex(item => match[0].startsWith(item)) !== -1) return;

			if (outputContents.includes(match[0])) return;
			outputContents += match[0];
			fs.appendFileSync(output, '\r\n' + match[0]);
		}
		console.log(`collect file: ${path} done!`);
	});

	console.log(`All done!`);
});
