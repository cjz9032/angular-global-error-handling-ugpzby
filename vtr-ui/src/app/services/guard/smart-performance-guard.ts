import { Injectable } from '@angular/core';
import { UrlTree, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { GuardConstants } from './guard-constants';
import { LocalStorageKey } from 'src/app/enums/local-storage-key.enum';
import { CommonService } from '../common/common.service';
import { BasicGuard } from './basic-guard';
import { Observable } from 'rxjs/internal/Observable';
import { ConfigService } from '../config/config.service';

@Injectable({
	providedIn: 'root',
})
export class SmartPerformanceGuard extends BasicGuard {

	constructor(
		public guardConstants: GuardConstants,
		public commonService: CommonService,
		private router: Router,
		private configService: ConfigService
	) {
		super(commonService, guardConstants);
	}

	canActivate(
		route: ActivatedRouteSnapshot,
		state: RouterStateSnapshot
	): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
		if (this.configService.isSmartPerformanceAvailable) {
			return true;
		} else {
			return this.router.parseUrl('/dashboard');
		}
	}

}
