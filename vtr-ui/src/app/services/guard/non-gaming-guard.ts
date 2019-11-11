import { Injectable } from '@angular/core';
import { CanActivate, UrlTree, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { LocalInfoService } from '../local-info/local-info.service';
import { SegmentConst } from '../self-select/self-select.service';
import { GuardConstants } from './guard-constants';

@Injectable({
	providedIn: 'root',
})
export class NonGamingGuard implements CanActivate {

	constructor(
		private localInfoService: LocalInfoService,
		private guardConstants: GuardConstants,
		) { }

	getCanActivate(segmentTag) {
		if (segmentTag !== SegmentConst.Gaming) {
			return true;
		}
		return this.guardConstants.defaultRoute;
	}

	canActivate(
		route: ActivatedRouteSnapshot,
		state: RouterStateSnapshot
	): Promise<boolean | UrlTree> {
		let segmentTag: string;
		return this.localInfoService.getLocalInfo()
			.then((result) => {
				segmentTag = result.Segment;
				return this.getCanActivate(segmentTag);
			}).catch((e) => {
				segmentTag = SegmentConst.Consumer;
				return this.getCanActivate(segmentTag);
			});
	}
}
