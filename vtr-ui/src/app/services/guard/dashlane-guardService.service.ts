import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { LocalInfoService } from '../local-info/local-info.service';
import { GuardConstants } from './guard-constants';
import { CommonService } from '../common/common.service';
import { BasicGuard } from './basic-guard';

@Injectable({
	providedIn: 'root',
})
export class DashlaneGuardService extends BasicGuard implements CanActivate {
	constructor(
		private localInfoService: LocalInfoService,
		private guardConstants: GuardConstants,
		private commonService: CommonService
	) {
		super(commonService, guardConstants);
	}

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
			return this.guardFallbackRoute;
		}
		return true;
	}
}
