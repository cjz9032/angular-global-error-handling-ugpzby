import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { CommonService } from '../common/common.service';
import { DeviceService } from '../device/device.service';
import { retry } from 'rxjs/operators';
import { LocalInfoService } from '../local-info/local-info.service';

@Injectable({
	providedIn: 'root',
})
export class VpnGuardService implements CanActivate {
	constructor(
		private router: Router,
		private localInfoService: LocalInfoService) { }

	canActivate() {
		let region;
		return this.localInfoService
			.getLocalInfo()
			.then((result) => {
				region = result.GEO;
				return this.getCanActivate(region);
			})
			.catch((e) => {
				region = 'us';
				return this.getCanActivate(region);
			});
	}

	getCanActivate(region) {
		if (region === 'cn') {
			return this.router.parseUrl('dashboard');
		}
		return true;
	}
}
