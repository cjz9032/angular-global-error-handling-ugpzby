import { Injectable } from '@angular/core';
import { UrlTree, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { SegmentConst } from '../self-select/self-select.service';
import { GuardConstants } from './guard-constants';
import { LocalStorageKey } from 'src/app/enums/local-storage-key.enum';
import { CommonService } from '../common/common.service';
import { BasicGuard } from './basic-guard';
import { Observable } from 'rxjs/internal/Observable';
import { LocalCacheService } from '../local-cache/local-cache.service';
import { VantageShellService } from '../vantage-shell/vantage-shell.service';

@Injectable({
	providedIn: 'root',
})
export class NonShellGuard extends BasicGuard {
	constructor(
		private vantageShellService: VantageShellService,
		public guardConstants: GuardConstants,
		public commonService: CommonService
	) {
		super(commonService, guardConstants);
	}

	canActivate(
		route: ActivatedRouteSnapshot,
		state: RouterStateSnapshot
	): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
		if (this.vantageShellService.isShellAvailable) {
			return true;
		}
		return super.canActivate(route, state);
	}

	canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
		return this.canActivate(childRoute, state);
	}
}
