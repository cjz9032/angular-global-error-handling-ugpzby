$projectRoot = (Get-Item $PSScriptRoot).Parent.FullName;
$idirs = Join-Path $projectRoot coverity-idirs;

Get-Command 'cov-configure' -ErrorAction Stop | Out-Null;
Write-Host -NoNewline 'Configuring TypeScript checkers...'
Invoke-Expression -Command 'cov-configure --javascript --no-html' 2>&1 | Out-Null;
Write-Host 'done';

Get-Command 'cov-build' -ErrorAction Stop | Out-Null;
Write-Host -NoNewline 'Now, capturing source files from src...'
$src = Join-Path $projectRoot src\app;
$command = 'cov-build --dir ' + $idirs + ' --delete-stale-tus --fs-capture-search ' + $src + ' --no-command --fs-capture-search-exclude-regex node_modules';
Invoke-Expression -Command $command | Out-Null;
Write-Host 'done';

Get-Command 'cov-analyze' -ErrorAction Stop | Out-Null;
Write-Host -NoNewline 'Now, analyzing...';
$command = 'cov-analyze --dir ' + $idirs + ' --strip-path ' + $projectRoot + ' --all --security --webapp-security --enable-audit-mode -en HARDCODED_CREDENTIALS -en RISKY_CRYPTO'
Invoke-Expression -Command $command | Out-Null;
Write-Host 'done';

Get-Command 'cov-format-errors' -ErrorAction Stop | Out-Null;
Write-Host -NoNewline 'Now, generating local reports...';
$output = Join-Path $idirs report;
if (Test-Path $output) {
	Get-ChildItem -Path $output -Recurse | Remove-Item -force -recurse
}
$command = 'cov-format-errors --dir ' + $idirs + ' --html-output ' + $output;
Invoke-Expression -Command $command | Out-Null;
Write-Host 'done';

Get-Command 'cov-commit-defects' -ErrorAction Stop | Out-Null;
Write-Host -NoNewline 'Now, committing the result to the server...';
$keyfile = Join-Path (Get-Item $PSScriptRoot) 'auth-key';
$command = 'cov-commit-defects --dir ' + $idirs + ' --host coverity.tc.lenovo.com --https-port 443 --stream tan-client-experience --auth-key-file ' + $keyfile;
Invoke-Expression -Command $command | Out-Null;
Write-Host 'done';
