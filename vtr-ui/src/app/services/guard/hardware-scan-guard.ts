import { Injectable } from '@angular/core';
import { GuardConstants } from './guard-constants';
import { HardwareScanService } from '../../services/hardware-scan/hardware-scan.service';
import { CanActivate, CanActivateChild, Router, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { CommonService } from '../common/common.service';
import { BasicGuard } from './basic-guard';

@Injectable({
	providedIn: 'root'
})
export class HardwareScanGuard extends BasicGuard implements CanActivate, CanActivateChild {

	constructor(
		private router: Router,
		private guardConstants: GuardConstants,
		private hardwareScanService: HardwareScanService,
		private commonService: CommonService
	) { 
		super(commonService, guardConstants);
	}

	canActivate(
		route: ActivatedRouteSnapshot,
		state: RouterStateSnapshot
	): Promise<boolean | UrlTree> {
		return this.hardwareScanService.isAvailable().then((available)=>{
			if (available){
				return true;
			}
			return this.guardFallbackRoute;
		})
	}

	canActivateChild(
		childRoute: ActivatedRouteSnapshot,
		state: RouterStateSnapshot
	): Promise<boolean | UrlTree> {
		return this.canActivate(childRoute, state);
	}
}
