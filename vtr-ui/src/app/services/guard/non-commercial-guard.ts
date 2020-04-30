import { Injectable } from '@angular/core';
import { CanActivate, UrlTree, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { LocalInfoService } from '../local-info/local-info.service';
import { SegmentConst } from '../self-select/self-select.service';
import { GuardConstants } from './guard-constants';
import { LocalStorageKey } from 'src/app/enums/local-storage-key.enum';
import { CommonService } from '../common/common.service';
import { BasicGuard } from './basic-guard';

@Injectable({
	providedIn: 'root',
})
export class NonCommercialGuard extends BasicGuard implements CanActivate {

	constructor(
		private localInfoService: LocalInfoService,
		private guardConstants: GuardConstants,
		private commonService: CommonService
	) { 
		super(commonService, guardConstants);
	}

	getCanActivate(segmentTag) {
		if (segmentTag !== SegmentConst.Commercial) {
			return true;
		}
		return this.guardFallbackRoute;
	}

	canActivate(
		route: ActivatedRouteSnapshot,
		state: RouterStateSnapshot
	): Promise<boolean | UrlTree> | boolean | UrlTree {
		const segment: SegmentConst = this.commonService.getLocalStorageValue(LocalStorageKey.LocalInfoSegment);
		if (segment) { return this.getCanActivate(segment); }
	}
}
