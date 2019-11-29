import { Injectable } from '@angular/core';
import { CanActivate, UrlTree, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { DeviceService } from '../device/device.service';
import { GuardConstants } from './guard-constants';

@Injectable({
	providedIn: 'root',
})
export class PrivacyGuard implements CanActivate {

	constructor(
		private deviceService: DeviceService,
		private guardConstants: GuardConstants,
		) { }

	getShowPrivacy(): boolean {
		return this.deviceService && this.deviceService.showPrivacy;
	}

	canActivate(
		route: ActivatedRouteSnapshot,
		state: RouterStateSnapshot
	): boolean | UrlTree {
		if (this.getShowPrivacy()) {
			return true;
		}
		return this.guardConstants.defaultRoute;
	}
}
