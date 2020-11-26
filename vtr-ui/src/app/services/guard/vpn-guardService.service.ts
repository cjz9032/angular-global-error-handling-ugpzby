import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { LocalInfoService } from '../local-info/local-info.service';
import { GuardConstants } from './guard-constants';
import { CommonService } from '../common/common.service';
import { BasicGuard } from './basic-guard';

@Injectable({
	providedIn: 'root',
})
export class VpnGuardService extends BasicGuard {
	constructor(
		private localInfoService: LocalInfoService,
		public guardConstants: GuardConstants,
		public commonService: CommonService
	) {
		super(commonService, guardConstants);
	}

	canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<any> {
		return this.localInfoService
			.getLocalInfo()
			.then((result) => {
				if (result.GEO === 'cn') {
					return super.canActivate(route, state);
				}
				return true;
			})
			.catch(() => true);
	}
}
