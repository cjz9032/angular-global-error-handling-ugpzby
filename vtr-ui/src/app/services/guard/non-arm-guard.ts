import { Injectable } from '@angular/core';
import { UrlTree, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { DeviceService } from '../device/device.service';
import { GuardConstants } from './guard-constants';
import { CommonService } from '../common/common.service';
import { BasicGuard } from './basic-guard';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
	providedIn: 'root',
})
export class NonArmGuard extends BasicGuard {

	constructor(
		private deviceService: DeviceService,
		public guardConstants: GuardConstants,
		public commonService: CommonService
	) {
		super(commonService, guardConstants);
	}

	canActivate(
		route: ActivatedRouteSnapshot,
		state: RouterStateSnapshot
	): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
		if (!this.deviceService.isArm) {
			return true;
		}
		return super.canActivate(route, state);
	}
}
