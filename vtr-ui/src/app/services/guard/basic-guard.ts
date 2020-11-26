import { CommonService } from '../common/common.service';
import {
	UrlTree,
	CanActivate,
	ActivatedRouteSnapshot,
	RouterStateSnapshot,
	CanActivateChild,
} from '@angular/router';
import { GuardConstants } from './guard-constants';
import { Observable } from 'rxjs/internal/Observable';

export abstract class BasicGuard implements CanActivate, CanActivateChild {
	constructor(public commonService: CommonService, public guardConstants: GuardConstants) {}

	canActivate(
		route: ActivatedRouteSnapshot,
		state: RouterStateSnapshot
	): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
		return this.commonService.isFirstPageLoaded() ? false : this.guardConstants.defaultRoute;
	}

	canActivateChild(
		childRoute: ActivatedRouteSnapshot,
		state: RouterStateSnapshot
	): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
		return true;
	}

	canDeactivate(
		component: object,
		activatedRouteSnapshot: ActivatedRouteSnapshot,
		routerStateSnapshot: RouterStateSnapshot
	): Observable<boolean> | Promise<boolean> | boolean {
		return true;
	}
}
