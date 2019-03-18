import { AvailableUpdateDetail } from './available-update-detail.model';
import { SystemUpdateStatusCode } from 'src/app/enums/system-update-status-code.enum';

export class AvailableUpdate {
	public status: SystemUpdateStatusCode;
	public updateList: AvailableUpdateDetail[];
}
