import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { ConfigService } from '../config/config.service';
import { DeviceService } from '../device/device.service';

@Injectable({
	providedIn: 'root',
})
export class HomeSecurityGuardService implements CanActivate {

	constructor(
		private configService: ConfigService,
		private deviceService: DeviceService,
		private router: Router
		) { }

	getShowCHS(): boolean {
		if (this.deviceService && this.deviceService.getMachineInfoSync() && this.configService) {
			return this.configService.showCHSMenu
			&& this.deviceService.getMachineInfoSync().brand.toLowerCase() !== 'think'
			&& !this.deviceService.isArm
			&& !this.deviceService.isSMode
			&& !this.deviceService.isGaming;
		}
		return false;
	}

	canActivate(): boolean | UrlTree {
		if (this.getShowCHS()) {
			return true;
		}
		return this.router.parseUrl('/dashboard');
	}
}
