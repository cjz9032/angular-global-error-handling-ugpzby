import { Injectable } from '@angular/core';
import { CanActivate, UrlTree, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { DeviceService } from '../device/device.service';
import { GuardConstants } from './guard-constants';

@Injectable({
	providedIn: 'root',
})
export class NonSmodeGuard implements CanActivate {

	constructor(
		private deviceService: DeviceService,
		private guardConstants: GuardConstants,
		) { }

	canActivate(
		route: ActivatedRouteSnapshot,
		state: RouterStateSnapshot
	): boolean | UrlTree {
		if (!this.deviceService.isSMode) {
			return true;
		}
		return this.guardConstants.defaultRoute;
	}
}
