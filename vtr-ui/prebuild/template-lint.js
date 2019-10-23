const htmlparser2 = require('htmlparser2');
const recursive = require("recursive-readdir");
const fs = require('fs');

const parser = new htmlparser2.Parser(
    {
        onopentag(name, attr) {
            if (name === "a") {
				if (attr.href && attr.href.startsWith('http://')) {
					global.defectedFiles.add(global.currentFile);
					console.log(`${global.currentFile}	Found a tag with href starts with HTTP.`);
				}

				// if (!attr.rel
				// 	|| attr.rel !== 'noopener'
				// 	|| attr.rel !== 'noreferrer') {
				// 	console.log(`${global.currentFile}	Found a tag with invalid rel attribute.`);
				// }
            }
        }
    },
    { decodeEntities: true }
);

global.defectedFiles = new Set();

recursive('src', (err, files) => {
	files
		.filter(name => {
			return name.endsWith('.html');
		})
		.forEach(file => {
			global.currentFile = file;
			parser.parseChunk(fs.readFileSync(file).toString());
		});

	delete global.currentFile;
	parser.end();

	process.exit(global.defectedFiles.size > 0);
});
