import { CommonService } from '../common/common.service';
import { VantageShellService } from '../vantage-shell/vantage-shell.service';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';

@Injectable({
	providedIn: 'root',
})
export class GuardService {
	interTime = 0;
	metrics: any;
	pageContext: any;
	previousPageName = '';
	duration = 0;

	constructor(private shellService: VantageShellService,
		private commonService: CommonService) {

	this.metrics = shellService.getMetrics();
	window.addEventListener('blur',()=>{
	this.duration =this.duration + parseInt(`${Math.floor((Date.now() - this.interTime) / 1000)}`);

})
window.addEventListener('focus',()=>{
	this.interTime=Date.now();

})

}

	canActivate(activatedRouteSnapshot: ActivatedRouteSnapshot, routerStateSnapshot: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
		this.interTime = Date.now();
		return true;
	}

	canDeactivate(component: Object, activatedRouteSnapshot: ActivatedRouteSnapshot, routerStateSnapshot: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
		this.pageContext = activatedRouteSnapshot.data.pageContent;
		if (this.pageContext && this.pageContext.indexOf('[LocalStorageKey]') !== -1) {
			this.pageContext = this.commonService.getLocalStorageValue(this.pageContext);
		}

		const data = {
			ItemType: 'PageView',
			PageName: activatedRouteSnapshot.data.pageName,
			PageDuration: this.duration + parseInt(`${Math.floor((Date.now() - this.interTime) / 1000)}`),
			PageContext: this.pageContext,
		};
		console.log('Deactivate : ' + activatedRouteSnapshot.data.pageName, ' >>>>>>>>>> ', data);
		this.previousPageName = activatedRouteSnapshot.data.pageName;
		this.metrics.sendAsync(data);
		return true;
	}
}
