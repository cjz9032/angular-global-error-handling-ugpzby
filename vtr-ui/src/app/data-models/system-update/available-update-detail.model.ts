import { UpdateActionResult } from 'src/app/enums/update-action-result.enum';
import { UpdateInstallSeverity } from 'src/app/enums/update-install-severity.enum';

export class AvailableUpdateDetail {
	public coreqPackageID: string;
	public currentInstalledVersion: string;
	public diskSpaceRequired: string;
	public licenseUrl: string;
	public packageDesc: string;
	public packageID: string;
	public packageName: string;
	public packageRebootType: string;
	public packageReleaseDate: string;
	public packageSeverity: UpdateInstallSeverity;
	public packageSize: string;
	public packageTips: string;
	public packageType: string;
	public packageVendor: string;
	public packageVersion: string;
	public readmeUrl: string;
	public isSelected = true;
	public isInstalled = false;
	public isIgnored = false;
	public installationStatus: UpdateActionResult = UpdateActionResult.Unknown;
}
