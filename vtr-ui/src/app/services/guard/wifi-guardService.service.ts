import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { CommonService } from '../common/common.service';
import { VantageShellService } from '../vantage-shell/vantage-shell.service';
import { LocalStorageKey } from 'src/app/enums/local-storage-key.enum';
import { SecurityAdvisor, WifiSecurity } from '@lenovo/tan-client-bridge';
import { GuardConstants } from './guard-constants';

@Injectable({
	providedIn: 'root',
})
export class WifiGuardService implements CanActivate {
	securityAdvisor: SecurityAdvisor;
	wifiSecurity: WifiSecurity;
	constructor(
		private commonService: CommonService,
		private vantageShellService: VantageShellService,
		private guardConstants: GuardConstants
	) { }

	canActivate() {
		this.securityAdvisor = this.vantageShellService.getSecurityAdvisor();
		this.wifiSecurity = this.securityAdvisor.wifiSecurity;
		let result = this.commonService.getLocalStorageValue(LocalStorageKey.SecurityShowWifiSecurity, false);
		if (typeof this.wifiSecurity.isSupported === 'boolean') {
			result = this.wifiSecurity.isSupported;
		}
		if (!result) {
			return this.guardConstants.defaultRoute;
		}
		return result;
	}
}
