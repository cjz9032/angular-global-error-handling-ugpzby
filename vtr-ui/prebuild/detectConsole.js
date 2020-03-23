const { exec } = require('child_process');
const cmd = 'npm run remove-console -- -d';
exec(cmd, function(error, stdout, stderr) {
    if (stderr || error) {
        console.log(stderr);
        console.log(error);
        console.log('Something wrong when detect console, please try again after run npm install!');
        process.exit(1);
    }

    if (stdout.includes('console count')) {
        console.log(stdout);
        console.log('Submit console.log is not allowed due to SSRB, please submit your code again after delete your console.log! you can run "npm run remove-console" to remove all your console quickly');
        process.exit(1);
    }

    process.exit(0);
});
