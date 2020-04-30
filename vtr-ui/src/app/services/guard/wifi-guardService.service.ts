import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRoute, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { CommonService } from '../common/common.service';
import { VantageShellService } from '../vantage-shell/vantage-shell.service';
import { LocalStorageKey } from 'src/app/enums/local-storage-key.enum';
import { SecurityAdvisor, WifiSecurity } from '@lenovo/tan-client-bridge';
import { GuardConstants } from './guard-constants';
import { LoggerService } from '../logger/logger.service';
import { BasicGuard } from './basic-guard';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
	providedIn: 'root',
})
export class WifiGuardService extends BasicGuard {
	securityAdvisor: SecurityAdvisor;
	wifiSecurity: WifiSecurity;

	constructor(
		public commonService: CommonService,
		private vantageShellService: VantageShellService,
		public guardConstants: GuardConstants,
		private logger: LoggerService
	) { 
		super(commonService, guardConstants);
	}

	private waitAsyncCallTimeout(func: Function, millisecond: number) : Promise<any> {
		const timeout = new Promise((resolve, reject) => {
			setTimeout(() => reject(new Error('Timeout')), millisecond);
		});
		return Promise.race([func(), timeout]);
	}

	async canActivate(
		route: ActivatedRouteSnapshot, 
		state: RouterStateSnapshot
	) : Promise<any> {
		if (state.root.queryParams['plugin'] === 'lenovowifisecurityplugin') {
			this.commonService.setLocalStorageValue(LocalStorageKey.SecurityShowWifiSecurity, true);
			return true;
		}

		this.securityAdvisor = this.vantageShellService.getSecurityAdvisor();
		this.wifiSecurity = this.securityAdvisor.wifiSecurity;
		const cacheState : boolean | undefined = this.commonService.getLocalStorageValue(LocalStorageKey.SecurityShowWifiSecurity);
		if (cacheState === undefined) {
			try {
				await this.waitAsyncCallTimeout(this.wifiSecurity.getWifiSecurityStateOnce, 5000);
			} catch (error) {
				this.logger.error('getWifiSecurityStateOnce call timeout');
			}
			if (typeof this.wifiSecurity.isSupported === 'boolean') {
				this.commonService.setLocalStorageValue(LocalStorageKey.SecurityShowWifiSecurity, this.wifiSecurity.isSupported);
				if (this.wifiSecurity.isSupported) return true;
			}

			return super.canActivate(route, state);
		}

		return cacheState;
	}
}
