import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { ConfigService } from '../config/config.service';

@Injectable({
	providedIn: 'root',
})
export class HomeSecurityGuard implements CanActivate {

	constructor(
		private configService: ConfigService,
		private router: Router
		) { }

	getShowCHS(): boolean {
		return this.configService && this.configService.showCHSMenu;
	}

	canActivate(): boolean | UrlTree {
		if (this.getShowCHS()) {
			return true;
		}
		return this.router.parseUrl('/dashboard');
	}
}
