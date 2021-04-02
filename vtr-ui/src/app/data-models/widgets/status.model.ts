import { IconName } from '@fortawesome/free-solid-svg-icons';
import { DeviceStatusCardType } from 'src/app/enums/system-state.enum';
import { StatusIconType } from 'src/app/material/material-chevron/material-status-icon/material-status-icon.component';

/**
 * model for status widgets
 */
export class Status {
	constructor() {
		this.status = 'loading';
	}
	public id: string;
	public isHidden?: boolean;
	public status?: StatusIconType;
	public title?: string;
	public detail?: string;
	public path?: string;
	public asLink?: boolean;
	public subtitle?: string;
	public type?: string;
	public systemDetails?: string;
	public isSystemLink?: boolean;
	public description?: string;
	public metricsItemName?: string;
	public category?: string;
	public icon?: IconName;
	public iconPath?: string;
	public date?: string;
	public launch?(): void;
	public retry?(): void;
	public retryText?: string;
}

export class DeviceStatus {
	constructor() {}
	public id: string;
	public icon: string;
	public title: string;
	public subtitle: string;
	public link: string;
	public total: string;
	public used: string;
	public percent: number;
	public checkedDate: string;
	public showSepline: boolean;
}

export class DeviceStatusCardDate {
	constructor() {
		this[DeviceStatusCardType.su] = {
			date: '',
			needPromote: false,
		};
		this[DeviceStatusCardType.hw] = {
			date: '',
			needPromote: false,
		};
	}
	public [DeviceStatusCardType.su]: {
		date: string;
		needPromote: boolean;
	};
	public [DeviceStatusCardType.hw]: {
		date: string;
		needPromote: boolean;
	};
}
