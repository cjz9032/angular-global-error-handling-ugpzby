import { Injectable } from '@angular/core';
import { VantageShellService } from 'src/app/services/vantage-shell/vantage-shell.service';
import { SystemEventFeature, EventTypes, SystemEvent } from '@lenovo/tan-client-bridge';
import { CommonService } from '../common/common.service';
import { LoggerService } from '../logger/logger.service';
@Injectable({
	providedIn: 'root'
})
export class SystemEventService {

	private sysEvent: SystemEventFeature;

	constructor(
		private shellService: VantageShellService,
		private commonService: CommonService,
		private logger: LoggerService,

	) {
		this.sysEvent = this.shellService.getSysEventFeature();
		if (this.sysEvent) {
			this.sysEvent.startListen();
			this.sysEvent.on(EventTypes.customEvent, (event: SystemEvent) => {
				this.commonService.sendNotification(event.Name, event.EventArgs);
			});
		}
	}

	async registerCustomEvent(eventName: string): Promise<boolean> {
		try {
			await this.sysEvent.registerCustomEvent(eventName);
			return true;
		} catch{
			this.logger.error(`registerCustomEvent ${eventName} failed`);
		}
		return false;
	}

	async unRegisterCustomEvent(eventName: string): Promise<boolean> {
		try {
			await this.sysEvent.unRegisterCustomEvent(eventName);
			return true;
		} catch{
			this.logger.error(`unRegisterCustomEvent ${eventName} failed`);
		}
		return false;
	}

	cancelListen(): void {
		try {
			this.sysEvent.cancelListen();
		}
		catch{
			this.logger.error(`cancelListen failed`);
		}
	}

}