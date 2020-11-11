import { DeviceService } from './../device/device.service';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs/internal/Observable';
import { CommonService } from '../common/common.service';
import { BasicGuard } from './basic-guard';
import { GuardConstants } from './guard-constants';

@Injectable({
	providedIn: 'root',
})
export class DashboardGuard extends BasicGuard {
	constructor(
		public guardConstants: GuardConstants,
		public commonService: CommonService,
		private deviceService: DeviceService,
		private router: Router,
	) {
		super(commonService, guardConstants);
	}

	canActivate(
		route: ActivatedRouteSnapshot,
		state: RouterStateSnapshot
	): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
		return this.deviceService.isGaming ? this.router.parseUrl('/device-gaming') : true;
	}
}
