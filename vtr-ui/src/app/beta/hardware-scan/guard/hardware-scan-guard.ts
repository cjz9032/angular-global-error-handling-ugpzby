import { Injectable } from '@angular/core';
import {
	CanActivate,
	CanActivateChild,
	Router,
	ActivatedRouteSnapshot,
	RouterStateSnapshot,
	UrlTree
} from '@angular/router';

@Injectable({
	providedIn: 'root'
})
export class HardwareScanGuard implements CanActivate, CanActivateChild {
	constructor(private router: Router) {}

	private available(): boolean {
		return false;
	}

	canActivate(
		route: ActivatedRouteSnapshot,
		state: RouterStateSnapshot
	): boolean | UrlTree {
		if (!this.available()) {
			return this.router.parseUrl('/dashboard');
		}
		return true;
	}

	canActivateChild(
		childRoute: ActivatedRouteSnapshot,
		state: RouterStateSnapshot
	): boolean | UrlTree {
		return this.canActivate(childRoute, state);
	}
}
