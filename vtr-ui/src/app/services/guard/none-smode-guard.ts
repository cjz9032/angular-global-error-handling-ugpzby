import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { DeviceService } from '../device/device.service';

@Injectable({
	providedIn: 'root',
})
export class NoneSmodeGuard implements CanActivate {

	constructor(
		private deviceService: DeviceService,
		private router: Router
		) { }

	canActivate(
		route: ActivatedRouteSnapshot,
		state: RouterStateSnapshot
	): boolean | UrlTree {
		if (!this.deviceService.isSMode) {
			return true;
		}
		return this.router.parseUrl('/dashboard');
	}
}
