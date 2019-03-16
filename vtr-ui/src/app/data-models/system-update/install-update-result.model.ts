import { UpdateActionResult } from 'src/app/enums/update-action-result.enum';

export class InstallUpdateResult {
	public packageID: string;
	public actionResult: UpdateActionResult;
}
