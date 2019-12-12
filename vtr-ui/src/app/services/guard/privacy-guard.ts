import { Injectable } from '@angular/core';
import { CanActivate, UrlTree, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { ConfigService } from '../config/config.service';
import { GuardConstants } from './guard-constants';

@Injectable({
	providedIn: 'root',
})
export class PrivacyGuard implements CanActivate {

	constructor(
		private congifService: ConfigService,
		private guardConstants: GuardConstants,
		) { }

	canActivate(
		route: ActivatedRouteSnapshot,
		state: RouterStateSnapshot
	): Promise<boolean|UrlTree> {
		return new Promise(resove => {
			this.congifService.canShowPrivacy().then(r => {
				if (r) {
					resove(true);
				}
				resove(this.guardConstants.defaultRoute);
			});
		});
	}
}
