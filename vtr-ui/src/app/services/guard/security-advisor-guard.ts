import { Injectable } from '@angular/core';
import { UrlTree, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { SegmentConst } from '../self-select/self-select.service';
import { GuardConstants } from './guard-constants';
import { LocalStorageKey } from 'src/app/enums/local-storage-key.enum';
import { CommonService } from '../common/common.service';
import { BasicGuard } from './basic-guard';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
	providedIn: 'root',
})
export class SecurityAdvisorGuard extends BasicGuard {

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
		const segment: SegmentConst = this.commonService.getLocalStorageValue(LocalStorageKey.LocalInfoSegment);
		if (segment === SegmentConst.Consumer || segment === SegmentConst.SMB) return true;

		return this.router.parseUrl('/security/wifi-security');
	}
}