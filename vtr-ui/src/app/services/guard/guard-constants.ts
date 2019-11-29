import { UrlTree, Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { DeviceService } from '../device/device.service';

@Injectable({
	providedIn: 'root',
})
export class GuardConstants {
	defaultRoute: UrlTree | boolean;

	constructor(
		private router: Router,
		private deviceService: DeviceService
	) {
		this.defaultRoute = this.router.url === '/dashboard' || this.router.url === '/device-gaming' ?
							false :
							this.router.parseUrl(this.deviceService.isGaming ? '/device-gaming' : '/dashboard');
	}
}
