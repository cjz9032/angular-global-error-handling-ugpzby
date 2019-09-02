let { version } = require('../package.json');
const fs = require('fs');
const path = require('path');

version = `${version}.${process.argv[2]}`;
const file = path.resolve('./postbuild/Tangram.Client.Experience.nuspec');

fs.writeFileSync(file,
    fs.readFileSync(file, 'utf-8')
        .split('\r\n')
        .map(line => {
            if (line.includes('<version>')) {
                return line.replace(/>.+</, `>${version}<`);
            } else {
                return line;
            }
        })
        .join('\r\n'),
    'utf-8');
