import { UpdateInstallAction } from 'src/app/enums/update-install-action.enum';
import { UpdateInstallSeverity } from 'src/app/enums/update-install-severity.enum';

export class InstallUpdate {
	constructor() {}
	public packageID: string;
	public action: UpdateInstallAction = UpdateInstallAction.DownloadAndInstall;
	public severity: UpdateInstallSeverity;
}
