import { CommonService } from '../common/common.service';
import { VantageShellService } from '../vantage-shell/vantage-shell.service';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Router, UrlTree, NavigationEnd } from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { AdPolicyService } from '../ad-policy/ad-policy.service';
import { DeviceService } from '../device/device.service';
import { DurationCounterService } from 'src/app/services/timer/timer-service-ex.service';
import { GuardConstants } from './guard-constants';
import { BasicGuard } from './basic-guard';
import { MetricService } from '../metric/metrics.service';

@Injectable({
	providedIn: 'root',
})
export class GuardService extends BasicGuard {
	interTime = 0;
	metrics: any;
	pageContext: any;
	previousPageName = '';
	duration = 0;
	timer = 0;
	activeTime = 0;
	focusDurationCounter = null;
	blurDurationCounter = null;
	activePageViewMetric = true;

	constructor(
		shellService: VantageShellService,
		public commonService: CommonService,
		private adPolicy: AdPolicyService,
		private deviceService: DeviceService,
		public guardConstants: GuardConstants,
		private timerService: DurationCounterService,
		private metricsService: MetricService) {
		super(commonService, guardConstants);
		this.metrics = shellService.getMetrics();
	}

	canActivate(
		activatedRouteSnapshot: ActivatedRouteSnapshot,
		routerStateSnapshot: RouterStateSnapshot
	): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
		this.metricsService.onPageRouteActivated();
		this.focusDurationCounter = this.timerService.getFocusDurationCounter();
		this.blurDurationCounter = this.timerService.getBlurDurationCounter();

		if (routerStateSnapshot.url.includes('system-updates') &&
			(!this.adPolicy.IsSystemUpdateEnabled ||
				this.deviceService.isSMode)) {
			return super.canActivate(activatedRouteSnapshot, routerStateSnapshot);
		}
		if (routerStateSnapshot.url.includes('dashboard')) { }

		this.activePageViewMetric = true;
		return true;
	}

	canDeactivate(component: object, activatedRouteSnapshot: ActivatedRouteSnapshot, routerStateSnapshot: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
		window.getSelection().empty();
		this.pageContext = activatedRouteSnapshot.data.pageContent;
		this.previousPageName = activatedRouteSnapshot.data.pageName;

		if (this.activePageViewMetric === true) {
			this.activePageViewMetric = false;
			this.sendPageViewMetric(activatedRouteSnapshot);
		}

		return true;
	}

	sendPageViewMetric(activatedRouteSnapshot: ActivatedRouteSnapshot) {
		if (this.pageContext && this.pageContext.indexOf('[LocalStorageKey]') !== -1) {
			this.pageContext = this.commonService.getLocalStorageValue(this.pageContext);
		}
		const focusDuration = this.focusDurationCounter !== null ? this.focusDurationCounter.getDuration() : 0;
		const blurDuration = this.blurDurationCounter !== null ? this.blurDurationCounter.getDuration() : 0;

		const data = {
			ItemType: 'PageView',
			PageName: activatedRouteSnapshot.data.pageName,
			PageDuration: focusDuration,
			PageDurationBlur: blurDuration,
			PageContext: this.pageContext
		};
		this.metrics.sendAsync(data);
	}
}
