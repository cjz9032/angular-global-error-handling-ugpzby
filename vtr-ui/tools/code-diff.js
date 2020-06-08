const git = require('simple-git')();
const fs = require('fs');

const webAppDiffCmdParams = '-w -- src/**/*.ts src/**/*.html :(exclude)src/**/*.spec.ts :(exclude)src/assets';
const args = process.argv.slice(2);

(() => {
	if (args.length < 2) {
		console.log('please input correct parameters: 1. last version, 2. current version, sample: npm run diff v0.1 v0.2');
		return;
	}

	const [previousVersion, currentVersion] = args;
	const diffName = `tools/${previousVersion}-to-${currentVersion}.diff`;
	const diffArray = [previousVersion, currentVersion].concat(webAppDiffCmdParams.split(' '));
	git.diff(diffArray, (error, result) => {
		if (error) {
			return console.log(`git diff error: ${error}`);
		}
		fs.writeFileSync(diffName, result);
		console.log('create diff success!');
	});
})();
