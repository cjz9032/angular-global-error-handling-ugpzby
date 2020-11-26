import { InstallUpdateResult } from './install-update-result.model';

export class UpdateInstallationResult {
	constructor() {}

	public status: number;
	public updateResultList: InstallUpdateResult[];
}
