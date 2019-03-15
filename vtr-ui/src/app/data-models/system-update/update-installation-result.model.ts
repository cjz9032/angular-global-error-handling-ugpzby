import { SystemUpdateStatusCode } from 'src/app/enums/system-update-status-code.enum';
import { InstallUpdateResult } from './install-update-result.model';

export class UpdateInstallationResult {
	constructor() { }

	public status: SystemUpdateStatusCode;
	public updateResultList: InstallUpdateResult[];
}
