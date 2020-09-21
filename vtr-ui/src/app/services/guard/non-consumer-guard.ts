import { Injectable } from '@angular/core';
import { UrlTree, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { SegmentConst } from '../self-select/self-select.service';
import { GuardConstants } from './guard-constants';
import { LocalStorageKey } from 'src/app/enums/local-storage-key.enum';
import { CommonService } from '../common/common.service';
import { BasicGuard } from './basic-guard';
import { Observable } from 'rxjs/internal/Observable';
import { LocalCacheService } from '../local-cache/local-cache.service';

@Injectable({
	providedIn: 'root',
})
export class NonConsumerGuard extends BasicGuard {

	constructor(
		private localCacheService: LocalCacheService,
		public guardConstants: GuardConstants,
		public commonService: CommonService
	) {
		super(commonService, guardConstants);
	}

	canActivate(
		route: ActivatedRouteSnapshot,
		state: RouterStateSnapshot
	): Observable<boolean | UrlTree> | Promise<boolean | UrlTree | any> | boolean | UrlTree {
		return this.localCacheService
			.getLocalCacheValue(LocalStorageKey.LocalInfoSegment)
			.then((segment) => {
				if (segment !== SegmentConst.Consumer) {
					return true;
				} else {
					return super.canActivate(route, state);
				}
			});
	}
}
