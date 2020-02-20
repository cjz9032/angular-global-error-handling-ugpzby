import { Injectable } from '@angular/core';
import {
	CanActivate,
	CanActivateChild,
	Router,
	ActivatedRouteSnapshot,
	RouterStateSnapshot,
	UrlTree
} from '@angular/router';
import { BetaService } from 'src/app/services/beta/beta.service';

@Injectable({
	providedIn: 'root'
})
export class HardwareScanGuard implements CanActivate, CanActivateChild {
	constructor(private router: Router) {}

	canActivate(
		route: ActivatedRouteSnapshot,
		state: RouterStateSnapshot
	): boolean | UrlTree {
		return true;
	}

	canActivateChild(
		childRoute: ActivatedRouteSnapshot,
		state: RouterStateSnapshot
	): boolean | UrlTree {
		return this.canActivate(childRoute, state);
	}
}
