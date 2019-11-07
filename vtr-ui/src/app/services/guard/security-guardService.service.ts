import { CommonService } from '../common/common.service';
import { VantageShellService } from '../vantage-shell/vantage-shell.service';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Router, UrlTree, NavigationEnd } from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { AdPolicyService } from '../ad-policy/ad-policy.service';
import { DeviceService } from '../device/device.service';
import { TimerServiceEx } from 'src/app/services/timer/timer-service-ex.service';

@Injectable({
	providedIn: 'root',
})
export class GuardService {
	interTime = 0;
	metrics: any;
	pageContext: any;
	previousPageName = '';
	duration = 0;
	timer = 0;
	activeTime = 0;
	focusDurationCounter = null;
	blurDurationCounter = null;

	constructor(
		shellService: VantageShellService,
		private commonService: CommonService,
		private router: Router,
		private adPolicy: AdPolicyService,
		private deviceService: DeviceService,
		private timerService: TimerServiceEx) {

		this.metrics = shellService.getMetrics();

		// router.events.subscribe((event) => {
		// 	if (event instanceof NavigationEnd) {
		// 		// reset timer / start timer
		// 		// this.duration = parseInt(`${Math.floor((Date.now()) / 1000)}`, 10); // eg :13sec
		// 		this.timerService.start();
		// 		console.log('TIME SET FOR THE NEW PAGE----------------------', this.timer);
		// 	}
		// });
		// this.getDuration();

	}
	// // TESTING ACTIVE DURATION
	// private getDuration() {
	// 	const component = this; // value of this is null/undefined inside the funtions
	// 	let isVisible = true; // internal flag, defaults to true
	// 	function onVisible() {
	// 		// prevent double execution
	// 		if (isVisible) {
	// 			return;
	// 		}
	// 		console.log(' APP is VISIBLE-------------------------------------------------------');
	// 		component.timerService.start();
	// 		console.log("TIME RESET FOR THE NEW PAGE----------------------", component.timer);
	// 		// change flag value
	// 		isVisible = true;
	// 	} // end of onVisible
	// 	function onHidden() {
	// 		// prevent double execution
	// 		if (!isVisible) {
	// 			return;
	// 		}
	// 		console.log(' APP is HIDDEN-------------------------------------------------------');
	// 		const time = component.timerService.stop();
	// 		component.activeTime = component.activeTime + time; // eg 10sec
	// 		console.log('TOTAL TIME IS SET----------------------', component.activeTime);
	// 		// change flag value
	// 		isVisible = false;
	// 	} // end of onHidden
	// 	function handleVisibilityChange(forcedFlag) {
	// 		// forcedFlag is a boolean when this event handler is triggered by a
	// 		// focus or blur eventotherwise it's an Event object
	// 		if (typeof forcedFlag === 'boolean') {
	// 			if (forcedFlag) {
	// 				return onVisible();
	// 			}
	// 			return onHidden();
	// 		}
	// 		if (document.hidden) {
	// 			return onHidden();
	// 		}
	// 		return onVisible();
	// 	} // end of handleVisibilityChange
	// 	document.addEventListener('visibilitychange', handleVisibilityChange, false);
	// 	// extra event listeners for better behaviour
	// 	document.addEventListener('focus', () => {
	// 		handleVisibilityChange(true);
	// 	}, false);
	// 	document.addEventListener('blur', () => {
	// 		handleVisibilityChange(false);
	// 	}, false);
	// 	window.addEventListener('focus', () => {
	// 		handleVisibilityChange(true);
	// 	}, false);
	// 	window.addEventListener('blur', () => {
	// 		handleVisibilityChange(false);
	// 	}, false);
	// } // END OF DURATION
	canActivate(activatedRouteSnapshot: ActivatedRouteSnapshot, routerStateSnapshot: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean | UrlTree{
		// this.interTime = Date.now();
		this.focusDurationCounter = this.timerService.getFocusDurationCounter();
		this.blurDurationCounter = this.timerService.getBlurDurationCounter();

		if (routerStateSnapshot.url.includes('system-updates') &&
			(!this.adPolicy.IsSystemUpdateEnabled ||
				this.deviceService.isSMode)) {
			return this.router.parseUrl('/dashboard');
		}
		return true;
	}

	canDeactivate(component: object, activatedRouteSnapshot: ActivatedRouteSnapshot, routerStateSnapshot: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
		this.pageContext = activatedRouteSnapshot.data.pageContent;
		if (this.pageContext && this.pageContext.indexOf('[LocalStorageKey]') !== -1) {
			this.pageContext = this.commonService.getLocalStorageValue(this.pageContext);
		}
		//const time = this.timerService.stop();
		const focusDuration = this.focusDurationCounter !== null ? this.focusDurationCounter.getDuration() : 0;
		const blurDuration = this.blurDurationCounter !== null ? this.blurDurationCounter.getDuration() : 0;

		const data = {
			ItemType: 'PageView',
			PageName: activatedRouteSnapshot.data.pageName,
			PageDuration: focusDuration, // this.duration + parseInt(`${Math.floor((Date.now() - this.interTime) / 1000)}`, 10),
			PageDurationBlur: blurDuration
			// PageContext: this.pageContext, // value coming as undefined
		};
		console.log('------: Deactivate :------ ' + activatedRouteSnapshot.data.pageName, ' >>>>>>>>>> ', data);
		this.previousPageName = activatedRouteSnapshot.data.pageName;
		this.metrics.sendAsync(data);
		return true;
	}
}
