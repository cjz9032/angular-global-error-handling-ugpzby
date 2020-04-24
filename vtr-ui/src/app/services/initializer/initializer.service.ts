import { Injectable } from '@angular/core';
import { VantageShellService } from '../vantage-shell/vantage-shell.service';
import { DeviceService } from '../device/device.service';
import { CommonService } from '../common/common.service';
import { LocalStorageKey } from 'src/app/enums/local-storage-key.enum';
import { SegmentConst } from '../self-select/self-select.service';
import { LoggerService } from '../logger/logger.service';
import { SessionStorageKey } from 'src/app/enums/session-storage-key-enum';

@Injectable({
  providedIn: 'root'
})
export class InitializerService {

	constructor(private vantageShellService: VantageShellService, private deviceService: DeviceService, private commonService: CommonService) { }

	initialize() {
		this.commonService.setSessionStorageValue(SessionStorageKey.FirstPageLoaded, false);
		this.initializeAntivirus();
	}

	initializeAntivirus() {
		if (this.vantageShellService.isShellAvailable) {
			const segment: SegmentConst = this.commonService.getLocalStorageValue(LocalStorageKey.LocalInfoSegment);
			if (segment && segment !== SegmentConst.Commercial && segment !== SegmentConst.Gaming && !this.deviceService.isArm && !this.deviceService.isSMode) {
				const securityAdvisor = this.vantageShellService.getSecurityAdvisor();
				if (securityAdvisor && securityAdvisor.antivirus) {
					securityAdvisor.antivirus.refresh();
				}
			}
		}
	}
}
