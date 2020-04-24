const { exec } = require('child_process');
const cmd = 'npm run test';
exec(cmd, function (error, stdout, stderr) {
	if (error) {
		// if test case error found
		if (error.message.toLowerCase().includes("error in src")) {
			console.info('please fix below test case error(s) before committing your changes.');
			console.error(error.message);
			process.exit(1);
		}

		// for some other error show error message directly on console
		console.info('error occurred while running `npm run test`, please try again after running `npm install`!');
		console.error(error);
		process.exit(1);
	}
	process.exit(0);
});
