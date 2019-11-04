import { Injectable } from '@angular/core';
import {
	CanActivate,
	CanActivateChild,
	ActivatedRouteSnapshot,
	RouterStateSnapshot
} from '@angular/router';

import { HardwareScanService } from '../services/hardware-scan/hardware-scan.service';

@Injectable({
	providedIn: 'root'
})
export class HardwareScanGuard implements CanActivate, CanActivateChild {
	available = false;

	constructor(private hwscan: HardwareScanService) {
		if (this.hwscan && typeof this.hwscan.isAvailable === 'function') {
			this.hwscan.isAvailable().then(data => {
				this.available = data;
			});
		}
	}

	canActivate(
		route: ActivatedRouteSnapshot,
		state: RouterStateSnapshot
	): boolean {
		return this.available;
	}

	canActivateChild(
		childRoute: ActivatedRouteSnapshot,
		state: RouterStateSnapshot
	): boolean {
		return this.canActivate(childRoute, state);
	}
}
