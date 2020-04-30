import { Injectable } from '@angular/core';
import { CanActivate, UrlTree } from '@angular/router';
import { ConfigService } from '../config/config.service';
import { GuardConstants } from './guard-constants';
import { CommonService } from '../common/common.service';

@Injectable({
	providedIn: 'root',
})
export class HomeSecurityGuard implements CanActivate {

	constructor(
		private configService: ConfigService,
		private guardConstants: GuardConstants,
		private commonService: CommonService
		) { }

	getShowCHS(): boolean {
		return this.configService && this.configService.showCHS;
	}

	canActivate(): boolean | UrlTree {
		if (this.getShowCHS()) {
			return true;
		}
		return this.commonService.isFirstPageLoaded() ? false : this.guardConstants.defaultRoute;
	}
}
