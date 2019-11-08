import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { ConfigService } from '../config/config.service';
import { DeviceService } from '../device/device.service';

@Injectable({
	providedIn: 'root',
})
export class PrivacyGuardService implements CanActivate {

	constructor(
		private configService: ConfigService,
		private deviceService: DeviceService,
		private router: Router
		) { }

	getShowPrivacy(): boolean {
		if (this.deviceService && this.deviceService.getMachineInfoSync() && this.configService) {
			return this.deviceService.showPrivacy
			&& this.deviceService.getMachineInfoSync().brand.toLowerCase() !== 'think'
			&& !this.deviceService.isArm
			&& !this.deviceService.isSMode
			&& !this.deviceService.isGaming;
		}
		return false;
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
