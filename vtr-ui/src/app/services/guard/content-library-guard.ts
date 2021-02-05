import { Injectable } from '@angular/core';
import { GuardConstants } from './guard-constants';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { CommonService } from '../common/common.service';
import { BasicGuard } from './basic-guard';
import { DeviceService } from '../device/device.service';

@Injectable({
	providedIn: 'root',
})
export class ContentLibraryGuard extends BasicGuard {
	constructor(
		public guardConstants: GuardConstants,
		private deviceService: DeviceService,
		public commonService: CommonService
	) {
		super(commonService, guardConstants);
	}

	canActivate(
		route: ActivatedRouteSnapshot,
		state: RouterStateSnapshot
	): Promise<any> {
		return this.deviceService.isCdDevice().then((isCdDevice) => {
			if (!isCdDevice) {
				return true;
			}
			return super.canActivate(route, state);
		});
	}

}
