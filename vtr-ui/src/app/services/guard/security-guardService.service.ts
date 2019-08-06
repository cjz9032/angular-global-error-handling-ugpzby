import { CommonService } from '../common/common.service';
import { VantageShellService } from '../vantage-shell/vantage-shell.service';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';

@Injectable({
	providedIn: 'root',
})
export class GuardService {
	interTime: number;
	metrics: any;
	pageContext: any;
	previousPageName = '';

	constructor(private shellService: VantageShellService,
		private commonService: CommonService) {
		this.metrics = shellService.getMetrics();
	}

	canActivate(activatedRouteSnapshot: ActivatedRouteSnapshot, routerStateSnapshot: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
		this.interTime = Date.now();
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
			pageDuration: `${Math.floor((Date.now() - this.interTime) / 1000)}`,
			pageContext: this.pageContext,
		};
		console.log('Deactivate : ' + activatedRouteSnapshot.data.pageName, ' >>>>>>>>>> ', data);
		this.previousPageName = activatedRouteSnapshot.data.pageName;
		this.metrics.sendAsync(data);
		return true;
	}
}
