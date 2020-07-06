import { Injectable } from '@angular/core';
import { UrlTree, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { GuardConstants } from './guard-constants';
import { LocalStorageKey } from 'src/app/enums/local-storage-key.enum';
import { CommonService } from '../common/common.service';
import { BasicGuard } from './basic-guard';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
	providedIn: 'root',
})
export class SmartPerformanceGuard extends BasicGuard {

	constructor(
		public guardConstants: GuardConstants,
		public commonService: CommonService,
		private router: Router
	) {
		super(commonService, guardConstants);
	}

	canActivate(
		route: ActivatedRouteSnapshot,
		state: RouterStateSnapshot
	): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
		const SPDeviceInfo = this.commonService.getLocalStorageValue(LocalStorageKey.SubBrand);
		if (SPDeviceInfo !== 'thinkpad') {
			return true;
		} else {
			return this.router.parseUrl('/dashboard');
		}
	}

}
