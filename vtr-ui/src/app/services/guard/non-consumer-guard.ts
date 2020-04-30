import { Injectable } from '@angular/core';
import { CanActivate, UrlTree, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { SegmentConst } from '../self-select/self-select.service';
import { GuardConstants } from './guard-constants';
import { LocalStorageKey } from 'src/app/enums/local-storage-key.enum';
import { CommonService } from '../common/common.service';

@Injectable({
	providedIn: 'root',
})
export class NonConsumerGuard implements CanActivate {

	constructor(
		private guardConstants: GuardConstants,
		private commonService: CommonService
		) { }

	getCanActivate(segmentTag) {
		if (segmentTag !== SegmentConst.Consumer) {
			return true;
		}
		return this.commonService.isFirstPageLoaded() ? false : this.guardConstants.defaultRoute;
	}

	canActivate(
		route: ActivatedRouteSnapshot,
		state: RouterStateSnapshot
	): Promise<boolean | UrlTree> | boolean | UrlTree {
		const segment: SegmentConst = this.commonService.getLocalStorageValue(LocalStorageKey.LocalInfoSegment);
		if (segment) { return this.getCanActivate(segment); }
	}
}
