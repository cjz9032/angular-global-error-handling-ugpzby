import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { DeviceService } from '../device/device.service';

@Injectable({
	providedIn: 'root',
})
export class PrivacyGuard implements CanActivate {

	constructor(
		private deviceService: DeviceService,
		private router: Router
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
		return this.router.parseUrl('/dashboard');
	}
}
