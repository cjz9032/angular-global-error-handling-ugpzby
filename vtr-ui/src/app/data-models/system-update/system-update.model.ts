import { UpdateInfo } from './update-info.model';

export class SystemUpdate {
	constructor(
		public status: string,
		public updates: UpdateInfo
	) { }
}
