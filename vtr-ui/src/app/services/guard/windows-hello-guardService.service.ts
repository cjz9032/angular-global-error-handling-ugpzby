import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { CommonService } from '../common/common.service';
import { VantageShellService } from '../vantage-shell/vantage-shell.service';
import { LocalStorageKey } from 'src/app/enums/local-storage-key.enum';
import { SecurityAdvisor, WindowsHello } from '@lenovo/tan-client-bridge';
import { SecurityAdvisorMockService } from '../security/securityMock.service';
import { GuardConstants } from './guard-constants';

@Injectable({
	providedIn: 'root',
})
export class WindowsHelloGuardService implements CanActivate {
	securityAdvisor: SecurityAdvisor;
	windowsHello: WindowsHello;
	isRS5OrLater: boolean;
	constructor(
		private commonService: CommonService,
		private vantageShellService: VantageShellService,
		private securityAdvisorMockService: SecurityAdvisorMockService,
		private guardConstants: GuardConstants
	) { }

	canActivate() {
		this.securityAdvisor = this.vantageShellService.getSecurityAdvisor();
		if (!this.securityAdvisor) {
			this.securityAdvisor = this.securityAdvisorMockService.getSecurityAdvisor();
		}
		this.windowsHello = this.securityAdvisor.windowsHello;
		const showWhPage = this.commonService.getLocalStorageValue(LocalStorageKey.SecurityShowWindowsHello);
		const version = this.commonService.getWindowsVersion();
		if (version === 0) {
			this.isRS5OrLater = true;
		} else {
			this.isRS5OrLater = this.commonService.isRS5OrLater();
		}
		const result = this.isRS5OrLater
			&& (typeof this.windowsHello.fingerPrintStatus === 'string' || showWhPage);

		if (!result) {
			return this.guardConstants.defaultRoute;
		}
		return result;
	}
}
