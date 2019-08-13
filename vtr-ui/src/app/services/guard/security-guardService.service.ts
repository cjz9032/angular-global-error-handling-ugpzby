import { CommonService } from '../common/common.service';
import { VantageShellService } from '../vantage-shell/vantage-shell.service';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';
import { TimerService } from 'src/app/services/timer/timer.service';

@Injectable({
	providedIn: 'root',
})
export class GuardService {
	interTime: number;
	metrics: any;
	pageContext: any;
	previousPageName = '';
	private timerService;

	constructor(
		private shellService: VantageShellService,
		private commonService: CommonService) {
		this.metrics = shellService.getMetrics();
		this.timerService = new TimerService();
	}

	canActivate(activatedRouteSnapshot: ActivatedRouteSnapshot, routerStateSnapshot: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
		this.timerService.start();
		console.log('Activate : ' + activatedRouteSnapshot.data.pageName);
		return true;
	}

	canDeactivate(component: Object, activatedRouteSnapshot: ActivatedRouteSnapshot, routerStateSnapshot: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
		this.pageContext = activatedRouteSnapshot.data.pageContent;
		if (this.pageContext && this.pageContext.indexOf('[LocalStorageKey]') !== -1) {
			this.pageContext = this.commonService.getLocalStorageValue(this.pageContext);
		}

		const data = {
			ItemType: 'PageView',
			pageName: activatedRouteSnapshot.data.pageName,
			pageDuration: this.timerService.stop(),
			pageContext: this.pageContext,
		};
		console.log('Deactivate : ' + activatedRouteSnapshot.data.pageName, ' >>>>>>>>>> ', data);
		this.previousPageName = activatedRouteSnapshot.data.pageName;
		this.metrics.sendAsync(data);
		return true;
	}
}
