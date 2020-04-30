import { Injectable } from '@angular/core';
import { CanActivate, UrlTree, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { DeviceService } from '../device/device.service';
import { GuardConstants } from './guard-constants';
import { CommonService } from '../common/common.service';

@Injectable({
	providedIn: 'root',
})
export class NonArmGuard implements CanActivate {

	constructor(
		private deviceService: DeviceService,
		private guardConstants: GuardConstants,
		private commonService: CommonService
		) { }

	canActivate(
		route: ActivatedRouteSnapshot,
		state: RouterStateSnapshot
	): boolean | UrlTree {
		if (!this.deviceService.isArm) {
			return true;
		}
		return this.commonService.isFirstPageLoaded() ? false : this.guardConstants.defaultRoute;
	}
}
