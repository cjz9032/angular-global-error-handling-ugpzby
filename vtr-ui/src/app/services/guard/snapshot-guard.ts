import { Injectable } from '@angular/core';
import { GuardConstants } from './guard-constants';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { CommonService } from '../common/common.service';
import { BasicGuard } from './basic-guard';

@Injectable({
	providedIn: 'root'
})
export class SnapshotGuard extends BasicGuard {

	constructor(
		public guardConstants: GuardConstants,
		public commonService: CommonService
	) {
		super(commonService, guardConstants);
	}

	canActivate(
		route: ActivatedRouteSnapshot,
		state: RouterStateSnapshot
	): boolean | UrlTree {
		return true;
		// TODO: Update to this return when create a function to
		// validate if Snapshot feature can be used (Ex.: HardwareScanGuard)
		// return super.canActivate(route, state);
	}

	canActivateChild(
		childRoute: ActivatedRouteSnapshot,
		state: RouterStateSnapshot
	): boolean | UrlTree {
		return this.canActivate(childRoute, state);
	}
}
