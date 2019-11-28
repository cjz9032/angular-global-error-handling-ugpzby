import { Injectable } from '@angular/core';
import { CanActivate, UrlTree } from '@angular/router';
import { ConfigService } from '../config/config.service';
import { GuardConstants } from './guard-constants';

@Injectable({
	providedIn: 'root',
})
export class HomeSecurityGuard implements CanActivate {

	constructor(
		private configService: ConfigService,
		private guardConstants: GuardConstants
		) { }

	getShowCHS(): boolean {
		return this.configService && this.configService.showCHSMenu;
	}

	canActivate(): boolean | UrlTree {
		if (this.getShowCHS()) {
			return true;
		}
		return this.guardConstants.defaultRoute;
	}
}
