import { Injectable } from '@angular/core';
import { CommsService } from '../comms/comms.service';
import { DevService } from '../dev/dev.service';

@Injectable()
export class ContainerService {
	appId = '';

	constructor(private commsService: CommsService, private devService: DevService) {}

	setAppId(appId) {
		this.commsService.appId = appId;
		this.appId = appId;
	}

	loadAppId() {
		this.devService.writeLog('LOAD GUID');
	}
}
