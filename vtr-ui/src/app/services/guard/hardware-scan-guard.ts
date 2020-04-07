import { Injectable } from '@angular/core';
import { GuardConstants } from './guard-constants';
import { HardwareScanService } from '../../services/hardware-scan/hardware-scan.service';
import { CanActivate, CanActivateChild, Router, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { state } from '@angular/animations';

@Injectable({
	providedIn: 'root'
})
export class HardwareScanGuard implements CanActivate, CanActivateChild {

	constructor(
		private router: Router,
		private guardConstants: GuardConstants,
		private hardwareScanService: HardwareScanService
	) { }

	canActivate(
		route: ActivatedRouteSnapshot,
		state: RouterStateSnapshot
	): boolean | UrlTree {
		return this.hardwareScanService.getAvailableHWScan() ? true : this.guardConstants.defaultRoute;
	}

	canActivateChild(
		childRoute: ActivatedRouteSnapshot,
		state: RouterStateSnapshot
	): boolean | UrlTree {
		return this.canActivate(childRoute, state);
	}
}
