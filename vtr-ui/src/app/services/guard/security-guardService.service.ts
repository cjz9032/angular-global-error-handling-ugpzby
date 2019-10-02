import { CommonService } from '../common/common.service';
import { VantageShellService } from '../vantage-shell/vantage-shell.service';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Router, UrlTree } from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { AdPolicyService } from '../ad-policy/ad-policy.service';
import { DeviceService } from '../device/device.service';

@Injectable({
	providedIn: 'root',
})
export class GuardService {
	interTime = 0;
	metrics: any;
	pageContext: any;
	previousPageName = '';
	duration = 0;

	constructor(
		shellService: VantageShellService,
		private commonService: CommonService,
		private router: Router,
		private adPolicy: AdPolicyService,
		private deviceService: DeviceService) {

		this.metrics = shellService.getMetrics();
		window.addEventListener('blur', () => {
			this.duration = this.duration + parseInt(`${Math.floor((Date.now() - this.interTime) / 1000)}`, 10);

		});
		window.addEventListener('focus', () => {
			this.interTime = Date.now();

		});

	}

	canActivate(activatedRouteSnapshot: ActivatedRouteSnapshot, routerStateSnapshot: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean | UrlTree{
		this.interTime = Date.now();
		if (routerStateSnapshot.url.includes('system-updates')
		&& (!this.adPolicy.IsSystemUpdateEnabled
			|| this.deviceService.isSMode))
		{
			return this.router.parseUrl('/dashboard');
		}
		return true;
	}

	canDeactivate(component: object, activatedRouteSnapshot: ActivatedRouteSnapshot, routerStateSnapshot: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
		this.pageContext = activatedRouteSnapshot.data.pageContent;
		if (this.pageContext && this.pageContext.indexOf('[LocalStorageKey]') !== -1) {
			this.pageContext = this.commonService.getLocalStorageValue(this.pageContext);
		}

		const data = {
			ItemType: 'PageView',
			PageName: activatedRouteSnapshot.data.pageName,
			PageDuration: this.duration + parseInt(`${Math.floor((Date.now() - this.interTime) / 1000)}`, 10),
			PageContext: this.pageContext,
		};
		console.log('Deactivate : ' + activatedRouteSnapshot.data.pageName, ' >>>>>>>>>> ', data);
		this.previousPageName = activatedRouteSnapshot.data.pageName;
		this.metrics.sendAsync(data);
		return true;
	}
}
