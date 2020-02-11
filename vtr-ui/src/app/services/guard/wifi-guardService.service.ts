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

	async canActivate() {
		this.securityAdvisor = this.vantageShellService.getSecurityAdvisor();
		this.wifiSecurity = this.securityAdvisor.wifiSecurity;
		const cacheState : boolean | undefined = this.commonService.getLocalStorageValue(LocalStorageKey.SecurityShowWifiSecurity);
		if (cacheState === undefined) {
			await this.wifiSecurity.getWifiSecurityStateOnce();
			if (typeof this.wifiSecurity.isSupported === 'boolean') {
				this.commonService.setLocalStorageValue(LocalStorageKey.SecurityShowWifiSecurity, this.wifiSecurity.isSupported);
				return this.wifiSecurity.isSupported;
			}

			return this.guardConstants.defaultRoute;
		}

		return cacheState;
	}
}
