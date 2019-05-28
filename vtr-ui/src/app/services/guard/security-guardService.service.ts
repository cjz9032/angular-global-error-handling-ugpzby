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
	constructor(private shellService: VantageShellService,
				private commonService: CommonService) {
		this.metrics = shellService.getMetrics();
	}

	canActivate(activatedRouteSnapshot: ActivatedRouteSnapshot, routerStateSnapshot: RouterStateSnapshot): Observable<boolean>|Promise<boolean>|boolean {
		this.interTime = Date.now();
		console.log('Activate : ' + activatedRouteSnapshot.data.pageName);
		return true;
	}

	canDeactivate(component: Object, activatedRouteSnapshot: ActivatedRouteSnapshot, routerStateSnapshot: RouterStateSnapshot): Observable<boolean>|Promise<boolean>|boolean {
		this.pageContext = activatedRouteSnapshot.data.pageContent;
		const data = {
			ItemType: 'PageView',
			PageName: activatedRouteSnapshot.data.pageName,
			PageDuration: `${Math.floor((Date.now() - this.interTime) / 1000)}s`,
			PageContext: !this.pageContext ? null : this.commonService.getLocalStorageValue(this.pageContext),
		};
		console.log('Deactivate : ' + activatedRouteSnapshot.data.pageName, ' >>>>>>>>>> ', data);
		this.metrics.sendAsync(data);
		return true;
	}
}
