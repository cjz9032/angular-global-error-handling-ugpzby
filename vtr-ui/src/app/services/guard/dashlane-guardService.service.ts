import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { LocalInfoService } from '../local-info/local-info.service';
import { GuardConstants } from './guard-constants';
import { CommonService } from '../common/common.service';
import { BasicGuard } from './basic-guard';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
	providedIn: 'root',
})
export class DashlaneGuardService extends BasicGuard {
	constructor(
		private localInfoService: LocalInfoService,
		public guardConstants: GuardConstants,
		public commonService: CommonService
	) {
		super(commonService, guardConstants);
	}

	canActivate(
		route: ActivatedRouteSnapshot,
		state: RouterStateSnapshot
	): Observable<boolean | UrlTree> | Promise<boolean | UrlTree | any> | boolean | UrlTree {
		return this.localInfoService
			.getLocalInfo()
			.then((result) => {
				if (result.GEO === 'cn') {
					return super.canActivate(route, state);
				}
				return true;
			})
			.catch((e) => true);
	}
}
